import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Email, CheckCircle, Refresh } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendOTP } = useAuth();

  // Get email from location state or localStorage
  const email =
    location.state?.email || localStorage.getItem("verificationEmail");

  useEffect(() => {
    if (!email) {
      navigate("/auth/register");
      return;
    }

    // Store email in localStorage for page refreshes
    localStorage.setItem("verificationEmail", email);
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await verifyEmail(email, otp);

      if (data.success) {
        setSuccess("Email verified successfully! Redirecting...");

        // Clear verification email from localStorage
        localStorage.removeItem("verificationEmail");

        // Redirect to dashboard (user is already logged in via AuthContext)
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError("");

    try {
      await resendOTP(email);
      setSuccess("Verification code resent! Please check your email.");
      setCountdown(60); // 60 second cooldown
      setOtp(""); // Clear current OTP
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setError(
        error.message || "Failed to resend verification code. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError(""); // Clear error when user types
    }
  };

  if (!email) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box textAlign="center" mb={3}>
            <Email sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Verify Your Email
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We've sent a 6-digit verification code to:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {email}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              Please check your email and enter the verification code below to
              complete your account setup.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleVerifyOTP}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Verification Code"
                  value={otp}
                  onChange={handleOTPChange}
                  placeholder="Enter 6-digit code"
                  variant="outlined"
                  inputProps={{
                    maxLength: 6,
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      letterSpacing: "0.5rem",
                    },
                  }}
                  disabled={loading}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || otp.length !== 6}
                  sx={{ mt: 2, mb: 2 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Didn't receive the code?
            </Typography>
            <Button
              variant="text"
              onClick={handleResendOTP}
              disabled={resending || countdown > 0}
              startIcon={
                resending ? <CircularProgress size={16} /> : <Refresh />
              }
            >
              {countdown > 0
                ? `Resend in ${countdown}s`
                : resending
                ? "Sending..."
                : "Resend Code"}
            </Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Button
              variant="text"
              onClick={() => {
                localStorage.removeItem("verificationEmail");
                navigate("/auth/register");
              }}
              color="secondary"
            >
              Back to Registration
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;
