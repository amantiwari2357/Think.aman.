// API Service for real-time data fetching and database operations
import { Post, Comment } from "@/lib/types";

// Simulated websocket connection for real-time updates
let websocketConnection: WebSocket | null = null;
const listeners: Record<string, Function[]> = {};

// Initialize the real-time connection
export function initializeRealTimeConnection(userId: string) {
  console.log(`Initializing real-time connection for user ${userId}`);

  if (websocketConnection) {
    websocketConnection.close();
  }

  // Simulate websocket connection
  const simulateConnection = () => {
    console.log("Real-time connection established");

    // Simulate receiving messages
    const simulateIncomingData = setInterval(() => {
      // Every few seconds, simulate new data coming in
      if (Math.random() > 0.7) {
        const eventTypes = [
          "new_problem",
          "problem_accepted",
          "new_message",
          "expert_available",
          "new_follower",
          "new_like",
          "new_comment"
        ];
        const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        let mockData = {
          id: `data-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: randomEvent,
          data: { /* Simulated data would go here */ }
        };

        // Add specific data based on event type
        if (randomEvent === "new_follower") {
          mockData.data = {
            userId: `user-${Math.floor(Math.random() * 100)}`,
            userName: `User ${Math.floor(Math.random() * 100)}`,
            targetUserId: userId
          };
        }

        notifyListeners(randomEvent, mockData);
      }
    }, 5000);

    return {
      close: () => {
        clearInterval(simulateIncomingData);
        console.log("Real-time connection closed");
      }
    };
  };

  websocketConnection = simulateConnection() as unknown as WebSocket;
  return websocketConnection;
}

// Subscribe to real-time events
export function subscribeToEvent(eventType: string, callback: Function) {
  if (!listeners[eventType]) {
    listeners[eventType] = [];
  }

  listeners[eventType].push(callback);
  console.log(`Subscribed to ${eventType} events`);

  // Return unsubscribe function
  return () => {
    if (listeners[eventType]) {
      listeners[eventType] = listeners[eventType].filter(cb => cb !== callback);
      console.log(`Unsubscribed from ${eventType} events`);
    }
  };
}

// Notify all listeners of an event - making it public so it can be used by other modules
export function notifyListeners(eventType: string, data: any) {
  if (listeners[eventType]) {
    listeners[eventType].forEach(callback => callback(data));
  }
}

// Fetch problems with industry and category filters
export async function fetchProblems({ 
  industry = "", 
  category = "", 
  difficulty = "", 
  status = "", 
  sortBy = "newest",
  page = 1,
  limit = 10
}: {
  industry?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  // In a real implementation, this would be an API call
  console.log("Fetching problems with filters:", { industry, category, difficulty, status, sortBy, page, limit });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    problems: Array.from({ length: limit }).map((_, index) => ({
      id: `problem-${page}-${index}`,
      title: `Sample Problem ${page}-${index + 1}`,
      description: "This is a sample problem description that provides context and details.",
      industry: industry || ["technology", "healthcare", "legal", "education", "finance"][Math.floor(Math.random() * 5)],
      category: category || ["technical", "compliance", "process", "resource", "strategy"][Math.floor(Math.random() * 5)],
      difficulty: difficulty || ["beginner", "intermediate", "advanced", "expert"][Math.floor(Math.random() * 4)],
      status: status || ["pending", "accepted", "resolved", "closed"][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: `user-${Math.floor(Math.random() * 100)}`,
        name: `User ${Math.floor(Math.random() * 100)}`,
        industry: ["technology", "healthcare", "legal", "education", "finance"][Math.floor(Math.random() * 5)]
      },
      experts: Math.floor(Math.random() * 5),
      isUrgent: Math.random() > 0.8,
    })),
    totalCount: 100,
    currentPage: page,
    totalPages: 10
  };
}

// Post-related API functions
export async function fetchPosts({ 
  industry = "", 
  type = "", 
  userId = "",
  page = 1,
  limit = 10
}: {
  industry?: string;
  type?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  console.log("Fetching posts with filters:", { industry, type, userId, page, limit });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock posts data with proper type casting
  const posts = Array.from({ length: limit }).map((_, index) => {
    // Ensure post type is one of the allowed values
    const postType = type || ["meme", "joke", "information"][Math.floor(Math.random() * 3)] as "meme" | "joke" | "information";
    
    return {
      id: `post-${page}-${index}`,
      userId: userId || `user-${Math.floor(Math.random() * 100)}`,
      userName: `User ${Math.floor(Math.random() * 100)}`,
      userAvatar: Math.random() > 0.5 ? `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg` : undefined,
      industry: industry || ["technology", "healthcare", "legal", "education", "finance"][Math.floor(Math.random() * 5)],
      type: postType,
      title: `Sample ${postType.charAt(0).toUpperCase() + postType.slice(1)} ${page}-${index + 1}`,
      content: postType === "joke" 
        ? "Why don't programmers like nature? It has too many bugs!"
        : postType === "meme"
        ? "When the code finally works after hours of debugging!"
        : "This is some industry-specific information that could be helpful for professionals in the field.",
      imageUrl: Math.random() > 0.5 ? `https://source.unsplash.com/random/500x300?${industry || "tech"}` : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: Array.from({ length: Math.floor(Math.random() * 5) }).map((_, i) => ({
        id: `comment-${page}-${index}-${i}`,
        postId: `post-${page}-${index}`,
        userId: `user-${Math.floor(Math.random() * 100)}`,
        userName: `Commenter ${Math.floor(Math.random() * 100)}`,
        content: `This is comment #${i + 1} on this post. Great content!`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      })),
      isArchived: Math.random() > 0.8,
    } as Post;
  });
  
  return {
    posts,
    totalCount: 100,
    currentPage: page,
    totalPages: 10
  };
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) {
  console.log("Creating post:", post);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate a new post with mock data
  const newPost: Post = {
    ...post,
    id: `post-${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  
  // Notify listeners about the new post
  setTimeout(() => {
    notifyListeners("new_post", { type: "new_post", data: newPost });
  }, 500);
  
  return newPost;
}

export async function updatePost(postId: string, updates: Partial<Post>) {
  console.log(`Updating post ${postId}:`, updates);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock updated post
  return {
    id: postId,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}

export async function deletePost(postId: string) {
  console.log(`Deleting post ${postId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return success
  return { success: true };
}

export async function archivePost(postId: string) {
  console.log(`Archiving post ${postId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return success
  return { success: true, isArchived: true };
}

export async function likePost(postId: string, userId: string) {
  console.log(`User ${userId} liking post ${postId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return updated likes count (randomly incremented to simulate)
  return { success: true, likes: Math.floor(Math.random() * 100) + 1 };
}

export async function commentOnPost(postId: string, userId: string, userName: string, content: string) {
  console.log(`User ${userId} commenting on post ${postId}:`, content);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create new comment
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    postId,
    userId,
    userName,
    content,
    createdAt: new Date().toISOString()
  };
  
  // Notify listeners about the new comment
  setTimeout(() => {
    notifyListeners("new_comment", { type: "new_comment", data: newComment });
  }, 300);
  
  return newComment;
}

// Post a new problem
export async function postProblem(problem: any) {
  // In a real implementation, this would be an API call
  console.log("Posting problem:", problem);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a fake ID for the newly created problem
  const newProblem = {
    ...problem,
    id: `problem-${Date.now()}`,
    date: new Date().toISOString(),
    status: "pending",
    experts: 0
  };
  
  // Notify listeners about the new problem (in a real app, this would come from the server)
  setTimeout(() => {
    notifyListeners("new_problem", { type: "new_problem", data: newProblem });
  }, 2000);
  
  return newProblem;
}

// Accept a problem as an expert
export async function acceptProblem(problemId: string, expertId: string) {
  // In a real implementation, this would be an API call
  console.log(`Expert ${expertId} is accepting problem ${problemId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a chat ID
  const chatId = `chat-${Date.now()}`;
  
  // Notify listeners about the accepted problem
  setTimeout(() => {
    notifyListeners("problem_accepted", { 
      type: "problem_accepted", 
      data: { 
        problemId, 
        expertId, 
        chatId,
        timestamp: new Date().toISOString()
      } 
    });
  }, 500);
  
  // Return success
  return { success: true, chatId };
}

// Send a message in a chat
export async function sendMessage(chatId: string, userId: string, message: string) {
  // In a real implementation, this would be an API call
  console.log(`Sending message in chat ${chatId} from user ${userId}:`, message);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the created message
  const newMessage = {
    id: `msg-${Date.now()}`,
    chatId,
    userId,
    message,
    timestamp: new Date().toISOString()
  };
  
  // Notify listeners about the new message (in a real app, this would come from the server)
  setTimeout(() => {
    notifyListeners("new_message", { type: "new_message", data: newMessage });
    
    // Simulate expert reply after a short delay
    if (userId !== "expert-1") {
      setTimeout(() => {
        const expertReply = {
          id: `msg-${Date.now()}`,
          chatId,
          userId: "expert-1",
          message: getAutomatedResponse(message),
          timestamp: new Date(Date.now() + 1000).toISOString()
        };
        
        notifyListeners("new_message", { type: "new_message", data: expertReply });
      }, 3000 + Math.random() * 2000);
    }
  }, 100);
  
  return newMessage;
}

// Generate an automated response based on the input message
function getAutomatedResponse(message: string): string {
  const responses = [
    "I see what you mean. Let me look into this further.",
    "That's an interesting point. Have you considered trying a different approach?",
    "I've encountered this issue before. Here's what worked for me...",
    "Could you provide more details about your environment?",
    "Let me check the documentation and get back to you on this.",
    "This seems like a common issue. The usual solution is to...",
    "I think I understand the problem. Let me suggest a solution.",
    "Have you tried restarting the service? Sometimes that helps.",
    "That's definitely a challenge. Let's break it down step by step.",
    "I'm researching this now. Give me a moment to find the best approach."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Fetch chat history
export async function fetchChatHistory(chatId: string) {
  // In a real implementation, this would be an API call
  console.log(`Fetching chat history for ${chatId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return Array.from({ length: 10 }).map((_, index) => ({
    id: `msg-${index}`,
    chatId,
    userId: index % 2 === 0 ? "expert-1" : "user-1",
    sender: index % 2 === 0 ? "expert" : "user",
    name: index % 2 === 0 ? "Jane Smith" : "Aman Khanna",
    content: `${index % 2 === 0 ? "I'm looking at your problem. " : "Thanks for your help. "}${
      index % 2 === 0 
        ? ["Could you provide more details?", "Have you tried restarting?", "Let me research this issue.", "I think I found a solution.", "Try this approach..."][Math.floor(Math.random() * 5)]
        : ["Here's what I'm seeing...", "I've tried that already.", "That didn't work for me.", "Let me try your suggestion.", "That worked! Thanks!"][Math.floor(Math.random() * 5)]
    }`,
    timestamp: new Date(Date.now() - (10 - index) * 300000).toISOString()
  }));
}

  // Get user profile - Calls backend API which queries MongoDB
export async function getUserProfile(userId: string) {
  // In a real implementation, this would call the backend API
  console.log(`Fetching profile for user ${userId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // Make request to backend API (full URL since frontend and backend are on different ports)
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error(`Profile fetch failed: ${response.status}`);
    }

    const userData = await response.json();

    // Backend would return the complete user object from MongoDB with computed fields
    return userData.user;
  } catch (error) {
    console.error('Profile fetch API error:', error);
    throw error;
  }
}

// Get user's following and followers data - Calls backend API
export async function getFollowsData(userId: string) {
  // In a real implementation, this would call the backend API
  console.log(`Fetching follows data for user ${userId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // Make request to backend API (full URL since frontend and backend are on different ports)
    const response = await fetch(`http://localhost:5000/api/users/${userId}/follows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Follows data fetch failed: ${response.status}`);
    }

    const data = await response.json();

    // Backend would return:
    // {
    //   following: [/* user IDs that this user is following */],
    //   followers: [/* user IDs that follow this user */],
    //   blockedUsers: [/* user IDs that this user has blocked */]
    // }

    return {
      following: data.following || [],
      followers: data.followers || [],
      blockedUsers: data.blockedUsers || []
    };
  } catch (error) {
    console.error('Follows data API error:', error);

    // Fallback to empty arrays if API fails
    return {
      following: [],
      followers: [],
      blockedUsers: []
    };
  }
}
// Follow a user - Calls backend API which updates MongoDB
export async function followUser(userId: string, targetUserId: string) {
  // In a real implementation, this would call the backend API
  console.log(`User ${userId} is following user ${targetUserId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    const requestBody = JSON.stringify({ 
      userId,        // Current user ID
      targetUserId   // User to follow
    });
    console.log('Follow request body:', requestBody);
    console.log('Current user ID:', userId);
    console.log('Target user ID:', targetUserId);

    // Make request to backend API (full URL since frontend and backend are on different ports)
    const response = await fetch('http://localhost:5000/api/users/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    console.log('Follow response status:', response.status);
    console.log('Follow response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Follow error response:', errorText);
      throw new Error(`Follow failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Follow success response:', data);

    // Notify the target user about the new follower
    // In a real app, the backend would handle sending notifications with proper user names
    notifyListeners("new_follower", {
      type: "new_follower",
      data: {
        userId,
        userName: `User ${userId.split('-')[1]}`, // Fallback until backend provides real names
        targetUserId,
        timestamp: new Date().toISOString()
      }
    });

    return { success: data.success || true };
  } catch (error) {
    console.error('Follow API error:', error);
    throw error;
  }
}

// Unfollow a user - Calls backend API
export async function unfollowUser(userId: string, targetUserId: string) {
  // In a real implementation, this would call the backend API
  console.log(`User ${userId} unfollowed user ${targetUserId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    // Make request to backend API (full URL since frontend and backend are on different ports)
    const response = await fetch('http://localhost:5001/api/users/unfollow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, targetUserId })
    });

    if (!response.ok) {
      throw new Error(`Unfollow failed: ${response.status}`);
    }

    const data = await response.json();
    return { success: data.success || true };
  } catch (error) {
    console.error('Unfollow API error:', error);
    throw error;
  }
}

// Block a user - Calls backend API
export async function blockUser(userId: string, targetUserId: string) {
  // In a real implementation, this would call the backend API
  console.log(`User ${userId} blocked user ${targetUserId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    // Make request to backend API (full URL since frontend and backend are on different ports)
    const response = await fetch('http://localhost:5000/api/users/block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, targetUserId })
    });

    if (!response.ok) {
      throw new Error(`Block failed: ${response.status}`);
    }

    const data = await response.json();
    return { success: data.success || true };
  } catch (error) {
    console.error('Block API error:', error);
    throw error;
  }
}

// Unblock a user - Calls backend API
export async function unblockUser(userId: string, targetUserId: string) {
  // In a real implementation, this would call the backend API
  console.log(`User ${userId} unblocked user ${targetUserId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    // Make request to backend API (full URL since frontend and backend are on different ports)
    const response = await fetch('http://localhost:5000/api/users/unblock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, targetUserId })
    });

    if (!response.ok) {
      throw new Error(`Unblock failed: ${response.status}`);
    }

    const data = await response.json();
    return { success: data.success || true };
  } catch (error) {
    console.error('Unblock API error:', error);
    throw error;
  }
}

// Search for users - Connects to backend API which queries MongoDB
export async function searchUsers(query: string, currentUserId?: string) {
  // In a real implementation, this would call the backend API
  console.log(`Searching for users with query: ${query}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
                                                                                         
    const response = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();

    // Debug the raw API response
    console.log('Raw API response:', data);
    console.log('Raw users array:', data.users);

    // Handle Mongoose document structure - extract data from _doc if present
    const processedUsers = (data.users || []).map((user: any) => {
      // If user has _doc field (Mongoose document), extract the actual data
      if (user._doc) {
        return {
          ...user._doc,
          id: user.id || user._doc._id?.toString()
        };
      }
      // Otherwise return as-is
      return user;
    });

    console.log('Processed users:', processedUsers);

    return {
      users: processedUsers,
      totalCount: data.totalCount || 0
    };
  } catch (error) {
    console.error('Search API error:', error);

    // No fallback data - throw error if backend is not available
    throw error;
  }
}
