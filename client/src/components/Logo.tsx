import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

interface LogoProps {
  size?: string;
  showText?: boolean;
  asChild?: boolean; // Add this prop to control whether to wrap in Link
}

const Logo = ({
  size = "medium",
  showText = true,
  asChild = false,
}: LogoProps = {}) => {
  const logoHeight = size === "small" ? 30 : size === "large" ? 50 : 40;

  const logoContent = (
    <>
      <Box
        component="img"
        src="/blogverse-logo.svg"
        alt="BlogVerse Logo"
        sx={{ height: logoHeight, mr: showText ? 1 : 0 }}
      />
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            letterSpacing: ".1rem",
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
      }}
    >
      {logoContent}
    </Link>
  );
};

export default Logo;
