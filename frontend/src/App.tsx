
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PostCode from "./pages/PostCode";
import PostProblem from "./pages/PostProblem";
import Requests from "./pages/Requests";
import Browse from "./pages/Browse";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import UserPosts from "./pages/UserPosts";
import NotificationsPage from "./pages/NotificationsPage";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import { useInitializeRealTime } from "./hooks/use-realtime";

// Create a client
const queryClient = new QueryClient();

// Authentication context for app-wide user state
export const AuthContext = React.createContext<{
  user: { id: string; name: string; industry: string; avatar?: string; bio?: string; skills?: string[]; location?: string; experience?: string } | null;
  login: (user: { id: string; name: string; industry: string; avatar?: string; bio?: string; skills?: string[]; location?: string; experience?: string }) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

function App() {
  // User state with avatar support
  const [user, setUser] = useState<{ id: string; name: string; industry: string; avatar?: string; bio?: string; skills?: string[]; location?: string; experience?: string } | null>(null);
  
  // Initialize real-time connection when user logs in
  const { isConnected } = useInitializeRealTime(user?.id || null);
  
  // Log connection status for debugging
  useEffect(() => {
    console.log("Real-time connection status:", isConnected);
  }, [isConnected]);

  // User login function
  const login = (userData: { id: string; name: string; industry: string; avatar?: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // User logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Check for stored user and token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('App.tsx - Stored token:', storedToken ? 'Found' : 'Not found');
    console.log('App.tsx - Stored user:', storedUser ? 'Found' : 'Not found');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('App.tsx - Verifying token with backend...');

        // Verify token with backend
        fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            console.log('App.tsx - Token verification response status:', response.status);
            if (response.ok) {
              console.log('App.tsx - Token verified successfully, setting user');
              setUser(parsedUser);
            } else {
              // Token is invalid, clear storage
              console.log('App.tsx - Token verification failed, clearing storage');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              throw new Error('Invalid token');
            }
          })
          .catch(error => {
            console.error("App.tsx - Token verification failed:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          });
      } catch (error) {
        console.error("App.tsx - Failed to parse stored user", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('App.tsx - No stored token or user found');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-code" element={<PostCode />} />
              <Route path="/post-problem" element={<PostProblem />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/posts" element={<UserPosts />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/chat/:requestId" element={<Chat />} />
              <Route path="/problem/:problemId" element={<Browse />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
