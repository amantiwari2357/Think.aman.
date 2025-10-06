
import { useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Heart, 
  MessageSquare, 
  Share, 
  MoreVertical,
  Edit,
  Archive,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import { likePost, archivePost, deletePost } from "@/lib/api";
import { toast } from "sonner";
import { EditPostDialog } from "./EditPostDialog";

interface PostItemProps {
  post: Post;
  isOwner?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onArchive?: (postId: string) => void;
}

export function PostItem({ post, isOwner = false, onEdit, onDelete, onArchive }: PostItemProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleLike = async () => {
    if (!currentPost.id) {
      toast.error("Post ID not found");
      return;
    }

    try {
      const result = await likePost(currentPost.id, "user-1"); // In real app, use actual user ID
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      toast.success("Post liked!");
    } catch (error) {
      toast.error("Failed to like post");
      console.error(error);
    }
  };
  
  const handleShare = () => {
    toast.success("Link copied to clipboard!");
  };
  
  const handleArchive = async () => {
    if (!currentPost.id) {
      toast.error("Post ID not found");
      return;
    }

    try {
      await archivePost(currentPost.id);
      toast.success("Post archived");
      if (onArchive) onArchive(currentPost.id);
    } catch (error) {
      toast.error("Failed to archive post");
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    if (!currentPost.id) {
      toast.error("Post ID not found");
      return;
    }

    try {
      await deletePost(currentPost.id);
      toast.success("Post deleted");
      if (onDelete) onDelete(currentPost.id);
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setCurrentPost(updatedPost);
    if (onEdit) onEdit(updatedPost);
  };
  
  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'meme': return 'Meme';
      case 'joke': return 'Joke';
      case 'information': return 'Information';
      default: return type;
    }
  };
  
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={currentPost.userAvatar} />
                <AvatarFallback>{currentPost.userName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{currentPost.userName}</div>
                <div className="text-sm text-muted-foreground flex gap-2">
                  <span>{formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <span className="capitalize">{getPostTypeLabel(currentPost.type)}</span>
                </div>
              </div>
            </div>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <h3 className="text-lg font-semibold mt-2">{currentPost.title}</h3>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="whitespace-pre-line mb-3">{currentPost.content}</p>
          {currentPost.imageUrl && (
            <img 
              src={currentPost.imageUrl} 
              alt={currentPost.title} 
              className="w-full h-auto rounded-md object-cover max-h-80" 
            />
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex gap-1 items-center" 
              onClick={handleLike}
            >
              <Heart 
                className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} 
              />
              <span>{likesCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex gap-1 items-center" 
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{currentPost.comments.length}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex gap-1 items-center" 
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
        
        {showComments && <CommentSection post={currentPost} />}
      </Card>
      
      <EditPostDialog 
        post={editDialogOpen ? currentPost : null} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        onPostUpdated={handlePostUpdated}
      />
    </>
  );
}
