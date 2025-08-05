import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";

function TermsOfService() {
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
            Terms of Service
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ "& > *": { mb: 3 } }}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                By accessing and using BlogVerse, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                2. Use License
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                Permission is granted to temporarily access BlogVerse for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license you may not:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  attempt to reverse engineer any software contained on
                  BlogVerse
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                3. User Accounts
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. You are
                responsible for:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>Safeguarding your password and account information</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your email address is valid and accessible</li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                4. Content Guidelines
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 500, mt: 2 }}
              >
                Acceptable Use
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                You may use BlogVerse to create, share, and discover content.
                You agree that your content will:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>Be respectful and civil</li>
                <li>Not infringe on others' intellectual property rights</li>
                <li>Be factual and not deliberately misleading</li>
                <li>Comply with applicable laws and regulations</li>
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 500, mt: 3 }}
              >
                Prohibited Content
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                The following types of content are not allowed:
              </Typography>
              <Box component="ul" sx={{ pl: 3, "& li": { mb: 1 } }}>
                <li>Hate speech, harassment, or bullying</li>
                <li>Spam, malware, or malicious links</li>
                <li>Adult content or sexually explicit material</li>
                <li>Violence, illegal activities, or harmful behavior</li>
                <li>Copyright infringement or plagiarism</li>
                <li>Personal information of others without consent</li>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                5. Intellectual Property
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                You retain ownership of content you create and post on
                BlogVerse. By posting content, you grant us a non-exclusive,
                worldwide, royalty-free license to use, modify, publicly
                perform, publicly display, reproduce, and distribute such
                content on BlogVerse. This license exists only for the purpose
                of operating and improving BlogVerse.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                6. Privacy Policy
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of BlogVerse, to understand
                our practices regarding the collection and use of your
                information.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                7. Termination
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                We may terminate or suspend your account and access to BlogVerse
                immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the
                Terms. Upon termination, your right to use BlogVerse will cease
                immediately.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                8. Disclaimer
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                The information on BlogVerse is provided on an 'as is' basis. To
                the fullest extent permitted by law, BlogVerse excludes all
                representations, warranties, conditions and terms whether
                express or implied. BlogVerse shall have no liability for any
                loss or damage arising from use of this website.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                9. Limitation of Liability
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                In no event shall BlogVerse or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use BlogVerse, even if BlogVerse or a
                representative has been notified orally or in writing of the
                possibility of such damage.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                10. Governing Law
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                These terms and conditions are governed by and construed in
                accordance with the laws of [Your Jurisdiction] and you
                irrevocably submit to the exclusive jurisdiction of the courts
                in that state or location.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                11. Changes to Terms
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                BlogVerse reserves the right to revise these terms of service at
                any time without notice. By using BlogVerse, you are agreeing to
                be bound by the then current version of these terms of service.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                12. Contact Information
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                If you have any questions about these Terms of Service, please
                contact us at:
                <br />
                <br />
                Email: legal@blogverse.com
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

export default TermsOfService;
