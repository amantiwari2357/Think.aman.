
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { Footer } from "@/components/Footer";
import { AuthContext } from "@/App";
import { PostFeed } from "@/components/PostFeed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFollows } from "@/hooks/use-realtime";
import { toast } from "sonner";
import { UserPlus, UserMinus, Users, Newspaper, Fingerprint } from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState<{
    id: string;
    name: string;
    avatar?: string;
    industry: string;
    bio?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    followersCount, 
    followingCount, 
    isFollowing, 
    followUser, 
    unfollowUser 
  } = useFollows(user?.id || null);

  // Mocked user data - in a real app, this would fetch from an API
  useState(() => {
    // Simulating API call
    setTimeout(() => {
      setProfileUser({
        id: userId || "user123",
        name: "John Doe",
        avatar: "", // No avatar, will use fallback
        industry: "Technology",
        bio: "Software developer with 5 years of experience. Passionate about React and TypeScript."
      });
      setLoading(false);
    }, 1000);
  });

  const handleFollow = async () => {
    if (!user) {
      toast.error("Please log in to follow users");
      return;
    }
    
    if (!profileUser) return;
    
    try {
      if (isFollowing(profileUser.id)) {
        await unfollowUser(profileUser.id);
        toast.success(`You unfollowed ${profileUser.name}`);
      } else {
        await followUser(profileUser.id);
        toast.success(`You are now following ${profileUser.name}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const isOwnProfile = user?.id === userId;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AuthenticatedNavbar />
        <main className="flex-1 container py-12">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <Skeleton className="h-12 w-full max-w-xs" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <AuthenticatedNavbar />
        <main className="flex-1 container py-12">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground">The user you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AuthenticatedNavbar />
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
              <AvatarFallback className="text-4xl">
                {profileUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                  <Fingerprint className="h-4 w-4" />
                  <span>ID: {profileUser.id}</span>
                </div>
                <p className="text-muted-foreground mt-1">{profileUser.industry}</p>
              </div>
              
              {profileUser.bio && (
                <p className="max-w-prose">{profileUser.bio}</p>
              )}
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span><strong>{followersCount}</strong> followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span><strong>{followingCount}</strong> following</span>
                </div>
              </div>
              
              {!isOwnProfile && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing(profileUser.id) ? "outline" : "default"}
                >
                  {isFollowing(profileUser.id) ? (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Tabs for different content sections */}
          <Tabs defaultValue="posts" className="w-full mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="posts">
                <Newspaper className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <PostFeed userId={profileUser.id} showFilters={true} />
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About {profileUser.name}</CardTitle>
                  <CardDescription>More information about this user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Industry</h3>
                    <p>{profileUser.industry}</p>
                  </div>
                  {profileUser.bio && (
                    <div>
                      <h3 className="font-medium">Bio</h3>
                      <p>{profileUser.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
