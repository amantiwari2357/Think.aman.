
import { useState, useEffect, useContext } from "react";
import { PostItem } from "./PostItem";
import { fetchPosts } from "@/lib/api";
import { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/App";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreatePost } from "./CreatePost";

interface PostFeedProps {
  industry?: string;
  userId?: string;
  showFilters?: boolean;
}

export function PostFeed({ industry, userId, showFilters = true }: PostFeedProps) {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const loadPosts = async (reset = false) => {
    setLoading(true);
    
    try {
      const newPage = reset ? 1 : page;
      const result = await fetchPosts({
        industry: industry || "",
        type: selectedType === "all" ? "" : selectedType,
        userId: userId || "",
        page: newPage,
        limit: 10
      });
      
      if (reset) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      
      setHasMore(newPage < result.totalPages);
      if (!reset) setPage(newPage + 1);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPosts(true);
  }, [industry, userId, selectedType]);
  
  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };
  
  const handlePostArchived = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isArchived: true } : post
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{userId ? "My Posts" : "Latest Posts"}</h2>
        {user && <CreatePost onPostCreated={() => loadPosts(true)} />}
      </div>
      
      {showFilters && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full max-w-xs">
            <Label htmlFor="post-type-filter">Filter by type</Label>
            <Select 
              value={selectedType} 
              onValueChange={setSelectedType}
            >
              <SelectTrigger id="post-type-filter">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="meme">Memes</SelectItem>
                <SelectItem value="joke">Jokes</SelectItem>
                <SelectItem value="information">Information</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {loading && posts.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              isOwner={user?.id === post.userId} 
              onDelete={handlePostDeleted}
              onArchive={handlePostArchived}
            />
          ))}
          
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => loadPosts(false)} 
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
