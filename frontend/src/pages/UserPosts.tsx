
import { useContext } from "react";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { Footer } from "@/components/Footer";
import { PostFeed } from "@/components/PostFeed";
import { AuthContext } from "@/App";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserPosts() {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return null; // Should be handled by route protection
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <AuthenticatedNavbar />
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-6">
          Manage Your Posts
        </h1>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <PostFeed userId={user.id} showFilters={true} />
          </TabsContent>
          
          <TabsContent value="active">
            {/* In a real app, add filter for active posts */}
            <PostFeed userId={user.id} showFilters={true} />
          </TabsContent>
          
          <TabsContent value="archived">
            {/* In a real app, add filter for archived posts */}
            <PostFeed userId={user.id} showFilters={true} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
