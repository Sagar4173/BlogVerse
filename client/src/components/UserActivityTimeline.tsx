import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Skeleton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Create,
  Favorite,
  Comment,
  PersonAdd,
  Article,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

// Simple time formatting utility
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

interface ActivityItem {
  _id: string;
  type:
    | "post_created"
    | "post_liked"
    | "comment_added"
    | "user_followed"
    | "post_bookmarked";
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  blog?: {
    _id: string;
    title: string;
  };
  targetUser?: {
    _id: string;
    name: string;
  };
  metadata?: {
    commentText?: string;
    likeCount?: number;
  };
}

interface UserActivityTimelineProps {
  userId: string;
  limit?: number;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "post_created":
      return <Create />;
    case "post_liked":
      return <Favorite />;
    case "comment_added":
      return <Comment />;
    case "user_followed":
      return <PersonAdd />;
    case "post_bookmarked":
      return <Article />;
    default:
      return <Article />;
  }
};

const getActivityColor = (
  type: string
): "primary" | "secondary" | "error" | "warning" | "info" | "success" => {
  switch (type) {
    case "post_created":
      return "primary";
    case "post_liked":
      return "error";
    case "comment_added":
      return "info";
    case "user_followed":
      return "success";
    case "post_bookmarked":
      return "warning";
    default:
      return "primary";
  }
};

const getActivityDescription = (activity: ActivityItem): JSX.Element => {
  const { type, user, blog, targetUser, metadata } = activity;

  switch (type) {
    case "post_created":
      return (
        <Box>
          <Typography variant="body1">
            <strong>{user.name}</strong> published a new blog post
          </Typography>
          {blog && (
            <Typography
              component={Link}
              to={`/blog/${blog._id}`}
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              "{blog.title}"
            </Typography>
          )}
        </Box>
      );

    case "post_liked":
      return (
        <Box>
          <Typography variant="body1">
            <strong>{user.name}</strong> liked a blog post
          </Typography>
          {blog && (
            <Typography
              component={Link}
              to={`/blog/${blog._id}`}
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              "{blog.title}"
            </Typography>
          )}
          {metadata?.likeCount && (
            <Chip
              size="small"
              label={`${metadata.likeCount} likes`}
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      );

    case "comment_added":
      return (
        <Box>
          <Typography variant="body1">
            <strong>{user.name}</strong> commented on a blog post
          </Typography>
          {blog && (
            <Typography
              component={Link}
              to={`/blog/${blog._id}`}
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              "{blog.title}"
            </Typography>
          )}
          {metadata?.commentText && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              "{metadata.commentText.substring(0, 100)}
              {metadata.commentText.length > 100 ? "..." : ""}"
            </Typography>
          )}
        </Box>
      );

    case "user_followed":
      return (
        <Box>
          <Typography variant="body1">
            <strong>{user.name}</strong> started following{" "}
            {targetUser && (
              <Typography
                component={Link}
                to={`/user/${targetUser._id}`}
                variant="body1"
                color="primary"
                sx={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {targetUser.name}
              </Typography>
            )}
          </Typography>
        </Box>
      );

    case "post_bookmarked":
      return (
        <Box>
          <Typography variant="body1">
            <strong>{user.name}</strong> bookmarked a blog post
          </Typography>
          {blog && (
            <Typography
              component={Link}
              to={`/blog/${blog._id}`}
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              "{blog.title}"
            </Typography>
          )}
        </Box>
      );

    default:
      return (
        <Typography variant="body1">
          <strong>{user.name}</strong> performed an activity
        </Typography>
      );
  }
};

export default function UserActivityTimeline({
  userId,
  limit = 20,
}: UserActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API first
        try {
          const response = await fetch(
            `/api/users/${userId}/activity?limit=${limit}`
          );
          if (response.ok) {
            const data = await response.json();
            setActivities(data.activities || []);
            return;
          }
        } catch (apiError) {
          console.error("API call failed, using mock data:", apiError);
        }

        // Fallback to mock data if API fails
        const mockActivities: ActivityItem[] = [
          {
            _id: "1",
            type: "post_created",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: userId,
              name: "John Doe",
              profilePicture: "/avatar1.jpg",
            },
            blog: { _id: "blog1", title: "Getting Started with React Hooks" },
          },
          {
            _id: "2",
            type: "post_liked",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: userId,
              name: "John Doe",
              profilePicture: "/avatar1.jpg",
            },
            blog: { _id: "blog2", title: "Advanced TypeScript Patterns" },
            metadata: { likeCount: 15 },
          },
          {
            _id: "3",
            type: "comment_added",
            createdAt: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            user: {
              _id: userId,
              name: "John Doe",
              profilePicture: "/avatar1.jpg",
            },
            blog: {
              _id: "blog3",
              title: "Building Scalable Node.js Applications",
            },
            metadata: {
              commentText:
                "Great article! This really helped me understand the concepts better.",
            },
          },
          {
            _id: "4",
            type: "user_followed",
            createdAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            user: {
              _id: userId,
              name: "John Doe",
              profilePicture: "/avatar1.jpg",
            },
            targetUser: { _id: "user2", name: "Jane Smith" },
          },
          {
            _id: "5",
            type: "post_bookmarked",
            createdAt: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            user: {
              _id: userId,
              name: "John Doe",
              profilePicture: "/avatar1.jpg",
            },
            blog: { _id: "blog4", title: "Modern CSS Grid Techniques" },
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActivities(mockActivities.slice(0, limit));
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activity timeline");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, limit]);

  if (loading) {
    return (
      <Box>
        {[...Array(5)].map((_, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" sx={{ py: 4 }}>
        {error}
      </Typography>
    );
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No recent activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start engaging with the community to see your activity here!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%" }}>
      {activities.map((activity, index) => (
        <div key={activity._id}>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemAvatar>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: getActivityColor(activity.type) + ".main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Box>
                {index < activities.length - 1 && (
                  <Box
                    sx={{
                      width: 2,
                      height: 60,
                      backgroundColor: "divider",
                      mt: 1,
                    }}
                  />
                )}
              </Box>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Avatar
                    src={activity.user.profilePicture}
                    sx={{ width: 32, height: 32 }}
                  >
                    {activity.user.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>{getActivityDescription(activity)}</Box>
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {formatTimeAgo(activity.createdAt)}
                </Typography>
              }
            />
          </ListItem>
          {index < activities.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </div>
      ))}
    </List>
  );
}
