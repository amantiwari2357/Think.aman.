
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
  "Aarav Sharma", "Aditi Patel", "Aryan Singh", "Diya Reddy",
  "Ishaan Gupta", "Kavya Desai", "Neha Mehra", "Rohan Joshi",
  "Sanya Kapoor", "Vikram Malhotra", "Ananya Choudhury", "Dev Bansal"
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  industry: z.string().min(1, { message: "Please select your industry" }),
});

// Define the type using the formSchema
type ProfileFormValues = z.infer<typeof formSchema>;

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [nameSuggestion, setNameSuggestion] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: "",
      industry: user?.industry || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: "",
        industry: user.industry,
      });
    }
  }, [user, form]);
  
  function suggestIndianName() {
    const randomName = indianNames[Math.floor(Math.random() * indianNames.length)];
    setNameSuggestion(randomName);
    form.setValue("name", randomName);
  }

  function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    
    // Simulate API call to update user profile
    setTimeout(() => {
      const updatedUser = {
        ...user!,
        name: values.name,
        industry: values.industry,
        avatar: avatarPreview || user?.avatar,
      };
      
      login(updatedUser);
      toast.success("Profile updated successfully! 🎉", {
        description: "Your changes have been saved.",
        duration: 5000,
      });
      setIsLoading(false);
    }, 1000);
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and settings.
            </p>
          </div>
          
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
