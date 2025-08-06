import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    navigate("/search");
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          minHeight: "60vh",
          justifyContent: "center",
        }}
      >
        {/* Large 404 Number */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "8rem", md: "12rem" },
            fontWeight: 900,
            color: theme.palette.primary.main,
            lineHeight: 0.8,
            mb: 2,
            textShadow: `0 4px 8px ${theme.palette.primary.main}20`,
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", md: "2.5rem" },
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or you entered the wrong URL. Don't worry, let's
          get you back on track!
        </Typography>

        {/* Action Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            width: "100%",
            maxWidth: "800px",
            mb: 4,
          }}
        >
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
            onClick={handleGoHome}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <HomeIcon
                sx={{
                  fontSize: "3rem",
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Go Home
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Return to the homepage and explore our latest content
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
            onClick={handleSearch}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <SearchIcon
                sx={{
                  fontSize: "3rem",
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Search
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find what you're looking for with our search feature
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
            onClick={handleGoBack}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <ArrowBackIcon
                sx={{
                  fontSize: "3rem",
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Go Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Return to the previous page you were visiting
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleGoHome}
            startIcon={<HomeIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.1rem",
              minWidth: "200px",
            }}
          >
            Back to Home
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.1rem",
              minWidth: "200px",
            }}
          >
            Search BlogVerse
          </Button>
        </Box>

        {/* Additional Help Text */}
        <Typography
          variant="body2"
          sx={{
            mt: 4,
            color: theme.palette.text.secondary,
            fontStyle: "italic",
          }}
        >
          If you believe this is an error, please{" "}
          <Button
            component="span"
            variant="text"
            size="small"
            onClick={() => navigate("/contact")}
            sx={{
              textTransform: "none",
              textDecoration: "underline",
              p: 0,
              minWidth: "auto",
              fontSize: "inherit",
            }}
          >
            contact us
          </Button>
          .
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
