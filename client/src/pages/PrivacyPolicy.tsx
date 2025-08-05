import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";

function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #024950 30%, #0FA4AF 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Privacy Policy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ "& > *": { mb: 3 } }}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Introduction
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Welcome to BlogVerse. We respect your privacy and are committed
                to protecting your personal data. This privacy policy explains
                how we collect, use, and safeguard your information when you use
                our blogging platform.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Information We Collect
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 500, mt: 2 }}
              >
                Personal Information
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                When you create an account, we collect:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>Name and email address</li>
                <li>
                  Profile information (bio, profile picture, social links)
                </li>
                <li>Blog posts and comments you create</li>
                <li>Interaction data (likes, follows, bookmarks)</li>
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 500, mt: 3 }}
              >
                Automatically Collected Information
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and preferences</li>
                <li>Cookies and similar tracking technologies</li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                How We Use Your Information
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                We use your information to:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>Provide and maintain our blogging platform</li>
                <li>Enable user interactions and social features</li>
                <li>Send notifications about your account activity</li>
                <li>Improve our services and user experience</li>
                <li>Prevent spam and abuse</li>
                <li>Comply with legal obligations</li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Information Sharing
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                We do not sell your personal information. We may share your
                information in these situations:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>
                  Public content you choose to publish (blog posts, comments,
                  profile)
                </li>
                <li>
                  With service providers who assist in operating our platform
                </li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Data Security
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. This includes encryption, secure
                servers, and regular security assessments.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Your Rights
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                You have the right to:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Control your privacy settings</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data</li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Cookies
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                We use cookies to enhance your experience, remember your
                preferences, and analyze site usage. You can control cookie
                settings through your browser, though some features may not work
                properly if cookies are disabled.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Third-Party Services
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Our platform may contain links to third-party websites or
                integrate with external services. We are not responsible for the
                privacy practices of these third parties. Please review their
                privacy policies separately.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Children's Privacy
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                BlogVerse is not intended for users under 13 years of age. We do
                not knowingly collect personal information from children under
                13. If we become aware of such collection, we will delete the
                information promptly.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Changes to This Policy
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date. Continued use of our
                platform constitutes acceptance of the updated policy.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Us
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                If you have any questions about this privacy policy or our data
                practices, please contact us at:
                <br />
                <br />
                Email: privacy@blogverse.com
                <br />
                Address: 123 Blog Street, Writing City, WC 12345
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}

export default PrivacyPolicy;
