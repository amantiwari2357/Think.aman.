
import { useState, useEffect, useRef, useContext } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendIcon, User, FileText, AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/App";
import { fetchChatHistory, sendMessage, fetchProblem } from "@/lib/api";
import { toast } from "sonner";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  userId: string;
  userName: string;
}

export default function Chat() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [chatExists, setChatExists] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch problem and chat details when component mounts
  useEffect(() => {
    if (!requestId || !user) return;

    loadChatData();
  }, [requestId, user]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatData = async () => {
    if (!requestId || !user) return;

    try {
      setIsLoading(true);

      // First, fetch the problem to get details
      const problemData = await fetchProblem(requestId);
      setProblem(problemData);

      // Then try to fetch chat history
      try {
        const history = await fetchChatHistory(requestId);
        setMessages(history);
        setChatExists(true);
      } catch (chatError) {
        // If chat doesn't exist (404), that's okay - it means no one has accepted this problem yet
        console.log('Chat not found, problem may not be accepted yet');
        setChatExists(false);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load chat data:", error);
      toast.error("Failed to load chat data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !requestId) return;

    // Check if chat exists before sending message
    if (!chatExists) {
      toast.error("Chat not available. Please accept this problem first.");
      return;
    }

    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: "user",
      userId: user.id,
      name: user.name || "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, tempMessage]);
    setNewMessage("");

    try {
      // Send message to API
      await sendMessage(requestId, user.id, newMessage);
      // Reload chat data to get the confirmed message
      await loadChatData();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      // Remove temp message if send fails
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 container py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 container py-6">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem not found</h3>
              <p className="text-gray-600 mb-4">The requested problem could not be found.</p>
              <Button onClick={() => navigate("/browse")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Browse
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Problem details sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Problem Details</CardTitle>
                <Badge
                  variant="outline"
                  className={`w-fit ${
                    problem.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    problem.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    problem.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{problem.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    {problem.category} Problem
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Problem Owner</h4>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {problem.userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{problem.userName}</p>
                    </div>
                  </div>
                </div>

                {!chatExists && problem.status === 'pending' && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-amber-600">Action Required</h4>
                    <p className="text-xs text-muted-foreground">
                      This problem needs to be accepted before you can start chatting.
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/requests/${problem.id}`)}
                    >
                      Accept Problem
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-12rem)]">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="border-b py-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <span>Chat: </span>
                    <div className="flex items-center mx-2">
                      <span className="text-sm font-medium">{problem.userName}</span>
                      <span className="mx-1 text-sm font-medium">/</span>
                      <span className="text-sm font-medium">{user?.name || 'Expert'}</span>
                    </div>
                  </CardTitle>
                  <Badge variant="outline">Problem #{requestId}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                {chatExists ? (
                  messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                      <p className="text-gray-600">Start the conversation by sending a message below.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.userId === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              message.userId === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium">{message.name}</span>
                              <span className="text-xs opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <AlertCircle className="h-12 w-12 text-amber-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Not Available</h3>
                    <p className="text-gray-600 mb-4">
                      This problem needs to be accepted before you can start chatting.
                    </p>
                    <Button onClick={() => navigate(`/requests/${problem.id}`)}>
                      Accept Problem to Start Chat
                    </Button>
                  </div>
                )}
              </CardContent>
              {chatExists && (
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={!chatExists || !user}
                    />
                    <Button type="submit" size="icon" disabled={!chatExists || !user || !newMessage.trim()}>
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
