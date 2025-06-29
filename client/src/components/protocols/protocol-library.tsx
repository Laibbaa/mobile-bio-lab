import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Protocol } from "@shared/schema";

export default function ProtocolLibrary() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: protocols = [], isLoading } = useQuery<Protocol[]>({
    queryKey: ["/api/protocols"],
  });

  const filteredProtocols = protocols
    .filter(protocol =>
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 6); // Show only first 6 for dashboard

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "review": return "bg-warning text-warning-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("water")) return "💧";
    if (categoryLower.includes("soil")) return "🌱";
    if (categoryLower.includes("plant")) return "🌿";
    if (categoryLower.includes("micro") || categoryLower.includes("bio")) return "🧪";
    if (categoryLower.includes("air")) return "💨";
    return "🔬";
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Protocol Library
          </CardTitle>
          <Link href="/protocols">
            <Button variant="ghost" size="sm" className="text-primary hover:underline flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : filteredProtocols.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No protocols found</p>
              {searchQuery && (
                <p className="text-sm">Try adjusting your search terms</p>
              )}
            </div>
          ) : (
            filteredProtocols.map((protocol) => (
              <div
                key={protocol.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">
                      {getCategoryIcon(protocol.category)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground line-clamp-1">
                      {protocol.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {protocol.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(protocol.status)}>
                    {protocol.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {!searchQuery && protocols.length > 6 && (
          <div className="mt-4 text-center">
            <Link href="/protocols">
              <Button variant="outline" size="sm">
                View All Protocols ({protocols.length})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
