import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

interface LogoProps {
  size?: string;
  showText?: boolean;
}

const Logo = ({ size = "medium", showText = true }: LogoProps = {}) => {
  const logoHeight = size === "small" ? 30 : size === "large" ? 50 : 40;

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
    </Link>
  );
};

export default Logo;
