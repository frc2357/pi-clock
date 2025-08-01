import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Authenticated, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import logo from "../assets/logo.png";

export default function Navbar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const loggedInMember = useQuery(api.team_member.getLoggedInMember);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const drawerContent = (
        <Box
            sx={{ width: 250, p: 2 }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            {loggedInMember && (
                <>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        {loggedInMember.display_name}
                    </Typography>
                    {loggedInMember.is_admin && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Admin
                        </Typography>
                    )}
                    <Divider sx={{ my: 1 }} />
                </>
            )}
            <List>
                {loggedInMember?.is_admin && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="/create-member"
                            sx={{
                                borderRadius: 1,
                                py: 0.5,
                                px: 1,
                                "&:hover": { backgroundColor: "primary.main" },
                            }}
                        >
                            <ListItemText primary="Create Member" />
                        </ListItemButton>
                    </ListItem>
                )}
                <ListItem disablePadding>
                    <ListItemButton
                        component="a"
                        href="/logout"
                        sx={{
                            borderRadius: 1,
                            py: 0.5,
                            px: 1,
                            "&:hover": { backgroundColor: "primary.main" },
                        }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed">
                <Toolbar sx={{ display: "flex", alignItems: "center" }}>
                    <Link
                        underline="none"
                        href="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        <img style={{ height: 40, width: 40 }} src={logo} />
                        <Typography variant="h5" sx={{ margin: 2 }}>
                            FRC2357 Timeclock
                        </Typography>
                    </Link>

                    {!isMobile && loggedInMember?.is_admin && (
                        <Button
                            variant="contained"
                            href="/create-member"
                            sx={{
                                marginLeft: 2,
                                textTransform: "none",
                                borderRadius: 2,
                                paddingX: 2.5,
                                paddingY: 1,
                            }}
                        >
                            Create Member
                        </Button>
                    )}

                    {isMobile ? (
                        <Box sx={{ marginLeft: "auto" }}>
                            <IconButton
                                color="inherit"
                                edge="end"
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Authenticated>
                            <Box
                                sx={{
                                    marginLeft: "auto",
                                    display: "flex",
                                    gap: 2,
                                }}
                            >
                                <Typography variant="h6">
                                    {loggedInMember?.display_name}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    href="/logout"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        paddingX: 2.5,
                                        paddingY: 1,
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Authenticated>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}

// import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
// import { Authenticated, useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import logo from "../assets/logo.png";

// export default function Navbar() {
//     const loggedInMember = useQuery(api.team_member.getLoggedInMember);

//     return (
//         <AppBar position="fixed">
//             <Toolbar>
//                 <Link
//                     underline="none"
//                     href="/"
//                     sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         color: "white",
//                     }}
//                 >
//                     <img style={{ height: 40, width: 40 }} src={logo} />
//                     <Typography variant="h5" sx={{ margin: 2 }}>
//                         FRC2357 Timeclock
//                     </Typography>
//                 </Link>
//                 {loggedInMember?.is_admin && (
//                     <Button
//                         variant="contained"
//                         href="/create-member"
//                         sx={{ marginLeft: 2 }}
//                     >
//                         Create Member
//                     </Button>
//                 )}
//                 <Authenticated>
//                     <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
//                         <Typography variant="h6">
//                             {loggedInMember && loggedInMember.display_name}
//                         </Typography>
//                         <Button variant="outlined" href="/logout">
//                             Logout
//                         </Button>
//                     </Box>
//                 </Authenticated>
//             </Toolbar>
//         </AppBar>
//     );
// }
