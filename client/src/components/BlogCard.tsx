import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Article,
  Edit,
  Favorite,
  Comment,
  Share,
  Bookmark,
  Publish,
  Delete,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDateTime } from "../utils/dateUtils";
import { likeBlog, publishDraft, deleteBlog } from "../services/blogService";
import { bookmarkBlog } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { BlogPost } from "../types/User";

interface Props {
  post: BlogPost;
  isDraft?: boolean;
  onEdit?: () => void;
  onPublish?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

function BlogCard({ post, isDraft, onEdit, onPublish, onDelete }: Props) {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const hasUserLiked = post.likes?.some((like) => like.user === user?._id);
    if (hasUserLiked !== undefined) {
      setIsLiked(hasUserLiked);
    }
  }, [post.likes, user?._id]);

  const optimizeCloudinaryUrl = (url: string) => {
    if (url && url.includes("cloudinary.com")) {
      const imageUrl = new URL(url);
      // Use smaller size for card view
      const transformationString = "/c_fill,w_800,h_450,q_auto,f_auto";
      const pathParts = imageUrl.pathname.split("/");
      const uploadIndex = pathParts.indexOf("upload");
      if (uploadIndex !== -1) {
        pathParts.splice(uploadIndex + 1, 0, transformationString);
        imageUrl.pathname = pathParts.join("/");
        return imageUrl.toString();
      }
    }
    return url;
  };

  const hasValidImage =
    post.coverImage &&
    typeof post.coverImage === "string" &&
    post.coverImage.trim() !== "" &&
    !imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await likeBlog(post._id);
      setIsLiked(!isLiked);
      post.likesCount = response.likesCount;
      toast.success(response.liked ? "Post liked!" : "Post unliked");
    } catch (error: any) {
      toast.error(error.message || "Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to bookmark posts");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      await bookmarkBlog(post._id);
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to bookmark post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/blog/${post._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this post on BlogVerse: ${post.title}`,
          url: shareUrl,
        });
        toast.success("Post shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        handleFallbackShare(shareUrl);
      }
    } else {
      handleFallbackShare(shareUrl);
    }
  };

  const handleFallbackShare = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handlePublishDraft = async () => {
    try {
      setIsPublishing(true);
      await publishDraft(post._id);
      toast.success("Draft published successfully!");
      setShowPublishDialog(false);

      // Notify parent component about the publish action
      if (onPublish) {
        onPublish(post._id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish draft");
      console.error("Error publishing draft:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await deleteBlog(post._id);
      toast.success(`${isDraft ? "Draft" : "Post"} deleted successfully!`);
      setShowDeleteDialog(false);

      // Notify parent component about the delete action
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error: any) {
      toast.error(
        error.message || `Failed to delete ${isDraft ? "draft" : "post"}`
      );
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getLikesCount = () => post.likesCount || 0;
  const getCommentsCount = () => post.commentsCount || 0;
  const getUserName = () => post.user?.name || "Anonymous";
  const getUserId = () => post.user?._id || "";

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        backgroundColor: "background.paper",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}25`,
        },
      }}
    >
      {isDraft && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "warning.main",
            color: "warning.contrastText",
            px: 2,
            py: 0.5,
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            zIndex: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          Draft
        </Box>
      )}
      <CardActionArea
        component={Link}
        to={`/blog/${post._id}`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
          {hasValidImage ? (
            <CardMedia
              component="img"
              image={optimizeCloudinaryUrl(post.coverImage!)}
              alt={post.title}
              onError={handleImageError}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.5s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              loading="lazy"
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Article
                sx={{
                  fontSize: 64,
                  color: "primary.main",
                  opacity: 0.5,
                  transition: "all 0.3s ease-in-out",
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
              transition: "opacity 0.3s ease-in-out",
              opacity: 0,
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              {post.category}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.4,
              minHeight: "2.8em",
              mb: 1,
            }}
          >
            {post.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              By {getUserName()}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {formatDateTime(post.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          py: 1,
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            onClick={handleLike}
            disabled={isLoading || !getUserId()}
            sx={{
              color: isLiked ? "error.main" : "action.active",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
                color: "error.main",
                bgcolor: "error.light",
              },
            }}
          >
            <Favorite
              sx={{
                transform: isLiked ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.2s ease-in-out",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                ml: 0.5,
                color: isLiked ? "error.main" : "text.secondary",
              }}
            >
              {getLikesCount()}
            </Typography>
          </IconButton>

          <IconButton
            component={Link}
            to={`/blog/${post._id}#comments`}
            sx={{
              "&:hover": {
                transform: "scale(1.1)",
                color: "primary.main",
                bgcolor: "primary.light",
              },
            }}
          >
            <Comment />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {getCommentsCount()}
            </Typography>
          </IconButton>

          <IconButton
            onClick={handleShare}
            sx={{
              "&:hover": {
                transform: "scale(1.1)",
                color: "secondary.main",
                bgcolor: "secondary.light",
              },
            }}
          >
            <Share />
          </IconButton>
        </Box>

        <IconButton
          onClick={handleBookmark}
          disabled={isLoading}
          sx={{
            color: isBookmarked ? "primary.main" : "action.active",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
              color: "primary.main",
              bgcolor: "primary.light",
            },
          }}
        >
          <Bookmark
            sx={{
              transform: isBookmarked ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </IconButton>
      </CardActions>

      {/* Delete button for user's own published posts */}
      {!isDraft && user && post.user && post.user._id === user._id && (
        <CardActions sx={{ p: 1, pt: 0, justifyContent: "flex-end" }}>
          <Button
            size="small"
            onClick={() => setShowDeleteDialog(true)}
            startIcon={<Delete />}
            variant="outlined"
            color="error"
            sx={{
              fontSize: "0.75rem",
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            Delete Post
          </Button>
        </CardActions>
      )}

      {isDraft && (
        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
          {onEdit && (
            <Button
              size="small"
              onClick={onEdit}
              startIcon={<Edit />}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              Continue Editing
            </Button>
          )}
          <Button
            size="small"
            onClick={() => setShowPublishDialog(true)}
            startIcon={<Publish />}
            variant="contained"
            color="success"
            sx={{
              "&:hover": {
                backgroundColor: "success.dark",
              },
            }}
          >
            Publish Draft
          </Button>
          <Button
            size="small"
            onClick={() => setShowDeleteDialog(true)}
            startIcon={<Delete />}
            variant="outlined"
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            Delete
          </Button>
        </CardActions>
      )}

      {/* Publish Confirmation Dialog */}
      <Dialog
        open={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Publish Draft</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to publish "{post.title}"? This will make it
            visible to all users and it will appear in the published posts
            section.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowPublishDialog(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublishDraft}
            variant="contained"
            color="success"
            disabled={isPublishing}
            startIcon={
              isPublishing ? <CircularProgress size={16} /> : <Publish />
            }
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "error.main" }}>
          Delete {isDraft ? "Draft" : "Post"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{post.title}"? This action cannot
            be undone.
            {!isDraft &&
              " The post will be permanently removed and will no longer be visible to users."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            variant="contained"
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default BlogCard;
