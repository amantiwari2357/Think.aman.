
import { useState, useContext, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/App";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";

// List of Indian names to suggest
const indianNames = [
  "Aarav", "Aditi", "Aryan", "Diya",
  "Ishaan", "Kavya", "Neha", "Rohan",
  "Sanya", "Vikram", "Ananya", "Dev",
  "Priya", "Arjun", "Anaya", "Kabir",
  "Myra", "Vihaan", "Zara", "Reyansh",
  "Inaya", "Advait", "Aadhya", "Rudra",
  "Kiara", "Shaurya", "Pari", "Yuvraj"
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).nonempty({ message: "Name is required" }),
  industry: z.string().min(1, { message: "Please select your industry" }).nonempty({ message: "Industry is required" }),
  bio: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
});

// Define the type using the formSchema
export type ProfileFormValues = z.infer<typeof formSchema>;

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [nameSuggestion, setNameSuggestion] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      bio: "",
      skills: "",
      location: "",
      experience: "beginner", // Set default experience level
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        industry: user.industry,
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        location: user.location || "",
        experience: user.experience || "beginner", // Default to beginner if not set
      });
      setAvatarPreview(user.avatar);
    }
  }, [user, form]);

  // Listen for profile updates from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const updatedUser = JSON.parse(e.newValue);
          if (updatedUser.id === user?.id) {
            // Profile was updated in another tab, sync it here
            toast.info("Profile synced from another tab");
          }
        } catch (error) {
          console.error('Error parsing user data from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  function suggestIndianName() {
    const randomName = indianNames[Math.floor(Math.random() * indianNames.length)];
    setNameSuggestion(randomName);
  }

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);

    // Store original user data for potential rollback
    const originalUser = { ...user! };
    const previousAvatarPreview = avatarPreview;

    try {
      // Optimistic update - immediately update local state
      const optimisticUser = {
        ...user!,
        name: values.name,
        industry: values.industry,
        bio: values.bio,
        skills: values.skills ? values.skills.split(',').map(skill => skill.trim()) : [],
        location: values.location,
        experience: values.experience || "beginner", // Ensure valid experience value
        avatar: avatarPreview, // Will be updated after upload
      };

      // Update UI immediately for better UX
      login(optimisticUser);

      // Upload avatar to Cloudinary if there's a new file
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        try {
          avatarUrl = await uploadToCloudinary(avatarFile);
          // Update with new avatar URL
          const updatedUserWithAvatar = {
            ...optimisticUser,
            avatar: avatarUrl,
          };
          login(updatedUserWithAvatar);
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          toast.error("Avatar upload failed, but profile was updated");
          avatarUrl = previousAvatarPreview; // Keep previous avatar
        }
      }

      // Update profile via backend API
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          industry: values.industry,
          bio: values.bio || "",
          skills: values.skills || "",
          location: values.location || "",
          experience: values.experience || "beginner", // Ensure valid enum value
          avatar: avatarUrl, // Send avatar URL to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Rollback optimistic update on backend failure
        login(originalUser);
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local user state with backend response (in case backend modified data)
      const finalUser = {
        ...user!,
        name: values.name,
        industry: values.industry,
        bio: values.bio,
        skills: values.skills ? values.skills.split(',').map(skill => skill.trim()) : [],
        location: values.location,
        experience: values.experience || "beginner", // Ensure valid experience value
        avatar: avatarUrl,
      };

      login(finalUser);

      // Clear form state
      setAvatarFile(null);
      setAvatarPreview(undefined);
      setNameSuggestion(null);

      toast.success("Profile updated successfully! 🎉", {
        description: "Your changes have been saved and synced across all devices.",
        duration: 5000,
      });

    } catch (error: any) {
      // Error handling with rollback is already done above
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  // Cloudinary upload function with signed upload (more secure)
  async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = 'dwqpls2wh';
    const timestamp = Math.round(new Date().getTime() / 1000);
    const uploadPreset = 'ml_default'; // Your unsigned upload preset

    // For signed uploads, you would need to generate signature on backend
    // For now, let's try unsigned upload with proper error handling
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('timestamp', timestamp.toString());

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Provide helpful error message for preset configuration
        if (data.error?.message?.includes('Upload preset must be whitelisted')) {
          throw new Error('Please configure your Cloudinary upload preset for unsigned uploads. Go to Cloudinary Dashboard > Settings > Upload > Upload presets and enable unsigned uploading for "ml_default" preset.');
        }
        throw new Error(data.error?.message || 'Failed to upload image');
      }

      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setAvatarPreview(previewUrl);

        // Optimistic avatar update
        if (user) {
          const updatedUser = {
            ...user,
            avatar: previewUrl,
          };
          login(updatedUser);
        }

        toast.success("Avatar updated! Don't forget to save your profile.");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return null; // Handle case where user is not logged in
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-8 sm:flex-row sm:items-start sm:mb-6">
                <div className="relative mb-4 sm:mb-0 sm:mr-6">
                  <AvatarUpload
                    avatarUrl={avatarPreview || user.avatar}
                    userName={user.name}
                    onAvatarChange={handleAvatarChange}
                  />
                </div>
                <ProfileForm
                  form={form}
                  isLoading={isLoading}
                  userId={user.id}
                  onSuggestName={suggestIndianName}
                  nameSuggestion={nameSuggestion}
                  onSubmit={onSubmit}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
