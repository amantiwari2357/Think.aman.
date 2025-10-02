
import { useState, useContext } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createPost } from "@/lib/api";
import { toast } from "sonner";
import { AuthContext } from "@/App";

const getPlaceholderByType = (type: string, industry: string) => {
  switch (type) {
    case 'meme':
      return getIndustrySpecificMeme(industry);
    case 'joke':
      return getIndustrySpecificJoke(industry);
    case 'information':
      return getIndustrySpecificInfo(industry);
    default:
      return "Write your post content here...";
  }
};

const getIndustrySpecificMeme = (industry: string) => {
  const memes: Record<string, string> = {
    technology: "When the code works on the first try...",
    healthcare: "When the patient says they've been 'doing their own research'...",
    finance: "When the market crashes right after you buy...",
    education: "When a student says the dog ate their homework in 2023...",
    legal: "When the client says they found a loophole on Google...",
    default: "Share a funny meme related to your industry..."
  };
  
  return memes[industry] || memes.default;
};

const getIndustrySpecificJoke = (industry: string) => {
  const jokes: Record<string, string> = {
    technology: "Why don't programmers like nature? It has too many bugs!",
    healthcare: "I told the doctor I broke my arm in two places. He told me to stop going to those places.",
    finance: "I tried to invest in a calendar company once. Their days are numbered.",
    education: "Why did the math book look sad? It had too many problems.",
    legal: "What's the difference between a good lawyer and a bad lawyer? A bad lawyer can let a case drag on for years. A good lawyer can make it last even longer.",
    default: "Share a joke related to your industry..."
  };
  
  return jokes[industry] || jokes.default;
};

const getIndustrySpecificInfo = (industry: string) => {
  const info: Record<string, string> = {
    technology: "The latest trends in cloud computing are showing a shift towards serverless architecture...",
    healthcare: "New research indicates that regular preventive screenings can significantly reduce...",
    finance: "Recent market analysis suggests that diversification across emerging markets...",
    education: "Studies show that project-based learning increases student engagement by up to 40%...",
    legal: "The Supreme Court's recent ruling on privacy laws will impact how businesses handle data...",
    default: "Share helpful information, insights, or tips related to your industry..."
  };
  
  return info[industry] || info.default;
};

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("information");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("information");
    setImageUrl("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createPost({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        industry: user.industry,
        type: type as "meme" | "joke" | "information",
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined
      });
      
      toast.success("Post created successfully!");
      setOpen(false);
      resetForm();
      if (onPostCreated) onPostCreated();
    } catch (error) {
      toast.error("Failed to create post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new post</DialogTitle>
            <DialogDescription>
              Share something with your industry peers
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="post-type">Post Type</Label>
              <Select 
                value={type} 
                onValueChange={(value) => {
                  setType(value);
                  setContent("");  // Reset content when type changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meme">Meme</SelectItem>
                  <SelectItem value="joke">Joke</SelectItem>
                  <SelectItem value="information">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your post"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={user ? getPlaceholderByType(type, user.industry) : "Write your post content here..."}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image-url">Image URL (optional)</Label>
              <Input
                id="image-url"
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
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
