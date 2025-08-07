import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  Chip,
  useTheme,
  CircularProgress,
  Tooltip,
  Skeleton,
  IconButton,
  Stack,
  Divider,
  Badge,
  Paper,
  Zoom,
} from "@mui/material";
import {
  PersonAdd,
  CheckCircle,
  CalendarMonth,
  LocationOn,
  Work,
  Language,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  MoreVert,
  Star,
  Verified,
  TrendingUp,
  EmojiEvents,
  Favorite,
} from "@mui/icons-material";
import { followUser, unfollowUser } from "../services/userService";
import { toast } from "react-toastify";
import { alpha } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import FollowersListDialog from "./FollowersListDialog";
import { motion } from "framer-motion";

interface UserProfileCardProps {
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
    bio?: string;
    followers?: number;
    following?: number;
    isFollowing: boolean;
    role?: string;
    joinedDate?: string;
    location?: string;
    occupation?: string;
    expertise?: string[];
    socialLinks?: {
      website?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
    postsCount?: number;
    totalViews?: number;
    isVerified?: boolean;
    reputation?: number;
    topCategory?: string;
  };
  onFollowChange?: (isFollowing: boolean, newFollowerCount?: number) => void;
  isLoading?: boolean;
  showStats?: boolean;
  compact?: boolean;
}

export default function UserProfileCard({
  user,
  onFollowChange,
  isLoading = false,
  showStats = true,
  compact = false,
}: UserProfileCardProps) {
  const theme = useTheme();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.followers || 0);
  const [openDialog, setOpenDialog] = useState<
    "followers" | "following" | null
  >(null);
  const [isHovering, setIsHovering] = useState(false);

  // Update local state when user prop changes (important for fixing the refresh issue)
  useEffect(() => {
    console.log("UserProfileCard: User prop changed", {
      userId: user._id,
      isFollowing: user.isFollowing,
      followers: user.followers,
    });
    setIsFollowing(user.isFollowing);
    setFollowerCount(user.followers || 0);
  }, [user._id, user.isFollowing, user.followers]);

  // Don't show follow button for current user
  const isCurrentUser = currentUser?._id === user._id;

  const handleFollowersClick = () => {
    setOpenDialog("followers");
  };

  const handleFollowingClick = () => {
    setOpenDialog("following");
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      setIsLoadingFollow(true);
      console.log(
        "Toggling follow for user:",
        user._id,
        "current state:",
        isFollowing
      );

      if (isFollowing) {
        const response = await unfollowUser(user._id);
        console.log("Unfollow response:", response);
        if (!response.isFollowing) {
          setIsFollowing(false);
          const newCount = response.followers || Math.max(0, followerCount - 1);
          setFollowerCount(newCount);
          onFollowChange?.(false, newCount);
          toast.success("Unfollowed successfully");
        }
      } else {
        const response = await followUser(user._id);
        console.log("Follow response:", response);
        if (response.isFollowing) {
          setIsFollowing(true);
          const newCount = response.followers || followerCount + 1;
          setFollowerCount(newCount);
          onFollowChange?.(true, newCount);
          toast.success("Following user");
        }
      }
    } catch (error: any) {
      console.error("Follow toggle error:", error);
      toast.error(error.message || "Failed to update follow status", {
        icon: "😕",
      });
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "website":
        return <Language sx={{ fontSize: 18 }} />;
      case "facebook":
        return <Facebook sx={{ fontSize: 18 }} />;
      case "twitter":
        return <Twitter sx={{ fontSize: 18 }} />;
      case "linkedin":
        return <LinkedIn sx={{ fontSize: 18 }} />;
      case "instagram":
        return <Instagram sx={{ fontSize: 18 }} />;
      default:
        return <Language sx={{ fontSize: 18 }} />;
    }
  };

  const getSocialLinks = () => {
    if (!user.socialLinks) return [];

    return Object.entries(user.socialLinks)
      .filter(([_, url]) => url && url.trim() !== "")
      .map(([platform, url]) => ({
        platform,
        url: url.startsWith("http") ? url : `https://${url}`,
        icon: getSocialIcon(platform),
      }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const truncateBio = (bio: string, maxLength: number = 120) => {
    if (bio.length <= maxLength) return bio;
    return `${bio.substring(0, maxLength)}...`;
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

  const handleSocialLinkClick = (url: string, platform: string) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(`Failed to open ${platform} link`);
    }
  };

  if (isLoading) {
    return (
      <Card elevation={3} sx={{ p: compact ? 1.5 : 2.5 }}>
        <CardContent sx={{ p: compact ? 1 : 0 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton
              variant="circular"
              width={compact ? 60 : 90}
              height={compact ? 60 : 90}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const socialLinks = getSocialLinks();
  const reputationInfo = user.reputation
    ? getReputationLevel(user.reputation)
    : null;

  return (
    <>
      <Card
        elevation={3}
        sx={{
          p: compact ? 2 : 2.5,
          position: "relative",
          transition: "all 0.3s ease-in-out",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.02
          )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 4,
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          },
          ...(compact && {
            p: 1.5,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          }),
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: compact ? 1.5 : 2.5,
            }}
          >
            {/* Header with Avatar and Basic Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: compact ? 1.5 : 2.5,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  sx={{
                    width: compact ? 70 : 90,
                    height: compact ? 70 : 90,
                    border: "4px solid",
                    borderColor: user.isVerified
                      ? "warning.main"
                      : "primary.main",
                    boxShadow: `0 6px 16px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                {user.isVerified && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      backgroundColor: theme.palette.warning.main,
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${theme.palette.background.paper}`,
                    }}
                  >
                    <Verified sx={{ fontSize: 14, color: "white" }} />
                  </Box>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant={compact ? "h6" : "h5"}
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1.2,
                    }}
                  >
                    {user.name}
                  </Typography>
                  {reputationInfo && (
                    <Tooltip
                      title={`${reputationInfo.level} (${user.reputation} points)`}
                    >
                      <Chip
                        {...(reputationInfo.icon && {
                          icon: reputationInfo.icon,
                        })}
                        label={reputationInfo.level}
                        size="small"
                        sx={{
                          bgcolor: alpha(reputationInfo.color, 0.1),
                          color: reputationInfo.color,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 22,
                        }}
                      />
                    </Tooltip>
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1, flexWrap: "wrap", gap: 0.5 }}
                >
                  {user.role && (
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}
                  {user.topCategory && (
                    <Chip
                      label={`Top in ${user.topCategory}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.secondary.main, 0.3),
                        color: "secondary.main",
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                </Stack>

                {!compact && user.occupation && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <Work fontSize="small" />
                    {user.occupation}
                  </Typography>
                )}

                {!compact && user.location && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <LocationOn fontSize="small" />
                    {user.location}
                  </Typography>
                )}

                {user.bio && (
                  <Tooltip title={user.bio}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: compact ? 1 : 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.4,
                      }}
                    >
                      {compact
                        ? truncateBio(user.bio, 60)
                        : truncateBio(user.bio, 100)}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {/* Expertise Tags */}
            {!compact && user.expertise && user.expertise.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {user.expertise.slice(0, 3).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.7rem",
                      height: 24,
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                      color: "secondary.main",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      },
                    }}
                  />
                ))}
                {user.expertise.length > 3 && (
                  <Chip
                    label={`+${user.expertise.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.7rem",
                      height: 24,
                      borderColor: alpha(theme.palette.text.secondary, 0.3),
                      color: "text.secondary",
                    }}
                  />
                )}
              </Box>
            )}

            {/* Stats and Social Links */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: compact ? "wrap" : "nowrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: compact ? 1 : 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Tooltip title="View followers">
                  <Chip
                    size={compact ? "small" : "medium"}
                    label={`${formatNumber(followerCount)} followers`}
                    onClick={handleFollowersClick}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: compact ? "0.7rem" : "0.8rem",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </Tooltip>

                <Tooltip title="View following">
                  <Chip
                    size={compact ? "small" : "medium"}
                    label={`${formatNumber(user.following || 0)} following`}
                    onClick={handleFollowingClick}
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: "secondary.main",
                      fontWeight: 600,
                      fontSize: compact ? "0.7rem" : "0.8rem",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </Tooltip>
              </Box>

              {/* Social Links */}
              {!compact && socialLinks.length > 0 && (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {socialLinks.slice(0, 4).map((link, index) => (
                    <Tooltip key={index} title={`Visit ${link.platform}`}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleSocialLinkClick(link.url, link.platform)
                        }
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        {link.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                  {socialLinks.length > 4 && (
                    <Tooltip title={`+${socialLinks.length - 4} more links`}>
                      <IconButton
                        size="small"
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: alpha(theme.palette.text.secondary, 0.1),
                          color: "text.secondary",
                          fontSize: "0.7rem",
                        }}
                      >
                        +{socialLinks.length - 4}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </Box>

            {/* Additional Stats */}
            {showStats &&
              !compact &&
              (user.postsCount !== undefined ||
                user.totalViews !== undefined) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 3 }}
                  >
                    {user.postsCount !== undefined && (
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          {formatNumber(user.postsCount)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Posts
                        </Typography>
                      </Box>
                    )}
                    {user.totalViews !== undefined && (
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "secondary.main" }}
                        >
                          {formatNumber(user.totalViews)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Views
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

            {/* Join Date and Follow Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexDirection: compact ? "column" : "row",
              }}
            >
              {user.joinedDate && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    flex: compact ? 0 : 1,
                    fontSize: compact ? "0.7rem" : "0.75rem",
                  }}
                >
                  <CalendarMonth fontSize="small" />
                  Joined{" "}
                  {new Date(user.joinedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </Typography>
              )}

              {!isCurrentUser && (
                <Tooltip title={isFollowing ? "Unfollow user" : "Follow user"}>
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    startIcon={
                      isFollowing ? (
                        isHovering ? null : (
                          <CheckCircle sx={{ color: "success.main" }} />
                        )
                      ) : (
                        <PersonAdd />
                      )
                    }
                    onClick={handleFollowToggle}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={isLoadingFollow}
                    size={compact ? "small" : "medium"}
                    sx={{
                      minWidth: compact ? 120 : 140,
                      height: compact ? 36 : 42,
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 3,
                      fontSize: compact ? "0.8rem" : "0.9rem",
                      ...(!isFollowing && {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        color: "white",
                        boxShadow: `0 4px 12px ${alpha(
                          theme.palette.primary.main,
                          0.4
                        )}`,
                        "&:hover": {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 16px ${alpha(
                            theme.palette.primary.main,
                            0.5
                          )}`,
                        },
                      }),
                      ...(isFollowing && {
                        borderColor: isHovering ? "error.main" : "success.main",
                        color: isHovering ? "error.main" : "success.main",
                        bgcolor: isHovering
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.success.main, 0.1),
                        "&:hover": {
                          borderColor: "error.main",
                          color: "error.main",
                          bgcolor: alpha(theme.palette.error.main, 0.15),
                          transform: "translateY(-2px)",
                        },
                      }),
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {isLoadingFollow ? (
                      <CircularProgress size={20} />
                    ) : isFollowing ? (
                      isHovering ? (
                        "Unfollow"
                      ) : (
                        "Following"
                      )
                    ) : (
                      "Follow"
                    )}
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <FollowersListDialog
        open={openDialog === "followers"}
        onClose={handleCloseDialog}
        userId={user._id}
        type="followers"
      />
      <FollowersListDialog
        open={openDialog === "following"}
        onClose={handleCloseDialog}
        userId={user._id}
        type="following"
      />
    </>
  );
}
