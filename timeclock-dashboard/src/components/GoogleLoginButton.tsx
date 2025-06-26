import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { useAuthActions } from "@convex-dev/auth/react";

export default function GoogleLoginButton() {
  const { signIn } = useAuthActions();

  const handleLogin = () => {
    signIn("google").catch((error: undefined) => {
      console.error("Google login error:", error);
    });
  };

  return (
    <Button variant="contained" onClick={handleLogin}>
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
