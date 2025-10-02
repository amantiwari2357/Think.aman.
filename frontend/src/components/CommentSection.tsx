
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/types";
import { commentOnPost } from "@/lib/api";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "@/App";

interface CommentSectionProps {
  post: Post;
}

export function CommentSection({ post }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);
  const { user } = useContext(AuthContext);
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    try {
      const newComment = await commentOnPost(
        post.id, 
        user.id, 
        user.name, 
        commentText.trim()
      );
      
      setComments([...comments, newComment]);
      setCommentText("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  };
  
  return (
    <div className="px-6 py-3 bg-muted/20 rounded-b-lg">
      <Separator className="mb-4" />
      
      <div className="space-y-4 mb-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="font-medium text-sm">{comment.userName}</div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleAddComment} className="flex gap-2">
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!commentText.trim()}>
          Post
        </Button>
      </form>
    </div>
  );
}
