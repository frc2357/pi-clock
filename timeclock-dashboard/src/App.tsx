import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DefaultLayout from "./layout/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import { api } from "../convex/_generated/api";

function App() {
    const loggedInMember = useQuery(api.team_member.getLoggedInMember);

    return (
        <BrowserRouter>
            <DefaultLayout>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/logout" element={<LogoutPage />} />
                </Routes>
                <Authenticated>
                    {loggedInMember ? (
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                        </Routes>
                    ) : (
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography align="center" variant="h5">
                                Your Google account is not linked to a member
                                record on team 2357
                                <br />
                                Please contact Tyson Whelan to get your accounts
                                linked
                            </Typography>
                        </Box>
                    )}
                </Authenticated>
            </DefaultLayout>
            <Unauthenticated>
                <Navigate to="/login" />
            </Unauthenticated>
        </BrowserRouter>
    );
}

export default App;
