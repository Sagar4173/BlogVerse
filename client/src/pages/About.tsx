import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Avatar,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Code, DesignServices, Create, Group } from "@mui/icons-material";

const teamMembers = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    avatar: "/avatars/john.jpg",
    description: "Passionate about connecting writers and readers worldwide.",
  },
  {
    name: "Jane Smith",
    role: "Lead Developer",
    avatar: "/avatars/jane.jpg",
    description:
      "Full-stack developer with expertise in modern web technologies.",
  },
  {
    name: "Mike Johnson",
    role: "UI/UX Designer",
    avatar: "/avatars/mike.jpg",
    description: "Creating beautiful and intuitive user experiences.",
  },
];

const values = [
  {
    icon: <Create fontSize="large" />,
    title: "Creativity",
    description:
      "We believe in empowering writers to express their unique voices and share their stories with the world.",
  },
  {
    icon: <Group fontSize="large" />,
    title: "Community",
    description:
      "Building a supportive community where writers and readers can connect, learn, and grow together.",
  },
  {
    icon: <Code fontSize="large" />,
    title: "Innovation",
    description:
      "Constantly evolving our platform with cutting-edge technology to enhance the blogging experience.",
  },
  {
    icon: <DesignServices fontSize="large" />,
    title: "Design",
    description:
      "Crafting beautiful, intuitive interfaces that make writing and reading a joy.",
  },
];

function About() {
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
          About BlogVerse
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.6 }}
        >
          BlogVerse is a modern blogging platform designed to bring writers and
          readers together in a vibrant, supportive community. We believe that
          everyone has a story to tell, and we're here to help you share yours
          with the world.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7 }}>
              To democratize content creation and make high-quality blogging
              accessible to everyone. We're building more than just a platform –
              we're creating a space where ideas flourish, connections are made,
              and voices are amplified. Whether you're a seasoned writer or just
              starting your journey, BlogVerse provides the tools, community,
              and inspiration you need to succeed.
            </Typography>
          </Card>
        </motion.div>
      </Box>

      {/* Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
        >
          Our Values
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    borderRadius: 2,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
        >
          Meet Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      border: "4px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Box sx={{ textAlign: "center" }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          BlogVerse by the Numbers
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            { number: "10K+", label: "Active Writers" },
            { number: "50K+", label: "Published Posts" },
            { number: "100K+", label: "Monthly Readers" },
            { number: "25+", label: "Countries" },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {stat.number}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default About;
