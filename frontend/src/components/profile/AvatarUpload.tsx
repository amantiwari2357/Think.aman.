
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  avatarUrl?: string;
  userName: string;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUpload({ avatarUrl, userName, onAvatarChange }: AvatarUploadProps) {
  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt={userName} />
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <label 
        htmlFor="avatar-upload" 
        className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer text-white hover:bg-primary/90"
      >
        <Upload className="h-4 w-4" />
        <span className="sr-only">Upload avatar</span>
      </label>
      <input 
        id="avatar-upload" 
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={onAvatarChange}
      />
    </div>
  );
}
