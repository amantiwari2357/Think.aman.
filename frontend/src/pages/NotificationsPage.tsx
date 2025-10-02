
import { useContext } from "react";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { Footer } from "@/components/Footer";
import { useNotifications } from "@/hooks/use-realtime";
import { format } from "date-fns";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, Check, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
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

  if (!user) {
    return null; // Should be handled by route protection
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AuthenticatedNavbar />
      <main className="flex-1 container py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h1 className="text-3xl font-bold tracking-tighter">Notifications</h1>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
            <p className="text-muted-foreground mb-4">
              When you receive notifications, they will appear here.
            </p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                <div className={`p-4 ${!notification.read ? "bg-muted/50" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link 
                          to={getNotificationLink(notification.type, notification.data)}
                          onClick={() => markAsRead(notification.id)} 
                          className="font-medium hover:underline"
                        >
                          {notification.message}
                        </Link>
                        {!notification.read && (
                          <Badge variant="secondary" className="ml-2">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeNotification(notification.id)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
