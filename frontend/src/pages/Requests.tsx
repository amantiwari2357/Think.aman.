import { useState, useEffect, useContext } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MessageSquare, FileUp, Clock, CheckCircle, User, Loader2 } from "lucide-react";
import { AuthContext } from "@/App";
import { fetchProblems } from "@/lib/api";
import { toast } from "sonner";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  experts: number;
  userId: string;
  userName: string;
  codeFile?: {
    filename: string;
    originalName: string;
    size: number;
  };
}

export default function Requests() {
  const [requests, setRequests] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadRequests();
  }, [user, refreshKey]);

  const loadRequests = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchProblems({
        page: 1,
        limit: 50 // Get more requests to show all
      });

      // Convert backend format to frontend format
      const formattedRequests: Problem[] = response.problems
        .filter(problem => problem.userId === user.id) // Filter for current user's problems
        .map(problem => ({
          id: problem.id,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          status: problem.status as 'pending' | 'in-progress' | 'resolved' | 'closed',
          createdAt: problem.createdAt,
          experts: problem.experts,
          userId: problem.userId,
          userName: problem.userName,
          codeFile: problem.codeFile
        }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Failed to load requests:', error);
      toast.error("Failed to load your requests");
    } finally {
      setIsLoading(false);
    }
  };

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
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Resolved</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRequestTypeIcon = (request: Problem) => {
    if (request.codeFile) {
      return <FileUp className="h-5 w-5 text-primary" />;
    }
    return <MessageSquare className="h-5 w-5 text-primary" />;
  };

  const refreshRequests = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">Track and manage your submitted problems and code reviews</p>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any problems or code reviews yet.</p>
              <Button asChild>
                <Link to="/post-problem">Post Your First Problem</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getRequestTypeIcon(request)}
                      <div>
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {request.description.length > 150
                            ? `${request.description.substring(0, 150)}...`
                            : request.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.userName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(request.createdAt)}
                      </span>
                      <Badge variant="secondary">{request.category}</Badge>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/requests/${request.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
