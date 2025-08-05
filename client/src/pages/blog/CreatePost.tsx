import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createBlog, getBlog, updateBlog } from "../../services/blogService";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import axios from "axios";

const categories = [
  "Technology",
  "Design",
  "Development",
  "Business",
  "Lifestyle",
  "Science",
  "Food & Cooking",
  "Travel",
  "Health & Fitness",
  "Arts & Culture",
  "Education",
  "Environment",
];

const extractDirectImageUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Handle Brave search URLs
    if (urlObj.hostname === "imgs.search.brave.com") {
      // Extract the actual image URL from the encoded URL
      const encodedUrl = url.split("/g:ce/")[1];
      if (encodedUrl) {
        const decodedUrl = atob(encodedUrl);
        return decodedUrl;
      }
    }
    // Handle Pixabay and other image hosting services
    if (
      urlObj.hostname.includes("pixabay.com") ||
      urlObj.hostname.includes("cloudinary.com")
    ) {
      return url;
    }
    return url;
  } catch {
    return url;
  }
};

function CreatePost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    coverImage: "",
    isDraft: false,
  });
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    content: "",
    coverImage: "",
  });
  const [submitError, setSubmitError] = useState<string>("");
  const [wordCount, setWordCount] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "error" | null
  >(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeoutRef = useRef<number | null>(null);

  // Auto-save functionality
  const autoSaveDraft = useCallback(async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = window.setTimeout(async () => {
      try {
        setAutoSaveStatus("saving");
        const draftData = {
          ...formData,
          isDraft: true,
          status: "draft",
          publishedAt: null,
        };

        if (draftId) {
          await updateBlog(draftId, draftData);
        } else {
          const savedDraft = await createBlog(draftData);
          // Update URL to include draft ID without page refresh
          window.history.replaceState(null, "", `/write?id=${savedDraft._id}`);
        }

        setAutoSaveStatus("saved");
        setLastSaved(new Date());
      } catch (error) {
        setAutoSaveStatus("error");
        console.error("Auto-save failed:", error);
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
  }, [formData, draftId]);

  // Word count calculation
  const calculateWordCount = useCallback((content: string) => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);
  }, []);

  // Custom image handler for ReactQuill
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("image", file);

          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/upload/image`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            const quill = quillRef.current?.getEditor();
            const range = quill?.getSelection();
            quill?.insertEmbed(range?.index || 0, "image", response.data.url);
            toast.success("Image inserted successfully!");
          }
        } catch (error) {
          toast.error("Failed to upload image");
        }
      }
    };
  }, []);

  // Load draft data if editing an existing draft
  useEffect(() => {
    const loadDraft = async () => {
      if (draftId) {
        try {
          setIsLoading(true);
          const draftData = await getBlog(draftId);
          setFormData({
            title: draftData.title || "",
            category: draftData.category || "",
            content: draftData.content || "",
            coverImage: draftData.coverImage || "",
            isDraft: draftData.isDraft || false,
          });
        } catch (error: any) {
          console.error("Error loading draft:", error);
          toast.error("Failed to load draft");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDraft();
  }, [draftId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "coverImage") {
      const directUrl = extractDirectImageUrl(value);
      setFormData((prev) => ({
        ...prev,
        coverImage: directUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setErrors((prev) => ({ ...prev, coverImage: "" }));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          coverImage: response.data.url,
        }));
        setUploadedImagePublicId(response.data.public_id);
        toast.success("Image uploaded successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload image";
      setErrors((prev) => ({ ...prev, coverImage: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          coverImage: "Image must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          coverImage: "Please select an image file",
        }));
        return;
      }

      handleImageUpload(file);
    }
  };

  const handleRemoveImage = async () => {
    if (uploadedImagePublicId) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${
            import.meta.env.VITE_API_URL
          }/upload/image/${uploadedImagePublicId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }

    setFormData((prev) => ({ ...prev, coverImage: "" }));
    setUploadedImagePublicId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      category: "",
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
    setErrors((prev) => ({
      ...prev,
      content: "",
    }));

    // Calculate word count
    calculateWordCount(content);

    // Trigger auto-save
    if (content.trim() && formData.title.trim()) {
      autoSaveDraft();
    }
  };

  // Auto-save effect
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Initialize word count when content loads
  useEffect(() => {
    if (formData.content) {
      calculateWordCount(formData.content);
    }
  }, [formData.content, calculateWordCount]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      category: "",
      content: "",
      coverImage: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (
      !formData.content ||
      formData.content.replace(/<[^>]*>/g, "").trim().length < 50
    ) {
      newErrors.content = "Content must be at least 50 characters long";
      isValid = false;
    }

    // Only validate image URL if one is provided
    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = "Please enter a valid image URL or leave empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (url: string) => {
    try {
      // Fix: Using the URL object without actually needing to reference it
      new URL(url);
      // Check file extension with regex instead of relying on URL object
      return (
        /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url) ||
        /images\.unsplash\.com/i.test(url) ||
        /cloudinary\.com/i.test(url) ||
        /imgbb\.com/i.test(url) ||
        /pixabay\.com.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url) ||
        /imgs\.search\.brave\.com/i.test(url)
      );
    } catch {
      return false;
    }
  };

  const validateDraft = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      category: "",
      content: "",
      coverImage: "",
    };

    // Only validate title for drafts
    if (!formData.title.trim()) {
      newErrors.title = "Title is required even for drafts";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (validateForm()) {
      try {
        setIsSubmitting(true);
        const blogData = {
          ...formData,
          isDraft: false, // Explicitly set to false for publishing
        };

        if (draftId) {
          // Update existing draft/post
          const updatedBlog = await updateBlog(draftId, blogData);
          toast.success("Blog post updated and published successfully!");
          navigate(`/blog/${updatedBlog._id}`);
        } else {
          // Create new blog
          const newBlog = await createBlog(blogData);
          toast.success("Blog post published successfully!");
          navigate(`/blog/${newBlog._id}`);
        }
      } catch (error: any) {
        setSubmitError(
          error.response?.data?.message ||
            error.message ||
            "Failed to publish blog post"
        );
        toast.error("Failed to publish blog post");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const saveDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Add this to prevent event bubbling
    setSubmitError("");

    if (validateDraft()) {
      try {
        setIsSubmitting(true);
        const draftData = {
          ...formData,
          isDraft: true,
          status: "draft",
          publishedAt: null,
        };

        console.log("Saving draft:", draftData); // Add logging

        if (draftId) {
          // Update existing draft
          const updatedDraft = await updateBlog(draftId, draftData);
          toast.success("Draft updated successfully!");
          navigate("/dashboard", {
            state: {
              notification: "Draft updated successfully!",
              draftId: updatedDraft._id,
              isDraft: true,
            },
          });
        } else {
          // Create new draft
          const draftBlog = await createBlog(draftData);
          toast.success("Draft saved successfully!");
          navigate("/dashboard", {
            state: {
              notification: "Draft saved successfully!",
              draftId: draftBlog._id,
              isDraft: true,
            },
          });
        }
      } catch (error: any) {
        console.error("Draft save error:", error); // Add error logging
        setSubmitError("Failed to save draft. Please try again.");
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to save draft"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["link", "image", "video", "formula"],
        ["blockquote", "code-block"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
    "blockquote",
    "code-block",
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {draftId ? "Edit Blog Post" : "Create New Blog Post"}
        </Typography>

        {isLoading ? (
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading draft...
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            {submitError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {submitError}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Post Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleCategoryChange}
                  error={!!errors.category}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography color="error" variant="caption">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>

              {/* Cover Image Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Cover Image
                </Typography>

                {/* Image Upload Option */}
                <Box sx={{ mb: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    title="Upload cover image"
                    aria-label="Upload cover image"
                    hidden
                    id="image-upload-input"
                  />
                  <Button
                    variant="outlined"
                    startIcon={
                      isUploadingImage ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PhotoCamera />
                      )
                    }
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    sx={{ mr: 2 }}
                  >
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                  </Button>

                  {formData.coverImage && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleRemoveImage}
                      disabled={isUploadingImage}
                    >
                      Remove Image
                    </Button>
                  )}
                </Box>

                {/* URL Input Option */}
                <TextField
                  fullWidth
                  name="coverImage"
                  label="Or enter image URL"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  error={!!errors.coverImage}
                  helperText={
                    errors.coverImage ||
                    "Add a cover image to make your post more engaging"
                  }
                  variant="outlined"
                  disabled={isUploadingImage}
                />
              </Box>

              {formData.coverImage && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Image Preview:
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      position: "relative",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                      "& img": {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "opacity 0.3s ease",
                      },
                    }}
                  >
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      onLoad={() => {
                        // Clear any error when image loads successfully
                        setErrors((prev) => ({ ...prev, coverImage: "" }));
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.opacity = "0.5";
                        setErrors((prev) => ({
                          ...prev,
                          coverImage:
                            "Unable to load image. Please check the URL or try another image",
                        }));
                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f0f0f0'/%3E%3Ctext x='400' y='225' font-family='Arial' font-size='16' fill='%23666666' text-anchor='middle' dominant-baseline='middle'%3EUnable to load image%3C/text%3E%3C/svg%3E`;
                      }}
                      loading="lazy"
                    />
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Content</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Word Count */}
                    <Typography variant="caption" color="text.secondary">
                      {wordCount} words
                    </Typography>

                    {/* Auto-save Status */}
                    {autoSaveStatus && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {autoSaveStatus === "saving" && (
                          <>
                            <CircularProgress size={12} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Saving...
                            </Typography>
                          </>
                        )}
                        {autoSaveStatus === "saved" && (
                          <Typography variant="caption" color="success.main">
                            ✓ Auto-saved{" "}
                            {lastSaved &&
                              `at ${lastSaved.toLocaleTimeString()}`}
                          </Typography>
                        )}
                        {autoSaveStatus === "error" && (
                          <Typography variant="caption" color="error.main">
                            ⚠ Auto-save failed
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    "& .quill": {
                      height: "auto",
                      mb: 2,
                      "& .ql-container": {
                        minHeight: "350px",
                        maxHeight: "600px",
                        overflow: "auto",
                        fontSize: "16px",
                        lineHeight: 1.6,
                      },
                      "& .ql-editor": {
                        padding: "20px",
                      },
                      "& .ql-toolbar": {
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        border: "1px solid #e0e0e0",
                      },
                    },
                  }}
                >
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.content}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    preserveWhitespace
                    placeholder="Write your blog post content here... You can insert images directly by clicking the image button in the toolbar or paste image URLs."
                  />
                </Box>
                {errors.content && (
                  <Typography color="error" variant="caption">
                    {errors.content}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 6 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={saveDraft}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save as Draft"}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default CreatePost;
