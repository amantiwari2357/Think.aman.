// Event system for real-time updates
const eventListeners: { [eventType: string]: Function[] } = {};

/**
 * Broadcast an event to all subscribers
 * @param eventType The type of event to broadcast
 * @param data The data to send with the event
 */
export function notifyListeners(eventType: string, data: any) {
  console.log(`Broadcasting event: ${eventType}`, data);

  if (eventListeners[eventType]) {
    eventListeners[eventType].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }
}

/**
 * Subscribe to a specific event type
 * @param eventType The type of event to subscribe to
 * @param callback The function to call when the event occurs
 * @returns A function to unsubscribe from the event
 */
export function subscribeToEvent(eventType: string, callback: Function) {
  if (!eventListeners[eventType]) {
    eventListeners[eventType] = [];
  }

  eventListeners[eventType].push(callback);

  // Return unsubscribe function
  return () => {
    const listeners = eventListeners[eventType];
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  };
}

/**
 * Initialize real-time connection (placeholder for future WebSocket/SSE implementation)
 * @param userId The current user's ID
 */
export function initializeRealTimeConnection(userId: string) {
  console.log(`Initializing real-time connection for user: ${userId}`);
  // For now, this is just a placeholder
  // In the future, this could initialize WebSocket or Server-Sent Events connections
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

  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (industry && industry !== 'all') params.append('industry', industry);
    if (type && type !== 'all') params.append('type', type);
    if (userId) params.append('userId', userId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Make request to backend API
    const response = await fetch(`http://localhost:5000/api/posts?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetch posts success response:', data);

    return {
      posts: data.posts || [],
      totalCount: data.totalCount || 0,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 0
    };
  } catch (error) {
    console.error('Fetch posts API error:', error);
    throw error;
  }
}

// Fetch problems with optional filtering
export async function fetchProblems({
  category = "",
  status = "",
  userId = "",
  page = 1,
  limit = 10
}: {
  category?: string;
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  console.log("Fetching problems with filters:", { category, status, userId, page, limit });

  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (status && status !== 'all') params.append('status', status);
    if (userId) params.append('userId', userId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Make request to backend API
    const response = await fetch(`http://localhost:5000/api/problems?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch problems: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetch problems success response:', data);

    return {
      problems: data.problems || [],
      totalCount: data.totalCount || 0,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 0
    };
  } catch (error) {
    console.error('Fetch problems API error:', error);
    throw error;
  }
}

// Post a new problem (without file upload)
export async function postProblem(problem: {
  title: string;
  description: string;
  category: string;
  industry?: string;
  userId?: string;
  userName?: string;
}) {
  console.log("Posting problem:", problem);

  try {
    // Make request to backend API
    const response = await fetch('http://localhost:5000/api/problems/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(problem)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Post problem error response:', errorText);
      throw new Error(`Failed to post problem: ${response.status}`);
    }

    const data = await response.json();
    console.log('Post problem success response:', data);

    // Convert the saved problem back to the expected format
    const newProblem = {
      ...data.problem,
      id: data.problem.id || data.problem._id?.toString(),
    };

    // Notify listeners about the new problem for real-time updates
    setTimeout(() => {
      notifyListeners("new_problem", { type: "new_problem", data: newProblem });
    }, 500);

    return newProblem;
  } catch (error) {
    console.error('Post problem API error:', error);
    throw error;
  }
}

// Post a new problem with file upload
export async function postProblemWithFile(formData: FormData) {
  console.log("Posting problem with file");

  try {
    // Make request to backend API
    const response = await fetch('http://localhost:5000/api/problems', {
      method: 'POST',
      body: formData // Send FormData directly for file upload
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Post problem error response:', errorText);
      throw new Error(`Failed to post problem: ${response.status}`);
    }

    const data = await response.json();
    console.log('Post problem success response:', data);

    // Convert the saved problem back to the expected format
    const newProblem = {
      ...data.problem,
      id: data.problem.id || data.problem._id?.toString(),
    };

    // Notify listeners about the new problem for real-time updates
    setTimeout(() => {
      notifyListeners("new_problem", { type: "new_problem", data: newProblem });
    }, 500);

    return newProblem;
  } catch (error) {
    console.error('Post problem API error:', error);
    throw error;
  }
}

// Fetch chat history for a specific request
  export async function fetchChatHistory(requestId: string) {
    console.log(`Fetching chat history for request ${requestId}`);

    try {
      // Make request to backend API
      const response = await fetch(`http://localhost:5000/api/chat/${requestId}/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat history fetched:', data);

      return data.messages || [];
    } catch (error) {
      console.error('Fetch chat history API error:', error);
      throw error;
    }
  }

  // Send a message in a chat
  export async function sendMessage(requestId: string, userId: string, content: string) {
    console.log(`Sending message in request ${requestId} from user ${userId}:`, content);

    try {
      // Make request to backend API
      const response = await fetch(`http://localhost:5000/api/chat/${requestId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, content })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Send message error response:', errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      console.log('Message sent successfully:', data);

      // Notify listeners about the new message for real-time updates
      setTimeout(() => {
        notifyListeners("new_message", {
          type: "new_message",
          data: {
            requestId,
            message: data.message
          }
        });
      }, 300);

      return data.message;
    } catch (error) {
      console.error('Send message API error:', error);
      throw error;
    }
  }

  // Create a new post
  export async function createPost(postData: {
    userId: string;
    userName: string;
    userAvatar?: string;
    industry: string;
    type: "meme" | "joke" | "information";
    title: string;
    content: string;
    imageUrl?: string;
  }) {
    console.log("Creating post:", postData);

    try {
      // Make request to backend API
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create post error response:', errorText);
        throw new Error(`Failed to create post: ${response.status}`);
      }

      const data = await response.json();
      console.log('Create post success response:', data);

      // Convert the saved post back to the expected format
      const newPost = {
        ...data.post,
        id: data.post.id || data.post._id?.toString(),
      };

      // Notify listeners about the new post for real-time updates
      setTimeout(() => {
        notifyListeners("new_post", { type: "new_post", data: newPost });
      }, 500);

      return newPost;
    } catch (error) {
      console.error('Create post API error:', error);
      throw error;
    }
  }

  // Update a post
export async function updatePost(postId: string, updates: {
  title?: string;
  content?: string;
  imageUrl?: string;
}) {
  console.log(`Updating post ${postId} with:`, updates);

  try {
    // Make request to backend API
    const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update post error response:', errorText);
      throw new Error(`Failed to update post: ${response.status}`);
    }

    const data = await response.json();
    console.log('Update post success response:', data);

    // Convert the updated post back to the expected format
    const updatedPost = {
      ...data.post,
      id: data.post.id || data.post._id?.toString(),
    };

    return updatedPost;
  } catch (error) {
    console.error('Update post API error:', error);
    throw error;
  }
}
// Like a post
export async function likePost(postId: string, userId: string) {
  console.log(`User ${userId} liking post ${postId}`);

  try {
    // Make request to backend API
    const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`Failed to like post: ${response.status}`);
    }

    const data = await response.json();
    console.log('Like post success response:', data);

    return { success: true, likes: data.likes };
  } catch (error) {
    console.error('Like post API error:', error);
    throw error;
  }
}

// Archive a post
export async function archivePost(postId: string) {
  console.log(`Archiving post ${postId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Return success
  return { success: true, isArchived: true };
}

// Delete a post
export async function deletePost(postId: string) {
  console.log(`Deleting post ${postId}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Return success
  return { success: true };
}

// Comment on a post
export async function commentOnPost(postId: string, userId: string, userName: string, content: string) {
  console.log(`User ${userId} commenting on post ${postId}:`, content);

  try {
    // Make request to backend API
    const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, userName, content })
    });

    if (!response.ok) {
      throw new Error(`Failed to comment on post: ${response.status}`);
    }

    const data = await response.json();
    console.log('Comment success response:', data);

    const newComment = {
      id: data.comment.id,
      postId,
      userId,
      userName,
      content,
      createdAt: data.comment.createdAt || new Date().toISOString()
    };

    // Notify listeners about the new comment for real-time updates
    setTimeout(() => {
      notifyListeners("new_comment", { type: "new_comment", data: newComment });
    }, 300);

    return newComment;
  } catch (error) {
    console.error('Comment API error:', error);
    throw error;
  }
}

// Get user profile - Calls backend API which queries MongoDB
export async function getUserProfile(userId: string) {
  console.log(`Fetching profile for user ${userId}`);

  try {
    // Make request to backend API
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
    return userData.user;
  } catch (error) {
    console.error('Profile fetch API error:', error);
    throw error;
  }
}

// Get user's following and followers data - Calls backend API
export async function getFollowsData(userId: string) {
  console.log(`Fetching follows data for user ${userId}`);

  try {
    // Make request to backend API
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
  console.log(`User ${userId} is following user ${targetUserId}`);

  try {
    const requestBody = JSON.stringify({
      userId,        // Current user ID
      targetUserId   // User to follow
    });

    // Make request to backend API
    const response = await fetch('http://localhost:5000/api/users/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Follow error response:', errorText);
      throw new Error(`Follow failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Follow success response:', data);

    // Create follow success notification for current user
    notifyListeners("follow_success", {
      type: "follow_success",
      data: {
        userId,
        targetUserId,
        targetUserName: `User ${targetUserId.split('-')[1] || 'Unknown'}`,
        timestamp: new Date().toISOString()
      }
    });

    // Notify the target user about the new follower
    notifyListeners("new_follower", {
      type: "new_follower",
      data: {
        userId,
        userName: `User ${userId.split('-')[1] || 'Unknown'}`,
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
  console.log(`User ${userId} unfollowed user ${targetUserId}`);

  try {
    // Make request to backend API
    const response = await fetch('http://localhost:5000/api/users/unfollow', {
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
  console.log(`User ${userId} blocked user ${targetUserId}`);

  try {
    // Make request to backend API
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
  console.log(`User ${userId} unblocked user ${targetUserId}`);

  try {
    // Make request to backend API
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
  console.log(`Searching for users with query: ${query}`);

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
    throw error;
  }
}
