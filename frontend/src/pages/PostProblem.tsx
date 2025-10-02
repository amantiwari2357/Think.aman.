
import { useState, useContext } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TechnologyCategories, ProblemCategories, IndustryOptions } from "@/lib/constants";
import { AuthContext } from "@/App";
import { postProblem } from "@/lib/api";

export default function PostProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Get industry-specific placeholders and examples
  const getIndustrySpecificContent = () => {
    if (!user) return {
      titlePlaceholder: "E.g., 'How to optimize database queries'",
      descPlaceholder: "Describe your problem in detail. What are you trying to achieve? What have you tried so far? Include any relevant information that might help experts understand your issue."
    };

    switch (user.industry) {
      case "technology":
        return {
          titlePlaceholder: "E.g., 'React useEffect causing memory leak'",
          descPlaceholder: "Describe your technical issue. Include your code snippets, error messages, and what you've tried. Mention your tech stack and environment."
        };
      case "healthcare":
        return {
          titlePlaceholder: "E.g., 'Patient record management system integration'",
          descPlaceholder: "Describe your healthcare-related challenge. Include context about compliance requirements, system specifications, and desired outcomes."
        };
      case "legal":
        return {
          titlePlaceholder: "E.g., 'Document automation system for contracts'",
          descPlaceholder: "Describe your legal technology challenge. Include context about workflow, document requirements, and compliance considerations."
        };
      case "finance":
        return {
          titlePlaceholder: "E.g., 'Real-time transaction monitoring system'",
          descPlaceholder: "Describe your fintech or finance-related challenge. Include security requirements, transaction volumes, and system integration needs."
        };
      case "education":
        return {
          titlePlaceholder: "E.g., 'Virtual classroom engagement tracking'",
          descPlaceholder: "Describe your educational technology challenge. Include context about the learning environment, target audience, and pedagogical goals."
        };
      case "cybersecurity":
        return {
          titlePlaceholder: "E.g., 'Implementing zero-trust architecture'",
          descPlaceholder: "Describe your cybersecurity challenge. Include details about your environment, threat model, and specific security requirements."
        };
      default:
        return {
          titlePlaceholder: "E.g., 'How to optimize database queries'",
          descPlaceholder: "Describe your problem in detail. What are you trying to achieve? What have you tried so far? Include any relevant information that might help experts understand your issue."
        };
    }
  };

  const { titlePlaceholder, descPlaceholder } = getIndustrySpecificContent();

  // Get the appropriate categories based on the user's industry
  const getCategoriesForIndustry = () => {
    if (!user) return TechnologyCategories;
    
    switch (user.industry) {
      case "technology":
        return TechnologyCategories;
      default:
        return ProblemCategories;
    }
  };

  const categories = getCategoriesForIndustry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Post the problem using the API
      const result = await postProblem({
        title,
        description,
        category,
        industry: user?.industry || "technology",
        userId: user?.id
      });
      
      toast.success("Problem posted successfully!");
      navigate("/requests");
    } catch (error) {
      console.error("Error posting problem:", error);
      toast.error("Failed to post problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <CardTitle>Post Problem Description</CardTitle>
              </div>
              <CardDescription>
                Describe the problem you're facing in detail to get expert help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Problem Title</label>
                  <Input
                    id="title"
                    placeholder={titlePlaceholder}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Problem Description</label>
                  <Textarea
                    id="description"
                    placeholder={descPlaceholder}
                    rows={8}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting Problem...
                    </span>
                  ) : (
                    "Post Problem"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
