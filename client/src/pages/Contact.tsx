import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Send,
  GitHub,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const contactInfo = [
  {
    icon: <Email />,
    title: "Email",
    info: "hello@blogverse.com",
    description: "Send us an email and we'll respond within 24 hours",
  },
  {
    icon: <Phone />,
    title: "Phone",
    info: "+1 (555) 123-4567",
    description: "Call us during business hours (9 AM - 6 PM EST)",
  },
  {
    icon: <LocationOn />,
    title: "Address",
    info: "123 Blog Street, Writing City, WC 12345",
    description: "Visit our office for in-person meetings",
  },
];

const socialLinks = [
  { icon: <GitHub />, name: "GitHub", url: "https://github.com/blogverse" },
  {
    icon: <LinkedIn />,
    name: "LinkedIn",
    url: "https://linkedin.com/company/blogverse",
  },
  { icon: <Twitter />, name: "Twitter", url: "https://twitter.com/blogverse" },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #024950 30%, #0FA4AF 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
          Get in Touch
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
        >
          Have a question, suggestion, or just want to say hello? We'd love to
          hear from you. Reach out to us using any of the methods below.
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Send us a Message
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="subject"
                      label="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="message"
                      label="Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      disabled={isSubmitting}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </motion.div>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Contact Information
              </Typography>
              {contactInfo.map((info, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        color: "primary.main",
                        mt: 0.5,
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {info.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, mb: 1 }}
                      >
                        {info.info}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Social Links */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={social.icon}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {social.name}
                  </Button>
                ))}
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Divider sx={{ mb: 4 }} />
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}
        >
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              question: "How do I start a blog on BlogVerse?",
              answer:
                'Simply create an account, complete your profile, and click the "Write" button to create your first post!',
            },
            {
              question: "Is BlogVerse free to use?",
              answer:
                "Yes! BlogVerse is completely free for all users. We believe in making blogging accessible to everyone.",
            },
            {
              question: "Can I monetize my blog?",
              answer:
                "We're working on monetization features. Stay tuned for updates on our premium features and partnership programs.",
            },
            {
              question: "How do I get more readers?",
              answer:
                "Engage with the community, use relevant tags, share quality content regularly, and interact with other bloggers.",
            },
          ].map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 3, h: "100%", borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Contact;
