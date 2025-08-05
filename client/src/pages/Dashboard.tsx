import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Button,
  Skeleton,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Person,
  Create,
  Analytics,
  Edit,
  Favorite,
  Comment,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUserPosts,
  getUserLikedPosts,
  getUserBookmarkedPosts,
  getUserDrafts,
} from "../services/blogService";
import { getDashboardStats } from "../services/dashboardService";
import { toast } from "react-toastify";
import BlogCard from "../components/BlogCard";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  coverImage?: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  comments: any[];
  likes: any[];
}

interface Stats {
  totalPosts: number;
  followers: number;
  following: number;
  comments: number;
  completedTasks: number;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [_, setStats] = useState<Stats>({
    totalPosts: 0,
    followers: 0,
    following: 0,
    comments: 0,
    completedTasks: 0,
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<BlogPost[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BlogPost[]>([]);
  const [draftPosts, setDraftPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [userPosts, likedData, bookmarkedData, statsData, draftsData] =
          await Promise.all([
            getUserPosts(),
            getUserLikedPosts(),
            getUserBookmarkedPosts(),
            getDashboardStats(),
            getUserDrafts(),
          ]);

        setPosts(userPosts);
        setLikedPosts(likedData);
        setBookmarkedPosts(bookmarkedData);
        setDashboardStats(statsData);
        setDraftPosts(draftsData);

        setStats({
          totalPosts: statsData.totalPosts,
          followers: statsData.followers,
          following: statsData.following,
          comments: statsData.comments,
          completedTasks: 0,
        });
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to load dashboard data";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = async () => {
    try {
      const [userPosts, likedData, bookmarkedData, statsData, draftsData] =
        await Promise.all([
          getUserPosts(),
          getUserLikedPosts(),
          getUserBookmarkedPosts(),
          getDashboardStats(),
          getUserDrafts(),
        ]);

      setPosts(userPosts);
      setLikedPosts(likedData);
      setBookmarkedPosts(bookmarkedData);
      setDashboardStats(statsData);
      setDraftPosts(draftsData);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to refresh data";
      toast.error(message);
    }
  };

  const handlePublishDraft = async (postId: string) => {
    // Remove the published post from drafts and refresh data
    setDraftPosts((prev) => prev.filter((post) => post._id !== postId));
    await refreshData();
  };

  const handleDeletePost = async (postId: string) => {
    // Remove the deleted post from all relevant state arrays
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setDraftPosts((prev) => prev.filter((post) => post._id !== postId));
    setLikedPosts((prev) => prev.filter((post) => post._id !== postId));
    setBookmarkedPosts((prev) => prev.filter((post) => post._id !== postId));

    // Refresh dashboard data to get updated counts
    await refreshData();
  };

  const statsConfig = [
    {
      label: "Total Posts",
      value: dashboardStats.totalPosts || 0,
      icon: <Create fontSize="large" color="primary" />,
      color: "#0FA4AF",
    },
    {
      label: "Followers",
      value: dashboardStats.followers || 0,
      icon: <Person fontSize="large" color="primary" />,
      color: "#7986CB",
    },
    {
      label: "Total Views",
      value: dashboardStats.stats?.views || 0,
      icon: <Analytics fontSize="large" color="primary" />,
      color: "#4DB6AC",
    },
    {
      label: "Engagement",
      value: Math.round((dashboardStats.stats?.engagement || 0) * 10) / 10,
      icon: <Comment fontSize="large" color="primary" />,
      color: "#FF8A65",
    },
  ];

  const tabContent = [
    {
      label: `My Posts (${posts.length})`,
      content: posts,
      loading: loading,
    },
    {
      label: `Drafts (${draftPosts.length})`,
      content: draftPosts,
      loading: loading,
      isDraft: true,
    },
    {
      label: `Liked (${likedPosts.length})`,
      content: likedPosts,
      loading: loading,
    },
    {
      label: `Bookmarked (${bookmarkedPosts.length})`,
      content: bookmarkedPosts,
      loading: loading,
    },
  ];

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 8 }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 3 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" sx={{ mt: 2 }} />
                <Skeleton variant="text" width="60%" />
              </Paper>
            </Grid>
          ))}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #024950 30%, #0FA4AF 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Welcome back, {user?.name || "User"}!
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontSize: "1.1rem",
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Here's what's happening with your blog today
        </Typography>
      </Box>

      {/* Stats Grid Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statsConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: stat.color,
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at top right, ${stat.color}20, transparent 50%)`,
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ ml: "auto" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 5,
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(8px)",
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* My Posts Section */}
      <Paper sx={{ mb: 6, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
            My Content
          </Typography>
        </Box>
        <Divider />

        {/* Tabs Navigation */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_v, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  py: 2,
                },
              }}
            >
              {tabContent.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {tabContent.map((tab, index) => (
              <div
                key={index}
                role="tabpanel"
                hidden={activeTab !== index}
                id={`tab-${index}`}
                aria-labelledby={`tab-${index}`}
              >
                {activeTab === index && (
                  <>
                    {tab.content.length > 0 ? (
                      <Grid container spacing={3}>
                        {tab.content.map((post) => (
                          <Grid item xs={12} sm={6} md={4} key={post._id}>
                            <BlogCard
                              post={{
                                ...post,
                                user: post.user || { _id: "", name: "" },
                              }}
                              isDraft={tab.isDraft}
                              onEdit={
                                tab.isDraft
                                  ? () => navigate(`/write?id=${post._id}`)
                                  : undefined
                              }
                              onPublish={
                                tab.isDraft ? handlePublishDraft : undefined
                              }
                              onDelete={handleDeletePost}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {activeTab === 0
                            ? "You haven't published any posts yet"
                            : activeTab === 1
                            ? "You don't have any drafts"
                            : activeTab === 2
                            ? "You haven't liked any posts yet"
                            : "You haven't bookmarked any posts yet"}
                        </Typography>
                        {activeTab <= 1 && (
                          <Button
                            variant="contained"
                            component={Link}
                            to="/write"
                            startIcon={<Edit />}
                          >
                            Create New Post
                          </Button>
                        )}
                        {(activeTab === 2 || activeTab === 3) && (
                          <Button
                            variant="contained"
                            component={Link}
                            to="/explore"
                            startIcon={<Favorite />}
                          >
                            Explore Posts
                          </Button>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </div>
            ))}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Dashboard;
