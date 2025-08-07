import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Chip,
  Divider,
  useTheme,
  alpha,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Avatar,
  LinearProgress,
  Badge,
  Skeleton,
  Fade,
  Grow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  TrendingUp,
  Visibility,
  Article,
  Schedule,
  Share,
  Report,
  ExpandMore,
  EmojiEvents,
  Star,
  LocalFireDepartment,
  Timeline,
  BookmarkBorder,
  FavoriteBorder,
  Comment,
  ThumbUp,
  Category,
  CalendarToday,
  LocationOn,
  Work,
  School,
  Language,
  Email,
  Phone,
  Public,
  Lock,
  Verified,
  TrendingFlat,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { getUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import UserProfileCard from "../components/UserProfileCard";
import BlogCard from "../components/BlogCard";
import UserActivityTimeline from "../components/UserActivityTimeline";
import { toast } from "react-toastify";

interface UserProfile {
  _id: string;
  name: string;
  bio: string;
  profilePicture?: string;
  followers: number;
  following: number;
  blogs: any[];
  isFollowing?: boolean;
  expertise?: string[];
  postsCount?: number;
  totalViews?: number;
  topCategory?: string;
  joinedDate?: string;
  isVerified?: boolean;
  reputation?: number;
  location?: string;
  website?: string;
  occupation?: string;
  education?: string;
  achievements?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  activityStats?: {
    totalLikes: number;
    totalComments: number;
    totalBookmarks: number;
    engagementRate: number;
    averageReadTime: number;
  };
  recentAchievements?: Array<{
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
}

const PROFILE_STATS = [
  {
    icon: <Article />,
    label: "Total Posts",
    getValue: (profile: UserProfile) => profile?.postsCount || 0,
    color: "primary.main",
    description: "Published articles",
  },
  {
    icon: <Visibility />,
    label: "Total Views",
    getValue: (profile: UserProfile) => profile?.totalViews || 0,
    color: "secondary.main",
    description: "Article views",
  },
  {
    icon: <ThumbUp />,
    label: "Total Likes",
    getValue: (profile: UserProfile) => profile?.activityStats?.totalLikes || 0,
    color: "error.main",
    description: "Likes received",
  },
  {
    icon: <Comment />,
    label: "Comments",
    getValue: (profile: UserProfile) =>
      profile?.activityStats?.totalComments || 0,
    color: "info.main",
    description: "Comments received",
  },
  {
    icon: <TrendingUp />,
    label: "Top Category",
    getValue: (profile: UserProfile) => profile?.topCategory || "N/A",
    color: "warning.main",
    description: "Most active category",
  },
  {
    icon: <Schedule />,
    label: "Member Since",
    getValue: (profile: UserProfile) =>
      profile?.joinedDate ? new Date(profile.joinedDate).getFullYear() : "N/A",
    color: "success.main",
    description: "Join year",
  },
];

const ACTIVITY_METRICS = [
  {
    icon: <LocalFireDepartment />,
    label: "Engagement Rate",
    getValue: (profile: UserProfile) =>
      `${profile?.activityStats?.engagementRate || 0}%`,
    color: "error.main",
  },
  {
    icon: <Schedule />,
    label: "Avg. Read Time",
    getValue: (profile: UserProfile) =>
      `${profile?.activityStats?.averageReadTime || 0} min`,
    color: "info.main",
  },
  {
    icon: <BookmarkBorder />,
    label: "Bookmarked",
    getValue: (profile: UserProfile) =>
      profile?.activityStats?.totalBookmarks || 0,
    color: "warning.main",
  },
];

function UserProfile() {
  const theme = useTheme();
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Helper function to resolve theme colors properly
  const getThemeColor = (colorPath: string) => {
    const [palette, shade] = colorPath.split(".");
    const paletteColor = (theme.palette as any)[palette];
    return paletteColor?.[shade] || theme.palette.primary.main;
  };

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const filterValidBlogs = (blogs: any[]) => {
    return blogs.filter(
      (blog) =>
        blog._id &&
        blog.title &&
        blog.content &&
        blog.category &&
        blog.createdAt &&
        blog.user
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${profile?.name}'s Profile - BlogVerse`,
        text: `Check out ${profile?.name}'s profile on BlogVerse`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const handleReport = () => {
    toast.info("Report functionality coming soon");
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 1000)
      return {
        level: "Expert",
        color: theme.palette.warning.main,
        icon: <EmojiEvents />,
      };
    if (reputation >= 500)
      return {
        level: "Advanced",
        color: theme.palette.info.main,
        icon: <TrendingUp />,
      };
    if (reputation >= 100)
      return {
        level: "Intermediate",
        color: theme.palette.success.main,
        icon: <Star />,
      };
    return {
      level: "Beginner",
      color: theme.palette.text.secondary,
      icon: null,
    };
  };

  useEffect(() => {
    if (currentUser?._id === userId) {
      navigate("/me");
    }
  }, [currentUser, userId, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError("Invalid user ID");
          return;
        }

        const data = await getUserProfile(userId);
        if (data) {
          data.blogs = filterValidBlogs(data.blogs || []);
          setProfile(data);
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        setError(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ mt: 3, borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton
              variant="rectangular"
              height={60}
              sx={{ borderRadius: 2, mb: 3 }}
            />
            <Grid container spacing={2}>
              {[...Array(4)].map((_, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 6,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.error.main,
                0.1
              )} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <Typography variant="h4" color="error.main" gutterBottom>
              {error ? "Profile Error" : "Profile Not Found"}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error ||
                "The user profile you're looking for doesn't exist or has been removed."}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Go Back Home
            </Button>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Profile Header with Cover Photo Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={2}
          sx={{
            position: "relative",
            borderRadius: 4,
            mb: 4,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
            minHeight: 200,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              p: 2,
              display: "flex",
              gap: 1,
            }}
          >
            <Tooltip title="Share Profile">
              <IconButton
                onClick={handleShare}
                sx={{
                  bgcolor: alpha("#ffffff", 0.2),
                  color: "white",
                  "&:hover": { bgcolor: alpha("#ffffff", 0.3) },
                }}
              >
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Report User">
              <IconButton
                onClick={handleReport}
                sx={{
                  bgcolor: alpha("#ffffff", 0.2),
                  color: "white",
                  "&:hover": { bgcolor: alpha("#ffffff", 0.3) },
                }}
              >
                <Report />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 4,
              background: `linear-gradient(transparent, ${alpha(
                "#000000",
                0.4
              )})`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  profile.isVerified ? (
                    <Verified sx={{ color: "white", fontSize: 16 }} />
                  ) : null
                }
              >
                <Avatar
                  src={profile.profilePicture}
                  alt={profile.name}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "4px solid white",
                    boxShadow: 3,
                  }}
                />
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {profile.name}
                  </Typography>
                  {profile.reputation &&
                    (() => {
                      const repInfo = getReputationLevel(profile.reputation);
                      return (
                        <Chip
                          icon={repInfo.icon}
                          label={repInfo.level}
                          size="small"
                          sx={{
                            bgcolor: alpha("#ffffff", 0.2),
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      );
                    })()}
                </Stack>
                {profile.occupation && (
                  <Typography
                    variant="subtitle1"
                    sx={{ opacity: 0.9, mt: 0.5 }}
                  >
                    {profile.occupation}
                  </Typography>
                )}
                {profile.location && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mt: 0.5 }}
                  >
                    <LocationOn sx={{ fontSize: 16, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {profile.location}
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        </Paper>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Enhanced User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <UserProfileCard
                user={{
                  ...profile,
                  isFollowing: profile.isFollowing || false,
                }}
                onFollowChange={(isFollowing, newFollowerCount) => {
                  console.log("UserProfile: Follow status changed", {
                    isFollowing,
                    newFollowerCount,
                  });
                  setProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          isFollowing,
                          followers:
                            newFollowerCount !== undefined
                              ? newFollowerCount
                              : prev.followers + (isFollowing ? 1 : -1),
                        }
                      : null
                  );
                }}
                compact={false}
                showStats={true}
              />
            </motion.div>

            {/* Enhanced Stats Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.02
                  )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  📊 Detailed Stats
                </Typography>
                <Grid container spacing={2}>
                  {PROFILE_STATS.map((stat, index) => {
                    const resolvedColor = getThemeColor(stat.color);
                    return (
                      <Grid item xs={6} key={index}>
                        <Fade in timeout={500 + index * 100}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              p: 2,
                              bgcolor: alpha(resolvedColor, 0.08),
                              borderRadius: 3,
                              border: `1px solid ${alpha(resolvedColor, 0.2)}`,
                              transition: "all 0.3s ease-in-out",
                              cursor: "pointer",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                bgcolor: alpha(resolvedColor, 0.12),
                                boxShadow: `0 8px 25px ${alpha(
                                  resolvedColor,
                                  0.25
                                )}`,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                color: stat.color,
                                mb: 1,
                                "& svg": { fontSize: 28 },
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                mt: 0.5,
                                fontWeight: 700,
                                color: stat.color,
                                fontSize: "1rem",
                              }}
                            >
                              {typeof stat.getValue(profile) === "number"
                                ? stat.getValue(profile).toLocaleString()
                                : stat.getValue(profile)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.65rem",
                                opacity: 0.7,
                                textAlign: "center",
                                lineHeight: 1.1,
                                mt: 0.5,
                              }}
                            >
                              {stat.description}
                            </Typography>
                          </Box>
                        </Fade>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </motion.div>

            {/* Activity Metrics */}
            {profile?.activityStats && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.warning.main,
                      0.05
                    )} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      theme.palette.warning.main,
                      0.2
                    )}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    🔥 Activity Metrics
                  </Typography>
                  <Stack spacing={2}>
                    {ACTIVITY_METRICS.map((metric, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          bgcolor: alpha(metric.color, 0.1),
                          borderRadius: 2,
                          border: `1px solid ${alpha(metric.color, 0.2)}`,
                        }}
                      >
                        <Box sx={{ color: metric.color, mr: 2 }}>
                          {metric.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {metric.label}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {metric.getValue(profile)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            )}

            {/* Expertise Section */}
            {profile?.expertise && profile.expertise.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.success.main,
                      0.05
                    )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.2
                    )}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    🎯 Areas of Expertise
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {profile.expertise.map((tag, index) => (
                      <Grow in timeout={300 + index * 100} key={index}>
                        <Chip
                          label={tag}
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            borderColor: alpha(theme.palette.success.main, 0.3),
                            color: theme.palette.success.main,
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.success.main, 0.2),
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                      </Grow>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            )}

            {/* Recent Achievements */}
            {profile?.recentAchievements &&
              profile.recentAchievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.warning.main,
                        0.05
                      )} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
                      border: `1px solid ${alpha(
                        theme.palette.warning.main,
                        0.2
                      )}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      🏆 Recent Achievements
                    </Typography>
                    <List dense>
                      {profile.recentAchievements
                        .slice(0, 3)
                        .map((achievement, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <EmojiEvents
                                sx={{ color: theme.palette.warning.main }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={achievement.title}
                              secondary={achievement.description}
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                              }}
                              secondaryTypographyProps={{ fontSize: "0.8rem" }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </motion.div>
              )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Enhanced Tab Navigation */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                mb: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 60,
                    fontSize: "1rem",
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                <Tab
                  icon={<Article />}
                  label={`Posts (${profile?.blogs?.length || 0})`}
                  iconPosition="start"
                />
                <Tab icon={<Public />} label="About" iconPosition="start" />
                <Tab
                  icon={<Timeline />}
                  label="Activity"
                  iconPosition="start"
                />
                <Tab
                  icon={<Category />}
                  label="Insights"
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            <Box sx={{ minHeight: 400 }}>
              {/* Posts Tab */}
              {activeTab === 0 && (
                <Fade in timeout={300}>
                  <Box>
                    {profile?.blogs && profile.blogs.length > 0 ? (
                      <>
                        <Box
                          sx={{
                            mb: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            📝 Published Articles
                          </Typography>
                          <Chip
                            label={`${profile.blogs.length} Posts`}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <Grid container spacing={3}>
                          {profile.blogs.map((blog, index) => (
                            <Grid item xs={12} sm={6} key={blog._id}>
                              <Grow in timeout={300 + index * 100}>
                                <Box>
                                  <BlogCard post={blog} />
                                </Box>
                              </Grow>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ) : (
                      <Paper
                        elevation={2}
                        sx={{
                          p: 8,
                          textAlign: "center",
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                          border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.1
                          )}`,
                        }}
                      >
                        <Article
                          sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                        />
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          No Posts Yet
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                          {profile?.name} hasn't published any articles yet.
                          Check back later!
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Fade>
              )}

              {/* About Tab */}
              {activeTab === 1 && (
                <Fade in timeout={300}>
                  <Stack spacing={3}>
                    {/* Bio Section */}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.info.main,
                          0.02
                        )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                        border: `1px solid ${alpha(
                          theme.palette.info.main,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 3 }}
                      >
                        📖 About {profile?.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{
                          lineHeight: 1.8,
                          fontSize: "1.1rem",
                          color: "text.primary",
                        }}
                      >
                        {profile?.bio || "This user hasn't added a bio yet."}
                      </Typography>
                    </Paper>

                    {/* Professional Information */}
                    <Grid container spacing={3}>
                      {profile?.occupation && (
                        <Grid item xs={12} sm={6}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.success.main, 0.05),
                              border: `1px solid ${alpha(
                                theme.palette.success.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Work
                                sx={{ color: "success.main", fontSize: 30 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Occupation
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {profile.occupation}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      )}

                      {profile?.location && (
                        <Grid item xs={12} sm={6}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.warning.main, 0.05),
                              border: `1px solid ${alpha(
                                theme.palette.warning.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <LocationOn
                                sx={{ color: "warning.main", fontSize: 30 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Location
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {profile.location}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      )}

                      {profile?.education && (
                        <Grid item xs={12} sm={6}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.info.main, 0.05),
                              border: `1px solid ${alpha(
                                theme.palette.info.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <School
                                sx={{ color: "info.main", fontSize: 30 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Education
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {profile.education}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      )}

                      {profile?.website && (
                        <Grid item xs={12} sm={6}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              border: `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Language
                                sx={{ color: "primary.main", fontSize: 30 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Website
                                </Typography>
                                <Typography
                                  variant="h6"
                                  component="a"
                                  href={profile.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    fontWeight: 600,
                                    color: "primary.main",
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                >
                                  Visit Website
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>

                    {/* Join Date */}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CalendarToday
                          sx={{ color: "secondary.main", fontSize: 30 }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Member Since
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {profile?.joinedDate
                              ? new Date(profile.joinedDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Unknown"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Stack>
                </Fade>
              )}

              {/* Activity Tab */}
              {activeTab === 2 && (
                <Fade in timeout={300}>
                  <Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 3 }}
                    >
                      🎯 Recent Activity
                    </Typography>
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      }}
                    >
                      {userId && (
                        <UserActivityTimeline userId={userId} limit={20} />
                      )}
                    </Paper>
                  </Box>
                </Fade>
              )}

              {/* Insights Tab */}
              {activeTab === 3 && (
                <Fade in timeout={300}>
                  <Stack spacing={3}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700 }}
                    >
                      📊 Profile Insights
                    </Typography>

                    {/* Writing Style Analysis */}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.info.main, 0.02),
                        border: `1px solid ${alpha(
                          theme.palette.info.main,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 3 }}
                      >
                        Writing Style Analysis
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              color="primary.main"
                              sx={{ fontWeight: 700 }}
                            >
                              {profile?.activityStats?.averageReadTime || 5}min
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Avg. Read Time
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              color="success.main"
                              sx={{ fontWeight: 700 }}
                            >
                              {profile?.activityStats?.engagementRate || 12}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Engagement Rate
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              color="warning.main"
                              sx={{ fontWeight: 700 }}
                            >
                              {profile?.topCategory || "Tech"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Top Category
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Content Performance */}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.success.main, 0.02),
                        border: `1px solid ${alpha(
                          theme.palette.success.main,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 3 }}
                      >
                        Content Performance
                      </Typography>

                      <Stack spacing={2}>
                        {/* Views Progress */}
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">Total Views</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(profile?.totalViews || 0).toLocaleString()}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              ((profile?.totalViews || 0) / 1000) * 100,
                              100
                            )}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        {/* Likes Progress */}
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">Total Likes</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(
                                profile?.activityStats?.totalLikes || 0
                              ).toLocaleString()}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              ((profile?.activityStats?.totalLikes || 0) /
                                100) *
                                100,
                              100
                            )}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              "& .MuiLinearProgress-bar": {
                                bgcolor: theme.palette.error.main,
                              },
                            }}
                          />
                        </Box>

                        {/* Comments Progress */}
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Total Comments
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(
                                profile?.activityStats?.totalComments || 0
                              ).toLocaleString()}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              ((profile?.activityStats?.totalComments || 0) /
                                50) *
                                100,
                              100
                            )}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              "& .MuiLinearProgress-bar": {
                                bgcolor: theme.palette.info.main,
                              },
                            }}
                          />
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Growth Trends */}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.warning.main, 0.02),
                        border: `1px solid ${alpha(
                          theme.palette.warning.main,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 3 }}
                      >
                        Growth Overview
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Detailed analytics and growth trends will be available
                        here in future updates.
                      </Typography>
                    </Paper>
                  </Stack>
                </Fade>
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserProfile;
