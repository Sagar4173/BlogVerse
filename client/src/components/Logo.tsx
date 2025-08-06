import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  asChild?: boolean;
  variant?: "default" | "simple"; // Add variant prop
}

const Logo = ({
  size = "medium",
  showText = true,
  asChild = false,
  variant = "default",
}: LogoProps = {}) => {
  const logoHeight = size === "small" ? 28 : size === "large" ? 48 : 40;
  const logoSrc =
    size === "small" || variant === "simple"
      ? "/blogverse-logo-simple.svg"
      : "/blogverse-logo.svg";

  const logoContent = (
    <>
      <Box
        component="img"
        src={logoSrc}
        alt="BlogVerse Logo"
        sx={{
          height: logoHeight,
          mr: showText ? 1.5 : 0,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      {showText && (
        <Typography
          variant={size === "large" ? "h5" : size === "small" ? "body1" : "h6"}
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #0FA4AF 30%, #024950 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: size === "large" ? ".15rem" : ".1rem",
            fontSize:
              size === "large"
                ? "1.5rem"
                : size === "small"
                ? "1rem"
                : "1.25rem",
          }}
        >
          BlogVerse
        </Typography>
      )}
    </>
  );

  // If asChild is true, just return the content without Link wrapper
  if (asChild) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {logoContent}
      </Box>
    );
  }

  // Default behavior: wrap in Link
  return (
    <Link
      component={RouterLink}
      to="/"
      sx={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        transition: "opacity 0.3s ease",
        "&:hover": {
          opacity: 0.8,
        },
      }}
    >
      {logoContent}
    </Link>
  );
};

export default Logo;
