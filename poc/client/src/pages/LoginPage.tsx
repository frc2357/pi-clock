import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabaseClient";
import { Box, Button, Container, Paper, Typography } from "@mui/material";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Login error:", error.message);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, textAlign: "center", width: "100%" }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
