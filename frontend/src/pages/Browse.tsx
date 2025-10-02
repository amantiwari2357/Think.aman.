
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  FileUp, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Star, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Mock data for demonstration
const mockProblems = [
  {
    id: "req-101",
    title: "Help debugging Redux state updates",
    description: "I'm having trouble with my Redux state not updating correctly after dispatching actions. The component doesn't re-render even though the state changes in Redux DevTools.",
    category: "react",
    type: "code",
    date: "2023-06-15T12:00:00Z",
    views: 24,
    difficulty: "medium",
    status: "open",
    tags: ["redux", "state-management", "debugging"],
  },
  {
    id: "req-102",
    title: "Need help with CSS Grid layout not working on mobile",
    description: "My grid layout looks great on desktop but completely breaks on mobile devices. I've tried using media queries but can't figure out what's wrong.",
    category: "html-css",
    type: "problem",
    date: "2023-06-14T10:30:00Z",
    views: 18,
    difficulty: "easy",
    status: "open",
    tags: ["css-grid", "responsive", "mobile"],
  },
  {
    id: "req-103",
    title: "TypeScript interface definition for complex API response",
    description: "I'm working with a third-party API that returns a complex nested object structure. I need help creating proper TypeScript interfaces for this data.",
    category: "typescript",
    type: "code",
    date: "2023-06-13T15:45:00Z",
    views: 32,
    difficulty: "hard",
    status: "open",
    tags: ["typescript", "types", "api"],
  },
  {
    id: "req-104",
    title: "Database query optimization for MongoDB aggregation",
    description: "My MongoDB aggregation pipeline is running very slowly with large datasets. I need help optimizing the query without changing the output format.",
    category: "database",
    type: "problem",
    date: "2023-06-12T09:20:00Z",
    views: 15,
    difficulty: "hard",
    status: "open",
    tags: ["mongodb", "query-optimization", "database"],
  },
  {
    id: "req-105",
    title: "Node.js memory leak in Express application",
    description: "Our production server keeps running out of memory after a few days. I've identified a probable memory leak but don't know how to fix it.",
    category: "backend",
    type: "code",
    date: "2023-06-11T14:10:00Z",
    views: 27,
    difficulty: "medium",
    status: "open",
    tags: ["nodejs", "express", "memory-leak"],
  },
];

export default function Browse() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState(mockProblems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState("list");
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  
  useEffect(() => {
    // If problemId is provided, show the detailed view
    if (problemId) {
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        setSelectedProblem(problem);
        setViewMode("detail");
      }
    }
  }, [problemId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewDetails = (problemId: string) => {
    navigate(`/problem/${problemId}`);
  };

  const handleAcceptProblem = (problemId: string) => {
    console.log("Accepting problem:", problemId);
    toast.success("Problem accepted! Redirecting to chat...");
    // Redirect to chat with a small delay to show the toast
    setTimeout(() => {
      navigate(`/chat/${problemId}`);
    }, 1500);
  };

  const handleBackToBrowse = () => {
    navigate('/browse');
    setViewMode("list");
    setSelectedProblem(null);
  };

  const sortProblems = (problems: any[]) => {
    return [...problems].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filterByTags = (problem: any) => {
    if (!tagsFilter) return true;
    const tags = tagsFilter.toLowerCase().split(',').map(tag => tag.trim());
    return problem.tags.some((tag: string) => 
      tags.some(filterTag => tag.includes(filterTag))
    );
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || problem.category === categoryFilter;
    const matchesType = typeFilter === "" || problem.type === typeFilter;
    const matchesDifficulty = difficultyFilter === "" || problem.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "" || problem.status === statusFilter;
    const matchesTags = filterByTags(problem);
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesStatus && matchesTags;
  });

  const sortedProblems = sortProblems(filteredProblems);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "bg-green-500 hover:bg-green-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "hard": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setTypeFilter("");
    setDifficultyFilter("");
    setStatusFilter("");
    setTagsFilter("");
  };

  // Detail view for a selected problem
  if (viewMode === "detail" && selectedProblem) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-12">
          <Button 
            variant="outline" 
            onClick={handleBackToBrowse} 
            className="mb-6"
          >
            &larr; Back to Browse
          </Button>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedProblem.type === "code" ? (
                        <div className="p-1 bg-primary/10 rounded-md">
                          <FileUp className="h-5 w-5 text-primary" />
                        </div>
                      ) : (
                        <div className="p-1 bg-primary/10 rounded-md">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <h1 className="text-2xl font-bold">{selectedProblem.title}</h1>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge 
                        className={`${getDifficultyColor(selectedProblem.difficulty)} text-white`}
                      >
                        {selectedProblem.difficulty.charAt(0).toUpperCase() + selectedProblem.difficulty.slice(1)}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {selectedProblem.category}
                      </Badge>
                      <Badge variant="outline">
                        {selectedProblem.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 text-sm text-muted-foreground w-full md:w-auto">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Posted: {formatDate(selectedProblem.date)}
                    </div>
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      {selectedProblem.views} views
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProblem.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button 
                    size="lg" 
                    onClick={() => handleAcceptProblem(selectedProblem.id)}
                    className="flex gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Accept & Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleBackToBrowse}
                    className="flex gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse Problems</h1>
            <p className="text-muted-foreground">
              Find problems where you can contribute your expertise and help others
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex gap-2 w-full md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {(searchTerm || categoryFilter || typeFilter || difficultyFilter || statusFilter || tagsFilter) && (
                <Button 
                  variant="ghost" 
                  onClick={resetFilters}
                  className="w-full md:w-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {showFilters && (
              <Card className="p-4">
                <h3 className="font-medium mb-4">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="html-css">HTML/CSS</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="problem">Problem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Difficulty</label>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
                    <Input
                      placeholder="redux, api, typescript..."
                      value={tagsFilter}
                      onChange={(e) => setTagsFilter(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter multiple tags separated by commas
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {sortedProblems.length} {sortedProblems.length === 1 ? "problem" : "problems"}
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3" /> Newest first
                </SelectItem>
                <SelectItem value="oldest" className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3" /> Oldest first
                </SelectItem>
                <SelectItem value="views">Most viewed</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sortedProblems.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground text-center">No problems found matching your criteria</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedProblems.map((problem) => (
                <Card key={problem.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            {problem.type === "code" ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-1 bg-primary/10 rounded-md">
                                    <FileUp className="h-5 w-5 text-primary" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>Code Issue</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-1 bg-primary/10 rounded-md">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>Problem Description</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{problem.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {problem.description}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          className={`${getDifficultyColor(problem.difficulty)} text-white mt-1 md:mt-0`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="capitalize">
                          {problem.category}
                        </Badge>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {formatDate(problem.date)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {problem.views} views
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4" />
                          {problem.status}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {problem.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(problem.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptProblem(problem.id)}
                        >
                          Accept & Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
