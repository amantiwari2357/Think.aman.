
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MessageSquare, FileUp, Clock, CheckCircle, User } from "lucide-react";

// Mock data for demonstration
const mockRequests = [
  {
    id: "req-1",
    title: "React useState not updating correctly",
    category: "react",
    type: "code",
    status: "pending",
    date: "2023-06-15T12:00:00Z",
    experts: 0,
  },
  {
    id: "req-2",
    title: "How to implement authentication in React",
    category: "react",
    type: "problem",
    status: "accepted",
    date: "2023-06-14T10:30:00Z",
    experts: 1,
  },
  {
    id: "req-3",
    title: "Database optimization for large datasets",
    category: "database",
    type: "problem",
    status: "pending",
    date: "2023-06-12T15:45:00Z",
    experts: 2,
  },
];

export default function Requests() {
  const [requests] = useState(mockRequests);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Accepted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Your Requests</h1>
              <p className="text-muted-foreground">
                Track and manage the problems you've posted for help
              </p>
            </div>
            <div className="flex space-x-2">
              <Link to="/post-code">
                <Button variant="outline" size="sm">
                  <FileUp className="mr-2 h-4 w-4" />
                  Post Code
                </Button>
              </Link>
              <Link to="/post-problem">
                <Button size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Post Problem
                </Button>
              </Link>
            </div>
          </div>

          {requests.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground mb-4">You haven't posted any requests yet</p>
                <Link to="/post-problem">
                  <Button>Post Your First Problem</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          {request.type === "code" ? (
                            <FileUp className="h-5 w-5 text-primary" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-primary" />
                          )}
                          <h3 className="text-lg font-semibold">{request.title}</h3>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center">
                          <Badge variant="secondary">{request.category}</Badge>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {formatDate(request.date)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {request.experts} {request.experts === 1 ? "expert" : "experts"} interested
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link to={`/request/${request.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        {request.status === "accepted" && (
                          <Link to={`/chat/${request.id}`}>
                            <Button size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Open Chat
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
