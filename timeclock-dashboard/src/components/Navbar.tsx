import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import logo from "../assets/logo.png";

export default function Navbar() {
    const loggedInMember = useQuery(api.team_member.getLoggedInMember);

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Link
                    underline="none"
                    href="/"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                    }}
                >
                    <img style={{ height: 40, width: 40 }} src={logo} />
                    <Typography variant="h5" sx={{ margin: 2 }}>
                        FRC2357 Timeclock
                    </Typography>
                </Link>
                {loggedInMember?.is_admin && (
                    <Button
                        variant="contained"
                        href="/create-member"
                        sx={{ marginLeft: 2 }}
                    >
                        Create Member
                    </Button>
                )}
                <Authenticated>
                    <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                        <Typography variant="h6">
                            {loggedInMember && loggedInMember.display_name}
                        </Typography>
                        <Button variant="outlined" href="/logout">
                            Logout
                        </Button>
                    </Box>
                </Authenticated>
            </Toolbar>
        </AppBar>
    );
}
