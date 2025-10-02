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
    read: boolean;
    timestamp: string;
    data?: any;
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
      "new_comment"
    ];
    
    const unsubscribers = eventTypes.map(eventType => 
      subscribeToEvent(eventType, (eventData: any) => {
        let message = "";
        
        // Create appropriate message based on event type
        switch (eventType) {
          case "new_problem":
            message = `New problem posted: ${eventData.data?.title || "Untitled"}`;
            break;
          case "problem_accepted":
            message = `Your problem has been accepted by an expert`;
            break;
          case "new_message":
            message = `You have a new message in your chat`;
            break;
          case "expert_available":
            message = `Expert available for your problem`;
            break;
          case "new_follower":
            message = `${eventData.data?.userName || "Someone"} started following you`;
            break;
          case "new_like":
            message = `${eventData.data?.userName || "Someone"} liked your post`;
            break;
          case "new_comment":
            message = `${eventData.data?.userName || "Someone"} commented on your post`;
            break;
          default:
            message = `New notification received`;
        }
        
        // Add notification
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            type: eventType,
            message,
            read: false,
            timestamp: new Date().toISOString(),
            data: eventData.data
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
export function useFollows(userId: string | null) {
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    // Mock follow data - in a real app, this would fetch from an API
    const mockFollowers = ["user1", "user2", "user3"];
    const mockFollowing = ["user4", "user5"];

    // Simulate API call delay
    const timeout = setTimeout(() => {
      setFollowers(mockFollowers);
      setFollowing(mockFollowing);
      setIsLoading(false);
    }, 500);

    // Subscribe to new follower events
    const unsubscribe = subscribeToEvent("new_follower", (eventData: any) => {
      if (eventData.data?.targetUserId === userId) {
        setFollowers(prev => [...prev, eventData.data.userId]);
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [userId]);

  const followUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      // Mock successful follow operation
      setFollowing(prev => [...prev, targetUserId]);
      
      // Simulate notifying the target user about new follower
      setTimeout(() => {
        // This would be handled by the server in a real app
        const eventData = {
          type: "new_follower",
          data: {
            userId,
            userName: "Current User", // In a real app, this would be the actual username
            targetUserId
          }
        };
        
        // Fix: Instead of calling the result of subscribeToEvent,
        // we should directly call notifyListeners from the API
        import('@/lib/api').then(({ notifyListeners }) => {
          notifyListeners("new_follower", eventData);
        });
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Failed to follow user", error);
      return false;
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      // Mock successful unfollow operation
      setFollowing(prev => prev.filter(id => id !== targetUserId));
      
      // In a real app, you would call an API here
      
      return true;
    } catch (error) {
      console.error("Failed to unfollow user", error);
      return false;
    }
  };

  return {
    followers,
    following,
    followersCount: followers.length,
    followingCount: following.length,
    isFollowing: (targetUserId: string) => following.includes(targetUserId),
    followUser,
    unfollowUser,
    isLoading
  };
}
