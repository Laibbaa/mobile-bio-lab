import passport from "passport";
import "dotenv/config";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "../models/user";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[AUTH] Login attempt for username: "${username}"`);
        const user = await storage.getUserByUsername(username);

        if (!user) {
          console.log(`[AUTH] User not found: "${username}"`);
          return done(null, false);
        }

        console.log(`[AUTH] User found: ${user.username}`);
        const passwordMatch = await comparePasswords(password, user.password);
        console.log(`[AUTH] Password match: ${passwordMatch}`);

        if (!passwordMatch) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        console.error("[AUTH] Error during login:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      username: req.body.username.toLowerCase(),
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", (req, res, next) => {
    console.log(`[AUTH] Login request body:`, req.body);
    passport.authenticate(
      "local",
      (err: any, user: Express.User | false, info: any) => {
        if (err) {
          console.error("[AUTH] Authentication error:", err);
          return next(err);
        }
        if (!user) {
          console.log("[AUTH] Authentication failed:", info);
          return res.status(401).json({ error: "Invalid credentials" });
        }

        req.logIn(user, (err) => {
          if (err) {
            console.error("[AUTH] Login error:", err);
            return next(err);
          }
          console.log("[AUTH] Login successful for user:", user.username);
          return res.status(200).json(user);
        });
      }
    )(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
