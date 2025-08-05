import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Email, VerifiedUser, Refresh } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendOTP, clearError } = useAuth();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    clearError();

    try {
      const result = await verifyEmail(email, otpCode);

      if (result.success) {
        setSuccess("Email verified successfully!");
        toast.success("Email verified! Welcome to BlogVerse!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Verification failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    clearError();

    try {
      await resendOTP(email);
      toast.success("New verification code sent to your email!");
      setTimeLeft(600); // Reset timer
      setOtp(["", "", "", "", "", ""]); // Clear current OTP
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to resend code. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    const maskedLocal =
      local.length > 2
        ? local[0] + "*".repeat(local.length - 2) + local[local.length - 1]
        : local;
    return `${maskedLocal}@${domain}`;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Box sx={{ mb: 3 }}>
              <Email sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Verify Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We've sent a 6-digit verification code to
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary">
                {maskEmail(email)}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <form onSubmit={handleVerify}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  sx={{ mb: 2 }}
                  icon={<VerifiedUser />}
                >
                  {success}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Enter verification code
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    mb: 2,
                  }}
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                        },
                      }}
                      sx={{
                        width: 56,
                        "& .MuiOutlinedInput-root": {
                          height: 56,
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Code expires in: <strong>{formatTime(timeLeft)}</strong>
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || otp.join("").length !== 6}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify Email"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Didn't receive the code?
                </Typography>

                <Button
                  variant="text"
                  onClick={handleResendOtp}
                  disabled={resendLoading || timeLeft > 540} // Allow resend after 1 minute
                  startIcon={
                    resendLoading ? <CircularProgress size={16} /> : <Refresh />
                  }
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </Button>

                {timeLeft > 540 && (
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    Available in {formatTime(600 - timeLeft)}
                  </Typography>
                )}
              </Box>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Wrong email address?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate("/register")}
                >
                  Change Email
                </Button>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
