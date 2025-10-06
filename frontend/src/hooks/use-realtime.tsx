import { useEffect, useState } from 'react';
import { subscribeToEvent } from '@/lib/api';

/**
 * Hook to subscribe to real-time events
 * @param eventType The type of event to subscribe to
 * @param initialData Optional initial data
 * @returns An object containing the latest data and loading state
 */
export function useRealTimeEvent<T>(eventType: string, initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Subscribe to the event
    const unsubscribe = subscribeToEvent(eventType, (newData: T) => {
      console.log(`Received ${eventType} event:`, newData);
      setData(newData);
      setIsLoading(false);
    });
    
    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [eventType]);

  return { data, isLoading };
}

/**
 * Hook for real-time notifications
 * @returns An object with notifications and methods to manage them
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    message: string;
    icon?: string;
    read: boolean;
    timestamp: string;
    data?: any;
    actions?: Array<{
      label: string;
      action: string;
      variant?: 'default' | 'outline' | 'ghost';
      onClick: () => void;
    }>;
  }>>([]);

  // Subscribe to various notification events
  useEffect(() => {
    const eventTypes = [
      "new_problem",
      "problem_accepted",
      "new_message",
      "expert_available",
      "new_follower",
      "new_like",
      "new_comment",
      "follow_success"
    ];

    const unsubscribers = eventTypes.map(eventType =>
      subscribeToEvent(eventType, (eventData: any) => {
        // Only create notifications for real user activities
        // Allow notifications but handle poor username data gracefully
        const userName = eventData.data?.userName;
        const isValidUsername = userName && !userName.startsWith('User ') && userName !== 'Someone' && userName !== 'User Unknown';

        // Skip only completely invalid usernames, but allow fallback ones
        if (userName === undefined || userName === null || userName === '') {
          console.log(`Skipping notification for ${eventType} - no username provided`);
          return;
        }

        let message = "";
        let icon = "";
        let displayName = userName; // Default to provided username
        let actions: Array<{
          label: string;
          action: string;
          variant?: 'default' | 'outline' | 'ghost';
          onClick: () => void;
        }> = [];

        // Create appropriate message based on event type
        switch (eventType) {
          case "new_problem":
            const problemTitle = eventData.data?.title || "Untitled Problem";
            const problemIndustry = eventData.data?.industry || "general";
            message = `🚨 New ${problemIndustry} challenge posted: "${problemTitle}" - Help needed!`;
            icon = "new_problem";
            break;
          case "problem_accepted":
            message = `✅ Excellent! An expert has accepted your challenge and is ready to assist!`;
            icon = "problem_accepted";
            break;
          case "new_message":
            message = `💬 New message received! Check your conversations for updates.`;
            icon = "new_message";
            break;
          case "expert_available":
            const expertCategory = eventData.data?.category || "problem";
            message = `⭐ Expert assistance available! Someone can help with your ${expertCategory}.`;
            icon = "expert_available";
            break;
          case "new_follower":
            if (isValidUsername) {
              message = `🎉 ${userName} is now following you! Welcome to your growing network!`;
            } else {
              message = `🎉 Someone started following you! Welcome to your growing network!`;
              displayName = "A user";
            }
            icon = "new_follower";
            break;
          case "follow_success":
            const targetUserName = eventData.data?.targetUserName || "Someone";
            message = `✅ Successfully following ${targetUserName}! You're now connected.`;
            icon = "follow_success";
            break;
          case "new_like":
            if (isValidUsername) {
              const likedContent = eventData.data?.contentType || "content";
              message = `❤️ ${userName} appreciated your ${likedContent}! Your insights are valuable!`;
            } else {
              message = `❤️ Someone liked your content! Keep sharing!`;
              displayName = "Someone";
            }
            icon = "new_like";
            break;
          case "new_comment":
            if (isValidUsername) {
              const commentPreview = eventData.data?.commentPreview || "shared their thoughts";
              const shortComment = commentPreview.length > 60 ? commentPreview.substring(0, 60) + "..." : commentPreview;
              message = `💬 ${userName}: "${shortComment}" - Engaging discussion!`;
            } else {
              message = `💬 Someone commented on your post - Engaging discussion!`;
              displayName = "Someone";
            }
            icon = "new_comment";
            break;
          default:
            message = `🔔 New activity on your network`;
            icon = "default";
        }

        // Add notification (now allows fallback usernames)
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: eventType,
            message,
            icon,
            read: false,
            timestamp: new Date().toISOString(),
            data: { ...eventData.data, displayName },
            actions
          },
          ...prev
        ]);
      })
    );
    
    // Cleanup subscriptions
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, read: true } 
          : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
}

/**
 * Hook to initialize real-time connections when the app starts
 * @param userId The current user's ID
 */
export function useInitializeRealTime(userId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!userId) return;
    
    // Import the initialization function dynamically to avoid circular dependencies
    import('@/lib/api').then(({ initializeRealTimeConnection }) => {
      try {
        initializeRealTimeConnection(userId);
        setIsConnected(true);
        console.log("Real-time connection established");
      } catch (error) {
        console.error("Failed to initialize real-time connection", error);
        setIsConnected(false);
      }
    });
    
    return () => {
      // Cleanup connection when component unmounts
      // This is a simplified version; in a real app, you'd need proper cleanup
      console.log("Cleaning up real-time connection");
      setIsConnected(false);
    };
  }, [userId]);
  
  return { isConnected };
}

// Hook for managing follows and followers
export function useFollows(userId: string | null, refreshKey?: number) {
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    // Fetch real follow data from the backend
    const fetchFollowsData = async () => {
      try {
        const response = await import('@/lib/api').then(({ getFollowsData }) =>
          getFollowsData(userId)
        );

        setFollowing(response.following);
        setFollowers(response.followers);
        setBlockedUsers(response.blockedUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch follows data:", error);
        setIsLoading(false);
      }
    };

    fetchFollowsData();

    // Subscribe to new follower events
    const unsubscribe = subscribeToEvent("new_follower", (eventData: any) => {
      if (eventData.data?.targetUserId === userId) {
        // Current user received a new follower - add to followers list
        setFollowers(prev => [...prev, eventData.data.userId]);
      }
      if (eventData.data?.userId === userId) {
        // Current user followed someone - add to following list
        setFollowing(prev => [...prev, eventData.data.targetUserId]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, refreshKey]); // Add refreshKey as dependency

  const followUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      // Call the API to follow the user
      const response = await import('@/lib/api').then(({ followUser }) =>
        followUser(userId, targetUserId)
      );

      if (response.success) {
        setFollowing(prev => [...prev, targetUserId]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to follow user", error);
      return false;
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      // Call the API to unfollow the user
      const response = await import('@/lib/api').then(({ unfollowUser }) =>
        unfollowUser(userId, targetUserId)
      );

      if (response.success) {
        setFollowing(prev => prev.filter(id => id !== targetUserId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to unfollow user", error);
      return false;
    }
  };

  const blockUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      // Call the API to block the user
      const response = await import('@/lib/api').then(({ blockUser }) =>
        blockUser(userId, targetUserId)
      );

      if (response.success) {
        setBlockedUsers(prev => [...prev, targetUserId]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to block user", error);
      return false;
    }
  };

  const unblockUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      // Call the API to unblock the user
      const response = await import('@/lib/api').then(({ unblockUser }) =>
        unblockUser(userId, targetUserId)
      );

      if (response.success) {
        setBlockedUsers(prev => prev.filter(id => id !== targetUserId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to unblock user", error);
      return false;
    }
  };

  return {
    followers,
    following,
    blockedUsers,
    followersCount: followers.length,
    followingCount: following.length,
    blockedCount: blockedUsers.length,
    isFollowing: (targetUserId: string) => following.includes(targetUserId),
    isBlocked: (targetUserId: string) => blockedUsers.includes(targetUserId),
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    isLoading
  };
}
