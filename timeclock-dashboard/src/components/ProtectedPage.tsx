import { useConvexAuth } from "convex/react";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return children;
}
