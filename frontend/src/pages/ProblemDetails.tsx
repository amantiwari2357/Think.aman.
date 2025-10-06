import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  FileUp,
  Clock,
  CheckCircle,
  User,
  Loader2,
  ArrowLeft,
  Send,
  Code,
  FileText,
  AlertCircle
} from "lucide-react";
import { AuthContext } from "@/App";
import { fetchProblem, acceptProblem, createChat } from "@/lib/api";
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

export default function ProblemDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptMessage, setAcceptMessage] = useState("");

  useEffect(() => {
    if (requestId) {
      loadProblemDetails();
    }
  }, [requestId]);

  const loadProblemDetails = async () => {
    if (!requestId) return;

    try {
      setIsLoading(true);
      const problemData = await fetchProblem(requestId);

      setProblem({
        id: problemData.id,
        title: problemData.title,
        description: problemData.description,
        category: problemData.category,
        status: problemData.status as 'pending' | 'in-progress' | 'resolved' | 'closed',
        createdAt: problemData.createdAt,
        experts: problemData.experts,
        userId: problemData.userId,
        userName: problemData.userName,
        codeFile: problemData.codeFile
      });
    } catch (error) {
      console.error('Failed to load problem details:', error);
      toast.error(error instanceof Error ? error.message : "Failed to load problem details");
      navigate("/requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptProblem = async () => {
    if (!user || !problem || !requestId) return;

    try {
      setIsAccepting(true);

      // Accept the problem
      await acceptProblem(requestId, user.id);

      // Create a chat between problem owner and accepter
      const chatData = {
        problemId: requestId,
        participants: [problem.userId, user.id],
        problemTitle: problem.title,
        createdBy: user.id
      };

      await createChat(chatData);

      toast.success("Problem accepted! Chat created with problem owner.");
      navigate(`/chat/${requestId}`);
    } catch (error) {
      console.error('Failed to accept problem:', error);
      toast.error("Failed to accept problem");
    } finally {
      setIsAccepting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getRequestTypeIcon = () => {
    if (problem?.codeFile) {
      return <FileUp className="h-5 w-5 text-primary" />;
    }
    return <MessageSquare className="h-5 w-5 text-primary" />;
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

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem not found</h3>
              <p className="text-gray-600 mb-4">The requested problem could not be found.</p>
              <Button onClick={() => navigate("/requests")}>
                Back to Requests
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const canAccept = user && problem.userId !== user.id && problem.status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/requests")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
          <div className="flex items-center gap-3 mb-2">
            {getRequestTypeIcon()}
            <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
            {getStatusBadge(problem.status)}
          </div>
          <p className="text-gray-600">Detailed view of the problem</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <Badge variant="secondary">{problem.category}</Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
                  </div>
                </div>

                {problem.codeFile && (
                  <div>
                    <h3 className="font-semibold mb-2">Attached Code</h3>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Code className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{problem.codeFile.originalName}</span>
                      <Badge variant="outline" className="text-xs">
                        {(problem.codeFile.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accept Problem Section */}
            {canAccept && (
              <Card>
                <CardHeader>
                  <CardTitle>Accept This Problem</CardTitle>
                  <CardDescription>
                    Help solve this problem and start a conversation with the problem owner.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Message to Problem Owner (Optional)
                    </label>
                    <Textarea
                      placeholder="Introduce yourself and explain how you can help..."
                      value={acceptMessage}
                      onChange={(e) => setAcceptMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={handleAcceptProblem}
                    disabled={isAccepting}
                    className="w-full"
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Problem
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!canAccept && (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {problem.userId === user?.id
                      ? "This is your own problem"
                      : `Problem ${problem.status === 'pending' ? 'already accepted' : 'is ' + problem.status}`}
                  </h3>
                  <p className="text-gray-600">
                    {problem.userId === user?.id
                      ? "You cannot accept your own problems."
                      : problem.status === 'pending'
                      ? "This problem has already been accepted by another expert."
                      : `This problem is currently ${problem.status}.`}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Problem Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Problem Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Posted by:</span> {problem.userName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Posted:</span> {formatDate(problem.createdAt)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Status:</span>
                  </span>
                  {getStatusBadge(problem.status)}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/requests")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Requests
                </Button>

                {problem.status === 'in-progress' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/chat/${problem.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
