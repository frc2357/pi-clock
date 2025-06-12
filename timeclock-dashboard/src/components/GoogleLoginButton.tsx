import { FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function GoogleLoginButton() {
  const { signIn } = useAuthActions();

  const handleLogin = () => {
    signIn("google").catch((error) =>
      console.error("Google login error:", error),
    );
  };

  return (
    <Button onClick={handleLogin}>
      <FaGoogle />
      Sign in with Google
    </Button>
  );
}
