import React from "react";
import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

interface PasswordCheck {
  label: string;
  test: (password: string) => boolean;
  passed: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showDetails = true,
}) => {
  const checks: PasswordCheck[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      passed: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
      passed: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
      passed: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      test: (pwd) => /\d/.test(pwd),
      passed: /\d/.test(password),
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const passedChecks = checks.filter((check) => check.passed).length;
  const totalChecks = checks.length;
  const strengthPercentage = (passedChecks / totalChecks) * 100;

  const getStrengthLevel = () => {
    if (passedChecks === 0) return { level: "None", color: "error" };
    if (passedChecks <= 2) return { level: "Weak", color: "error" };
    if (passedChecks <= 3) return { level: "Fair", color: "warning" };
    if (passedChecks <= 4) return { level: "Good", color: "info" };
    return { level: "Strong", color: "success" };
  };

  const strength = getStrengthLevel();
  const progressColor = strength.color as
    | "error"
    | "warning"
    | "info"
    | "success";

  if (!password) return null;

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      {/* Strength Indicator */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Password Strength:
        </Typography>
        <Chip
          label={strength.level}
          color={progressColor}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={strengthPercentage}
        color={progressColor}
        sx={{
          height: 6,
          borderRadius: 3,
          mb: showDetails ? 1 : 0,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      />

      {/* Detailed Requirements */}
      {showDetails && (
        <Box sx={{ mt: 1 }}>
          {checks.map((check, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              {check.passed ? (
                <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
              ) : (
                <Cancel sx={{ fontSize: 16, color: "error.main" }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: check.passed ? "success.main" : "text.secondary",
                  textDecoration: check.passed ? "none" : "none",
                }}
              >
                {check.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Security Tips */}
      {password.length > 0 && strengthPercentage < 80 && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: "warning.light",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="warning.dark">
            💡 Tip: Use a mix of letters, numbers, and symbols for better
            security
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrengthIndicator;
