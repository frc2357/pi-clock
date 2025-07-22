import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LoginPage() {
    const loggedInUser = useQuery(api.auth.currentUser);
    const navigate = useNavigate();
    const { signIn } = useAuthActions();

    useEffect(() => {
        if (loggedInUser) {
            navigate("/");
        }
    }, [loggedInUser, navigate]);

    const handleLogin = (method: string) => {
        signIn(method).catch((error: undefined) => {
            console.error(`${method} login error:`, error);
        });
    };

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    width: 400,
                    height: 150,
                    borderRadius: 4,
                }}
            >
                <Button
                    sx={{ width: 250 }}
                    variant="contained"
                    onClick={() => handleLogin("google")}
                >
                    <GoogleIcon />
                    Sign in with Google
                </Button>
                {/* <Button
                    sx={{ width: 250 }}
                    variant="outlined"
                    onClick={() => handleLogin("anonymous")}
                >
                    Sing in anonymously
                </Button> */}
            </Paper>
        </Box>
    );
}
