
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updatePost } from "@/lib/api";
import { toast } from "sonner";
import { Post } from "@/lib/types";

interface EditPostDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated?: (updatedPost: Post) => void;
}

export function EditPostDialog({ 
  post, 
  open, 
  onOpenChange,
  onPostUpdated 
}: EditPostDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.imageUrl || "");
    }
  }, [post]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post) return;
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedPost = await updatePost(post.id, {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined
      });
      
      toast.success("Post updated successfully!");
      onOpenChange(false);
      
      if (onPostUpdated) {
        // Merge the updated fields with the original post
        onPostUpdated({
          ...post,
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || undefined
        });
      }
    } catch (error) {
      toast.error("Failed to update post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!post) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your post"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-image-url">Image URL (optional)</Label>
              <Input
                id="edit-image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter an image URL"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
