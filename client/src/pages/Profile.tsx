import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Paper,
  Grid,
  Chip,
  Divider,
  useTheme,
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Edit as EditIcon,
  PhotoCamera,
  Article,
  Group,
  PersonAdd,
  Language,
  Link as LinkIcon,
  CalendarMonth,
  Email,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth"; // Updated import path
import { toast } from "react-toastify";
import { updateProfile } from "../api/profile";
import FollowersListDialog from "../components/FollowersListDialog";
import { alpha } from "@mui/material/styles";

interface SocialLinkItem {
  platform: string;
  url: string;
  icon: JSX.Element;
  pattern: string;
  placeholder: string;
  label: string;
  isValid?: boolean;
}

const validateSocialUrl = (url: string, pattern: string): boolean => {
  if (!url) return true;
  try {
    // Add https:// if no protocol is specified
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const regex = new RegExp(pattern);
    return regex.test(urlWithProtocol);
  } catch {
    return false;
  }
};

function Profile() {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "/default-avatar.png",
    socialLinks: [
      {
        platform: "Website",
        url: user?.socialLinks?.website || "",
        icon: <Language />,
        pattern:
          "^(https?://)?(([\\w-]+\\.)+[\\w-]{2,}|localhost)(:\\d+)?(/.*)?$",
        placeholder: "example.com or sub.example.com",
        label: "Personal Website",
      } as SocialLinkItem,
      {
        platform: "Facebook",
        url: user?.socialLinks?.facebook || "",
        icon: <Facebook />,
        pattern: "^(https?://)?(www\\.)?facebook\\.com/.*$",
        placeholder: "https://facebook.com/yourprofile",
        label: "Facebook Profile",
      } as SocialLinkItem,
      {
        platform: "Twitter",
        url: user?.socialLinks?.twitter || "",
        icon: <Twitter />,
        pattern: "^(https?://)?(www\\.)?twitter\\.com/.*$",
        placeholder: "https://twitter.com/yourhandle",
        label: "Twitter Handle",
      } as SocialLinkItem,
      {
        platform: "LinkedIn",
        url: user?.socialLinks?.linkedin || "",
        icon: <LinkedIn />,
        pattern: "^(https?://)?(www\\.)?linkedin\\.com/.*$",
        placeholder: "https://linkedin.com/in/yourprofile",
        label: "LinkedIn Profile",
      } as SocialLinkItem,
      {
        platform: "Instagram",
        url: user?.socialLinks?.instagram || "",
        icon: <Instagram />,
        pattern: "^(https?://)?(www\\.)?instagram\\.com/.*$",
        placeholder: "https://instagram.com/yourhandle",
        label: "Instagram Handle",
      } as SocialLinkItem,
    ] as SocialLinkItem[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [openDialog, setOpenDialog] = useState<
    "followers" | "following" | null
  >(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Initialize profile data when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "/default-avatar.png",
        socialLinks: [
          {
            platform: "Website",
            url: user.socialLinks?.website || "",
            icon: <Language />,
            pattern:
              "^(https?://)?(([\\w-]+\\.)+[\\w-]{2,}|localhost)(:\\d+)?(/.*)?$",
            placeholder: "example.com or sub.example.com",
            label: "Personal Website",
          } as SocialLinkItem,
          {
            platform: "Facebook",
            url: user.socialLinks?.facebook || "",
            icon: <Facebook />,
            pattern: "^(https?://)?(www\\.)?facebook\\.com/.*$",
            placeholder: "https://facebook.com/yourprofile",
            label: "Facebook Profile",
          } as SocialLinkItem,
          {
            platform: "Twitter",
            url: user.socialLinks?.twitter || "",
            icon: <Twitter />,
            pattern: "^(https?://)?(www\\.)?twitter\\.com/.*$",
            placeholder: "https://twitter.com/yourhandle",
            label: "Twitter Handle",
          } as SocialLinkItem,
          {
            platform: "LinkedIn",
            url: user.socialLinks?.linkedin || "",
            icon: <LinkedIn />,
            pattern: "^(https?://)?(www\\.)?linkedin\\.com/.*$",
            placeholder: "https://linkedin.com/in/yourprofile",
            label: "LinkedIn Profile",
          } as SocialLinkItem,
          {
            platform: "Instagram",
            url: user.socialLinks?.instagram || "",
            icon: <Instagram />,
            pattern: "^(https?://)?(www\\.)?instagram\\.com/.*$",
            placeholder: "https://instagram.com/yourhandle",
            label: "Instagram Handle",
          } as SocialLinkItem,
        ] as SocialLinkItem[],
      });
    }
  }, [user]);

  const handleDialogClose = () => {
    setOpenDialog(null);
  };

  const handleStatsClick = (type: "followers" | "following") => {
    setOpenDialog(type);
  };

  const stats = [
    {
      label: "Posts",
      value: user?.postsCount || 0,
      icon: <Article sx={{ color: "primary.main", fontSize: 32 }} />,
    },
    {
      label: "Followers",
      value: user?.followers?.length || 0,
      icon: <Group sx={{ color: "primary.main", fontSize: 32 }} />,
      onClick: () => handleStatsClick("followers"),
    },
    {
      label: "Following",
      value: user?.following?.length || 0,
      icon: <PersonAdd sx={{ color: "primary.main", fontSize: 32 }} />,
      onClick: () => handleStatsClick("following"),
    },
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileData((prevData) => ({
        ...prevData,
        profilePicture: previewUrl,
      }));
      // Store file for upload
      setProfilePicture(file);
    }
  };

  const handleSocialLinkChange = (platform: string, newUrl: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      socialLinks: prevData.socialLinks.map((link: SocialLinkItem) =>
        link.platform === platform
          ? {
              ...link,
              url: newUrl.trim(),
              isValid: validateSocialUrl(newUrl.trim(), link.pattern),
            }
          : link
      ),
    }));
  };

  const handleSave = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setSaveError("");

      if (profileData.bio && profileData.bio.length > 500) {
        throw new Error("Bio cannot exceed 500 characters");
      }

      // Transform social links - initialize as a proper Record type with known keys
      const socialLinks: Record<string, string> = {};

      for (const link of profileData.socialLinks) {
        if (link.url) {
          // Add https:// if no protocol is specified
          const urlWithProtocol = link.url.match(/^https?:\/\//)
            ? link.url
            : `https://${link.url}`;

          if (!validateSocialUrl(urlWithProtocol, link.pattern)) {
            throw new Error(`Invalid ${link.platform} URL`);
          }

          // Convert platform to lowercase for use as key
          const platformKey = link.platform.toLowerCase();
          socialLinks[platformKey] = urlWithProtocol;
        }
      }

      const updateData = {
        bio: profileData.bio,
        socialLinks,
        profilePicture: profilePicture || undefined,
      };

      console.log("Sending update data:", updateData);
      const response = await updateProfile(updateData);

      if (response.success) {
        // Clean up preview URL
        if (profilePicture) {
          URL.revokeObjectURL(profileData.profilePicture);
        }
        updateUser(response.user);
        setIsEditing(false);
        setProfilePicture(null);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to update profile. Please try again.";
      setSaveError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = (url: string, platform: string) => {
    if (!url) return;

    try {
      // Ensure URL has protocol
      const finalUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      window.open(finalUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(`Failed to open ${platform} link. Please check the URL.`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Main Profile Paper */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${
            theme.palette.background.paper
          } 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Profile
          </Typography>
          <Button
            startIcon={isEditing ? null : <EditIcon />}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant={isEditing ? "contained" : "outlined"}
            disabled={isLoading}
            size="large"
            sx={{
              minWidth: 150,
              height: 48,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
              ...(isEditing && {
                background: "linear-gradient(45deg, #024950 30%, #0FA4AF 90%)",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #013137 30%, #0C8A96 90%)",
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 16px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
              }),
              ...(!isEditing && {
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: "translateY(-2px)",
                },
              }),
              transition: "all 0.2s ease-in-out",
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Edit Profile"
            )}
          </Button>
        </Box>
        <Box sx={{ position: "relative", mb: 5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box sx={{ position: "relative", alignSelf: "center" }}>
              <Avatar
                src={profileData.profilePicture}
                sx={{
                  width: 150,
                  height: 150,
                  border: `4px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 8px 24px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": isEditing
                    ? {
                        transform: "scale(1.05)",
                        boxShadow: `0 12px 32px ${alpha(
                          theme.palette.primary.main,
                          0.3
                        )}`,
                      }
                    : {},
                }}
              />
              {isEditing && (
                <>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: -5,
                      backgroundColor: theme.palette.background.paper,
                      border: `3px solid ${theme.palette.primary.main}`,
                      width: 50,
                      height: 50,
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <PhotoCamera sx={{ fontSize: 24 }} />
                  </IconButton>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      position: "absolute",
                      bottom: -25,
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Click to change photo
                  </Typography>
                </>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Typography variant="h4" component="h1">
                  {profileData.name || "Loading..."}
                </Typography>
                <Chip
                  label={user?.role || "User"}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Stack>

              <Box sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  spacing={1}
                  alignItems="center"
                >
                  <Chip
                    label={user?.email}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    icon={<Email sx={{ fontSize: 16 }} />}
                  />
                  {user?.createdAt && (
                    <Chip
                      label={`Joined ${new Date(
                        user.createdAt
                      ).toLocaleDateString()}`}
                      color="default"
                      variant="outlined"
                      size="small"
                      icon={<CalendarMonth sx={{ fontSize: 16 }} />}
                    />
                  )}
                </Stack>
              </Box>

              {/* User bio preview in profile header */}
              {profileData.bio && !isEditing && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontStyle: "italic",
                    maxWidth: "500px",
                    lineHeight: 1.6,
                  }}
                >
                  "{profileData.bio}"
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        {/* Enhanced Stats Display */}
        <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                elevation={0}
                onClick={stat.onClick}
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease-in-out",
                  cursor: stat.onClick ? "pointer" : "default",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: stat.onClick
                      ? "translateY(-8px)"
                      : "translateY(-2px)",
                    boxShadow: stat.onClick
                      ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`
                      : `0 4px 15px ${alpha(theme.palette.primary.main, 0.15)}`,
                    "& .stat-icon": {
                      transform: "scale(1.1)",
                    },
                    "& .stat-value": {
                      color: "primary.main",
                    },
                  },
                  "&::before": stat.onClick
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(90deg, transparent, ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}, transparent)`,
                        transition: "left 0.5s ease-in-out",
                      }
                    : {},
                  "&:hover::before": stat.onClick
                    ? {
                        left: "100%",
                      }
                    : {},
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Box
                    className="stat-icon"
                    sx={{
                      transition: "transform 0.3s ease-in-out",
                      display: "inline-block",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  className="stat-value"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    transition: "color 0.3s ease-in-out",
                    color: "primary.dark",
                  }}
                >
                  {stat.value.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {stat.label}
                </Typography>
                {stat.onClick && (
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{
                      mt: 1,
                      display: "block",
                      fontWeight: 500,
                      opacity: 0.8,
                    }}
                  >
                    Click to view
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            About Me
          </Typography>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData((prevData) => ({
                    ...prevData,
                    bio: e.target.value,
                  }))
                }
                placeholder="Write something about yourself..."
                variant="outlined"
                error={
                  !!(
                    saveError ||
                    (profileData.bio && profileData.bio.length > 500)
                  )
                }
                helperText={
                  saveError ||
                  (profileData.bio && profileData.bio.length > 500
                    ? "Bio cannot exceed 500 characters"
                    : `${profileData.bio.length}/500 characters`)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          profileData.bio && profileData.bio.length > 500
                            ? "error.main"
                            : "primary.main",
                      },
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Card
              sx={{
                p: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                minHeight: "120px",
                display: "flex",
                alignItems: profileData.bio ? "flex-start" : "center",
                justifyContent: profileData.bio ? "flex-start" : "center",
              }}
            >
              <Typography
                variant="body1"
                color={profileData.bio ? "text.primary" : "text.secondary"}
                sx={{
                  lineHeight: 1.7,
                  fontStyle: profileData.bio ? "normal" : "italic",
                  textAlign: profileData.bio ? "left" : "center",
                }}
              >
                {profileData.bio ||
                  "No bio added yet. Click 'Edit Profile' to add information about yourself."}
              </Typography>
            </Card>
          )}
        </Box>
        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Social Links
          </Typography>
          <Grid container spacing={3}>
            {profileData.socialLinks.map((link) => (
              <Grid item xs={12} sm={6} key={link.platform}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label={link.label || link.platform}
                    value={link.url}
                    onChange={(e) =>
                      handleSocialLinkChange(link.platform, e.target.value)
                    }
                    placeholder={link.placeholder}
                    error={
                      !!link.url && !validateSocialUrl(link.url, link.pattern)
                    }
                    helperText={
                      link.url && !validateSocialUrl(link.url, link.pattern)
                        ? `Please enter a valid ${link.platform} URL`
                        : `Enter your ${link.platform} profile URL`
                    }
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            mr: 1,
                            color: link.url ? "primary.main" : "text.secondary",
                          }}
                        >
                          {link.icon}
                        </Box>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              link.url &&
                              validateSocialUrl(link.url, link.pattern)
                                ? "success.main"
                                : undefined,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <Card
                    sx={{
                      cursor: link.url ? "pointer" : "default",
                      opacity: link.url ? 1 : 0.6,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: link.url ? "translateY(-2px)" : "none",
                        boxShadow: link.url
                          ? `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : "none",
                      },
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      backgroundColor: link.url
                        ? alpha(theme.palette.primary.main, 0.05)
                        : alpha(theme.palette.action.disabled, 0.05),
                    }}
                    onClick={() =>
                      link.url && handleLinkClick(link.url, link.platform)
                    }
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            color: link.url ? "primary.main" : "text.secondary",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {link.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {link.platform}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {link.url || `Add your ${link.platform} profile`}
                          </Typography>
                        </Box>
                        {link.url && (
                          <LinkIcon
                            sx={{
                              color: "primary.main",
                              fontSize: 18,
                              opacity: 0.7,
                            }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Additional Profile Information Card */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        elevation={2}
        sx={{
          mt: 3,
          p: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Account Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Email sx={{ color: "primary.main", fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CalendarMonth sx={{ color: "primary.main", fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <FollowersListDialog
        type={openDialog || "followers"}
        userId={user?._id || ""}
        onClose={handleDialogClose}
        open={!!openDialog}
      />
    </Container>
  );
}

export default Profile;
