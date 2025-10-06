import { useContext, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileUp, MessageSquare, Briefcase, Users, BookOpen, 
  BarChart, FileText, Bell, UserPlus, Fingerprint, 
  Search, UserMinus, UserX, Eye 
} from "lucide-react";
import { AuthContext } from "@/App";
import { IndustryOptions } from "@/lib/constants";
import { PostFeed } from "@/components/PostFeed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { useNotifications, useFollows, useInitializeRealTime } from "@/hooks/use-realtime";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount } = useNotifications();
  const { 
    followersCount, followingCount, followUser, unfollowUser, 
    isFollowing, isBlocked, blockUser, unblockUser 
  } = useFollows(user?.id || null);
  const { isConnected } = useInitializeRealTime(user?.id || null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await import("@/lib/api").then(({ searchUsers }) =>
        searchUsers(query, user?.id)
      );

      console.log('Search API response:', response);
      console.log('Search users array:', response.users);

      // Get current following status from localStorage to ensure accuracy
      const followsData = JSON.parse(localStorage.getItem('followsData') || '{}');
      const currentUserFollowing = followsData[user?.id]?.following || [];

      // Transform API response to match our UI expectations
      const transformedResults = response.users.map((apiUser: any) => {
        console.log('Processing API user:', apiUser);
        console.log('API user id:', apiUser.id);
        console.log('API user name:', apiUser.name);
        console.log('API user id type:', typeof apiUser.id);

        return {
          id: apiUser.id,
          name: apiUser.name,
          industry: apiUser.industry,
          avatar: apiUser.avatar,
          isFollowing: currentUserFollowing.includes(apiUser.id), // Use localStorage data for accuracy
          isBlocked: false, // For now, assume not blocked
          bio: apiUser.skills?.join(", ") || apiUser.bio || "No bio available"
        };
      });

      console.log('Transformed results:', transformedResults);
      setSearchResults(transformedResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback to no results if API fails
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    searchUsers(query);
  };

  const handleFollowToggle = async (targetUserId: string, currentlyFollowing: boolean) => {
    console.log('handleFollowToggle called with:', { targetUserId, currentlyFollowing });
    console.log('Current user:', user?.id);
    console.log('Current user object:', user);

    if (!user?.id) {
      console.error('User not logged in');
      toast.error("Please log in to follow users");
      return;
    }

    if (!targetUserId) {
      console.error('Target user ID is empty:', targetUserId);
      toast.error("Invalid user selected");
      return;
    }

    try {
      if (currentlyFollowing) {
        await unfollowUser(targetUserId);
        toast.success("User unfollowed successfully");
        // Update search results state immediately
        setSearchResults(prev =>
          prev.map(user =>
            user.id === targetUserId ? { ...user, isFollowing: false } : user
          )
        );
      } else {
        console.log('About to call followUser with targetUserId:', targetUserId);
        await followUser(targetUserId);
        toast.success("User followed successfully");
        // Update search results state immediately
        setSearchResults(prev =>
          prev.map(user =>
            user.id === targetUserId ? { ...user, isFollowing: true } : user
          )
        );
      }

      // Refresh search results to ensure consistency
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      }
    } catch (error) {
      console.error("Follow/unfollow failed:", error);
      toast.error("Failed to update follow status");
    }
  };

  const handleBlockToggle = async (targetUserId: string, currentlyBlocked: boolean) => {
    try {
      if (currentlyBlocked) {
        await unblockUser(targetUserId);
        setSearchResults(prev =>
          prev.map(user =>
            user.id === targetUserId ? { ...user, isBlocked: false } : user
          ).filter(user => !user.isBlocked)
        );
      } else {
        await blockUser(targetUserId);
        setSearchResults(prev =>
          prev.map(user =>
            user.id === targetUserId ? { ...user, isBlocked: true } : user
          )
        );
      }
    } catch (error) {
      console.error("Block/unblock failed:", error);
    }
  };

  const handleViewProfile = (userId: string) => {
    window.location.href = `/profile/${userId}`;
  };

  const industryLabel = user
    ? IndustryOptions.all.find(ind => ind.value === user.industry)?.label || user.industry
    : "";

  const getIndustryResources = (industry: string) => {
    switch (industry) {
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

                  <div className="w-full mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {showSearchResults && (
                    <div className="w-full mb-4">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {isSearching ? (
                          <p className="text-sm text-muted-foreground text-center py-2">Searching...</p>
                        ) : searchResults.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">No users found</p>
                        ) : (
                          searchResults.map((searchUser) => {
                            // Skip users without valid IDs or names
                            if (!searchUser.id || !searchUser.name) {
                              console.warn('Skipping search result user without ID or name:', searchUser);
                              return null;
                            }

                            return (
                            <div key={searchUser.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={searchUser.avatar} alt={searchUser.name} />
                                  <AvatarFallback className="text-xs">{searchUser.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{searchUser.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{searchUser.bio}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {searchUser.industry}
                                </Badge>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant={searchUser.isFollowing ? "outline" : "default"}
                                    onClick={() => {
                                      console.log('Follow button clicked for user:', searchUser);
                                      console.log('Search user id:', searchUser.id);
                                      handleFollowToggle(searchUser.id, searchUser.isFollowing);
                                    }}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {searchUser.isFollowing ? (
                                      <>
                                        <UserMinus className="h-3 w-3 mr-1" />
                                        Unfollow
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus className="h-3 w-3 mr-1" />
                                        Follow
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewProfile(searchUser.id)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={searchUser.isBlocked ? "destructive" : "outline"}
                                    onClick={() => handleBlockToggle(searchUser.id, searchUser.isBlocked)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {searchUser.isBlocked ? (
                                      <>
                                        <UserX className="h-3 w-3 mr-1" />
                                        Unblock
                                      </>
                                    ) : (
                                      <>
                                        <UserX className="h-3 w-3 mr-1" />
                                        Block
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                          }).filter(Boolean)
                        )}
                      </div>
                    </div>
                  )}

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
