import { useContext, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileUp, MessageSquare, Briefcase, Users, BookOpen, 
  BarChart, FileText, Bell, UserPlus, Fingerprint, 
  Search, UserMinus, UserX, Eye, UserCheck, User
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

  // State for followers/following popups
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

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

  // Handle followers/following popup functions
  const handleShowFollowers = async () => {
    setIsLoadingFollowers(true);
    setShowFollowersPopup(true);
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you'd fetch from API
      setFollowersList([
        { id: '1', name: 'John Doe', avatar: null, industry: 'Technology' },
        { id: '2', name: 'Jane Smith', avatar: null, industry: 'Healthcare' },
      ]);
    } catch (error) {
      toast.error("Failed to load followers");
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  const handleShowFollowing = async () => {
    setIsLoadingFollowing(true);
    setShowFollowingPopup(true);
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you'd fetch from API
      setFollowingList([
        { id: '3', name: 'Alice Johnson', avatar: null, industry: 'Finance' },
        { id: '4', name: 'Bob Wilson', avatar: null, industry: 'Education' },
      ]);
    } catch (error) {
      toast.error("Failed to load following");
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const handleCloseFollowersPopup = () => {
    setShowFollowersPopup(false);
    setFollowersList([]);
  };

  const handleCloseFollowingPopup = () => {
    setShowFollowingPopup(false);
    setFollowingList([]);
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

                  {/* Followers and Following Section */}
                  <div className="w-full mb-4 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Followers</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShowFollowers}
                        className="text-primary hover:text-primary/80"
                      >
                        {followersCount}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Following</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShowFollowing}
                        className="text-primary hover:text-primary/80"
                      >
                        {followingCount}
                      </Button>
                    </div>
                  </div>

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

                  {/* Followers Section - Show after search when there are results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="w-full mt-4">
                      <div className="bg-muted/20 p-4 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-3">
                          <Users className="h-4 w-4 text-primary" />
                          <h3 className="text-sm font-semibold">Recent Activity</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-background rounded">
                            <span className="text-xs text-muted-foreground">Followers this week</span>
                            <Badge variant="secondary" className="text-xs">+{Math.floor(Math.random() * 5) + 1}</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-background rounded">
                            <span className="text-xs text-muted-foreground">New connections</span>
                            <Badge variant="secondary" className="text-xs">+{Math.floor(Math.random() * 3) + 1}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6 w-full">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Recent Notifications</h2>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground mb-2">No notifications yet</p>
                    <p className="text-xs text-muted-foreground">Follow users or interact with posts to see notifications here</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <li key={notification.id || Math.random()} className="flex items-start p-3 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors">
                        <div className="mr-3 mt-1">
                          {notification.icon === 'new_follower' || notification.type === 'new_follower' ? (
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                              <UserPlus className="h-4 w-4 text-pink-600" />
                            </div>
                          ) : notification.icon === 'new_like' || notification.type === 'new_like' ? (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-sm">❤️</span>
                            </div>
                          ) : notification.icon === 'new_comment' || notification.type === 'new_comment' ? (
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 text-sm">💬</span>
                            </div>
                          ) : notification.icon === 'new_problem' || notification.type === 'new_problem' ? (
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-sm">🚨</span>
                            </div>
                          ) : notification.icon === 'problem_accepted' || notification.type === 'problem_accepted' ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">✅</span>
                            </div>
                          ) : notification.icon === 'new_message' || notification.type === 'new_message' ? (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">💬</span>
                            </div>
                          ) : notification.icon === 'expert_available' || notification.type === 'expert_available' ? (
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-sm">⭐</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Bell className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message || 'New notification'}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {notification.timestamp
                                ? new Date(notification.timestamp).toLocaleString([], {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : 'Just now'
                              }
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>

                          {/* Action buttons for follow-related notifications */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={action.variant || 'outline'}
                                  onClick={action.onClick}
                                  className="text-xs h-7"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
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

      {/* Followers Popup */}
      {showFollowersPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Followers</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseFollowersPopup}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              {isLoadingFollowers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading followers...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {followersList.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No followers yet</p>
                  ) : (
                    followersList.map((follower) => (
                      <div key={follower.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={follower.avatar} alt={follower.name} />
                          <AvatarFallback>{follower.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{follower.name}</p>
                          <p className="text-xs text-muted-foreground">{follower.industry}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Profile
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Following</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseFollowingPopup}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              {isLoadingFollowing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading following...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {followingList.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Not following anyone yet</p>
                  ) : (
                    followingList.map((following) => (
                      <div key={following.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={following.avatar} alt={following.name} />
                          <AvatarFallback>{following.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{following.name}</p>
                          <p className="text-xs text-muted-foreground">{following.industry}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Profile
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
