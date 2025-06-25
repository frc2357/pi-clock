import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  const { signOut } = useAuthActions();

  useEffect(() => {
    void signOut();
  }, []);

  return null;
}
