import { useContext } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUp, MessageSquare, Briefcase, Users, BookOpen, BarChart, FileText, Bell, UserPlus, Fingerprint } from "lucide-react";
import { AuthContext } from "@/App";
import { IndustryOptions } from "@/lib/constants";
import { PostFeed } from "@/components/PostFeed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/hooks/use-realtime";
import { useFollows } from "@/hooks/use-realtime";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount } = useNotifications();
  const { followersCount, followingCount } = useFollows(user?.id || null);

  const industryLabel = user ? 
    IndustryOptions.all.find(industry => industry.value === user.industry)?.label || 
    user.industry : 
    "";

  const getIndustryResources = (industry: string) => {
    switch(industry) {
      case "technology":
        return {
          title: "Technology Resources",
          description: "Access the latest tech tools and frameworks",
          resources: [
            "Latest Stack Overflow trends",
            "GitHub repositories for common tech problems",
            "Popular frameworks documentation"
          ]
        };
      case "healthcare":
        return {
          title: "Healthcare Resources",
          description: "Access medical resources and compliance guides",
          resources: [
            "HIPAA compliance checklists",
            "EHR integration guides",
            "Patient data security best practices"
          ]
        };
      case "legal":
        return {
          title: "Legal Resources",
          description: "Access case studies and legal frameworks",
          resources: [
            "Contract templates",
            "Precedent case studies",
            "Legal research tools"
          ]
        };
      case "finance":
        return {
          title: "Finance Resources",
          description: "Access financial analytics and compliance guides",
          resources: [
            "SEC compliance checklists",
            "Financial modeling templates",
            "Risk assessment frameworks"
          ]
        };
      case "education":
        return {
          title: "Education Resources",
          description: "Access teaching tools and curriculum resources",
          resources: [
            "Curriculum development guides",
            "Student engagement strategies",
            "Learning assessment tools"
          ]
        };
      default:
        return {
          title: "Industry Resources",
          description: "Access resources specific to your industry",
          resources: [
            "General best practices",
            "Networking opportunities",
            "Knowledge sharing platforms"
          ]
        };
    }
  };
  
  const industryResources = user ? getIndustryResources(user.industry) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
              {user ? `Welcome to your ${industryLabel} Dashboard` : "Welcome to your Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              This is where you'll manage your requests, posts, and collaborations.
            </p>
          </div>
          
          {user && (
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Card className="p-6 w-full md:w-auto md:min-w-80">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                  <div className="flex items-center text-xs text-muted-foreground mb-2 gap-1">
                    <Fingerprint className="h-3 w-3" />
                    <span>ID: {user.id}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{industryLabel}</p>
                  
                  <div className="flex justify-center gap-6 mb-4">
                    <div className="text-center">
                      <p className="font-bold">{followersCount}</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{followingCount}</p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>
                  
                  <Link to="/profile" className="w-full">
                    <Button variant="outline" className="w-full">Edit Profile</Button>
                  </Link>
                </div>
              </Card>
              
              <Card className="p-6 w-full">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Recent Notifications</h2>
                </div>
                
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No notifications yet</p>
                ) : (
                  <ul className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <li key={notification.id} className="flex items-start p-2 rounded-md bg-muted/50">
                        <div className="mr-3 mt-1">
                          {notification.type === 'new_follower' ? (
                            <UserPlus className="h-4 w-4 text-pink-500" />
                          ) : notification.type === 'new_like' ? (
                            <span className="text-red-500">❤️</span>
                          ) : notification.type === 'new_comment' ? (
                            <span className="text-indigo-500">💬</span>
                          ) : (
                            <Bell className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {notifications.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/notifications">
                      <Button variant="link" className="text-sm">View all notifications</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          )}
          
          {user && industryResources && (
            <div className="bg-muted/40 p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{industryResources.title}</h2>
              </div>
              <p className="mb-3 text-muted-foreground">{industryResources.description}</p>
              <ul className="space-y-2">
                {industryResources.resources.map((resource, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Your Requests</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Track and manage the problems you've posted for help.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  <Link to="/requests" className="w-full">View Requests</Link>
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Your Posts</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Manage your memes, jokes, and information posts.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  <Link to="/posts" className="w-full">Manage Posts</Link>
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Your Solutions</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  See the problems you've helped solve and your contributions.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  <Link to="/solutions" className="w-full">View Solutions</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Post a New Problem</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Send File with Code</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload your code files and get expert help with specific implementation issues.
                  </p>
                  <Button className="mt-4 w-full">
                    <Link to="/post-code" className="w-full">Upload Code</Link>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Post Problem Description</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Describe your problem in detail and get matched with the right expert.
                  </p>
                  <Button className="mt-4 w-full">
                    <Link to="/post-problem" className="w-full">Describe Problem</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="mt-8">
              <PostFeed industry={user.industry} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
