
import { useState, useEffect, useRef, useContext } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendIcon, User, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/App";
import { fetchChatHistory, sendMessage } from "@/lib/api";
import { toast } from "sonner";

// Mock data for chat participants
const MOCK_PARTICIPANTS = {
  expert: { id: "expert-1", name: "Jane Smith", avatar: "/avatar-placeholder.jpg" },
  user: { id: "user-1", name: "Aman Khanna", avatar: null },
};

export default function Chat() {
  const { requestId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chat history when component mounts
  useEffect(() => {
    if (!requestId) return;
    
    async function loadChatHistory() {
      try {
        setIsLoading(true);
        const history = await fetchChatHistory(requestId);
        setMessages(history);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        toast.error("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadChatHistory();
  }, [requestId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !requestId) return;
    
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
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      
      // Remove temp message if send fails
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    }
  };

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
                <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100 w-fit">
                  Accepted
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">React useState not updating correctly</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    Code Problem
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Expert</h4>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={MOCK_PARTICIPANTS.expert.avatar || ""} />
                      <AvatarFallback>{MOCK_PARTICIPANTS.expert.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{MOCK_PARTICIPANTS.expert.name}</p>
                      <p className="text-xs text-muted-foreground">React Specialist</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Requester</h4>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={MOCK_PARTICIPANTS.user.avatar || ""} />
                      <AvatarFallback>{MOCK_PARTICIPANTS.user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{MOCK_PARTICIPANTS.user.name}</p>
                      <p className="text-xs text-muted-foreground">Problem Owner</p>
                    </div>
                  </div>
                </div>
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
                      <span className="text-sm font-medium">{MOCK_PARTICIPANTS.user.name}</span>
                      <span className="mx-1 text-sm font-medium">/</span>
                      <span className="text-sm font-medium">{MOCK_PARTICIPANTS.expert.name}</span>
                    </div>
                  </CardTitle>
                  <Badge variant="outline">Request #{requestId}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {message.sender !== "user" && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={MOCK_PARTICIPANTS.expert.avatar || ""} />
                                <AvatarFallback>{MOCK_PARTICIPANTS.expert.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                            )}
                            <span className="text-xs font-medium">{message.name}</span>
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isLoading || !user}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !user}>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
