import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import { Authenticated } from "convex/react";

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <img style={{ height: 40, width: 40 }} src={logo} />
                <Typography variant="h5" sx={{ margin: 2 }}>
                    FRC2357 Timeclock
                </Typography>
                <Authenticated>
                    <Button
                        variant="outlined"
                        sx={{ marginLeft: "auto" }}
                        href="/logout"
                    >
                        Logout
                    </Button>
                </Authenticated>
            </Toolbar>
        </AppBar>
    );
}
