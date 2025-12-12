import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    Link,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { To, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useTriggerEvent from "../hooks/useTriggerEvent";

export default function Navbar() {
    const navigate = useNavigate();

    const { loggedInMember, memberClockedIn, handleClockIn, handleClockOut } =
        useTriggerEvent();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(
        null
    );

    const openProfileMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setProfileAnchor(event.currentTarget);
    };
    const closeProfileMenu = () => setProfileAnchor(null);
    const navigateAndCloseProfileMenu = (to: To) => {
        navigate(to);
        closeProfileMenu();
    };

    const profileMenuItems = [
        <MenuItem
            sx={{ width: "100%" }}
            onClick={() =>
                navigateAndCloseProfileMenu(`/member/${loggedInMember!._id}`)
            }
        >
            Profile
        </MenuItem>,
        <MenuItem sx={{ padding: 0, width: "100%" }}>
            <Button
                disabled={!loggedInMember}
                color={memberClockedIn ? "error" : "success"}
                onClick={memberClockedIn ? handleClockOut : handleClockIn}
                sx={{
                    paddingX: 2,
                    width: "100%",
                    justifyContent: "flex-start",
                }}
            >
                {memberClockedIn ? "Clock Out" : "Clock In"}
            </Button>
        </MenuItem>,
        <MenuItem
            onClick={() => navigateAndCloseProfileMenu("/logout")}
            sx={{ width: "100%" }}
        >
            Logout
        </MenuItem>,
    ];

    const profileMenu = (
        <Menu
            id="profile-menu"
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={closeProfileMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Box sx={{ width: "150px" }}>{profileMenuItems}</Box>
        </Menu>
    );

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
            <MenuList disablePadding>
                {loggedInMember?.is_admin && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/create-member")}
                                sx={{
                                    borderRadius: 1,
                                    py: 0,
                                    px: 1,
                                    "&:hover": {
                                        backgroundColor: "primary.main",
                                    },
                                }}
                            >
                                <ListItemText primary="Create Member" />
                            </ListItemButton>
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                    </>
                )}
                {profileMenuItems}
            </MenuList>
        </Box>
    );

    return (
        <>
            <AppBar component="nav">
                <Toolbar
                    variant="dense"
                    sx={{ display: "flex", alignItems: "center" }}
                >
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
                        <img
                            style={{ height: 30, aspectRatio: 1 }}
                            src={logo}
                        />
                        <Typography variant="h6" sx={{ marginX: 2 }}>
                            Timeclock
                        </Typography>
                    </Link>
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
                        <Box
                            sx={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                            }}
                        >
                            {loggedInMember?.is_admin && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    href="/create-member"
                                    sx={{
                                        marginLeft: 2,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        paddingX: 2,
                                    }}
                                >
                                    Create Member
                                </Button>
                            )}
                            <Box>
                                {profileMenu}
                                <Button
                                    size="small"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        textTransform: "none",
                                    }}
                                    onClick={openProfileMenu}
                                >
                                    <Typography variant="subtitle1">
                                        {loggedInMember?.display_name}
                                    </Typography>
                                </Button>
                            </Box>
                        </Box>
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
