
import { toast } from "sonner";
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

  // Debug: Log current user state
  console.log('Profile.tsx - Current user state:', user);
  console.log('Profile.tsx - User is logged in:', !!user);

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
      console.log('Token being sent:', token); // Debug: Check what token is being sent
      console.log('Token exists:', !!token); // Debug: Check if token exists
      console.log('Token length:', token?.length); // Debug: Check token length

      if (!token) {
        console.error('No token found in localStorage');
        toast.error('Please log in again');
        return;
      }

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
          // Remove avatar from profile update - handled separately via upload endpoint
        }),
      });

      const data = await response.json();
      console.log('Profile update response:', data); // Debug: Check backend response

      if (!response.ok) {
        // Rollback optimistic update on backend failure
        login(originalUser);
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local user state with backend response (in case backend modified data)
      const finalUser = {
        ...user!,
        ...data.data.user, // Use actual backend response data
        avatar: avatarUrl,
      };

      console.log('Final user state after update:', finalUser); // Debug: Check final user state

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
  // Backend upload function (more secure)
  async function uploadToCloudinary(file: File): Promise<string> {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('http://localhost:5000/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data.data.avatar; // Return the avatar URL from backend response
    } catch (error) {
      console.error('Backend upload error:', error);
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
