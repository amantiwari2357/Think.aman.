
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-realtime';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export function Notifications() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  // Helper to format timestamps
  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Helper to get notification icon by type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_problem':
        return <span className="text-blue-500">🔔</span>;
      case 'problem_accepted':
        return <span className="text-green-500">✅</span>;
      case 'new_message':
        return <span className="text-purple-500">💬</span>;
      case 'expert_available':
        return <span className="text-amber-500">👨‍💼</span>;
      case 'new_follower':
        return <span className="text-pink-500">👤</span>;
      case 'new_like':
        return <span className="text-red-500">❤️</span>;
      case 'new_comment':
        return <span className="text-indigo-500">💬</span>;
      default:
        return <span className="text-gray-500">📌</span>;
    }
  };

  // Helper to get notification link by type and data
  const getNotificationLink = (type: string, data: any) => {
    switch (type) {
      case 'new_problem':
        return data?.id ? `/problem/${data.id}` : '/browse';
      case 'problem_accepted':
      case 'new_message':
        return data?.chatId ? `/chat/${data.chatId}` : '/requests';
      case 'expert_available':
        return data?.problemId ? `/problem/${data.problemId}` : '/requests';
      case 'new_follower':
        return data?.userId ? `/profile/${data.userId}` : '/dashboard';
      case 'new_like':
      case 'new_comment':
        return data?.postId ? `/post/${data.postId}` : '/posts';
      default:
        return '/dashboard';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs" 
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs" 
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <>
              {notifications.slice(0, 5).map((notification) => (
                <Link 
                  key={notification.id}
                  to={getNotificationLink(notification.type, notification.data)}
                  onClick={() => markAsRead(notification.id)}
                >
                  <DropdownMenuItem 
                    className={cn(
                      "flex flex-col items-start p-3 cursor-pointer", 
                      !notification.read && "bg-muted/50"
                    )}
                  >
                    <div className="flex w-full">
                      <div className="mr-2">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
              
              {notifications.length > 5 && (
                <Link to="/notifications">
                  <DropdownMenuItem className="w-full text-center p-2 cursor-pointer">
                    <span className="text-sm text-primary font-medium">
                      View all notifications
                    </span>
                  </DropdownMenuItem>
                </Link>
              )}
            </>
          )}
        </DropdownMenuGroup>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Link to="/notifications" className="block w-full">
              <DropdownMenuItem className="justify-center cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
