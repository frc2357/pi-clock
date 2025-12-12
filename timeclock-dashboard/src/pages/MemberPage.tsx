import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MemberEventTable from "../components/MemberEventTable";
import MemberInfoForm from "../components/MemberInfoForm";
import useTriggerEvent from "../hooks/useTriggerEvent";
import useCustomStyles from "../useCustomStyles";

export default function MemberPage() {
    const { pagePadding } = useCustomStyles();

    const { member_id } = useParams();
    const member = useQuery(api.team_member.getMember, {
        member_id: member_id as Id<"team_member">,
    });

    const { loggedInMember, memberClockedIn, handleClockIn, handleClockOut } =
        useTriggerEvent();

    if (member === undefined) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress size={100} />
            </Box>
        );
    }

    if (member === null) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography align="center" variant="h5">
                    Member not found
                </Typography>
            </Box>
        );
    }

    return (
        <Stack
            spacing={pagePadding.padding}
            sx={{ ...pagePadding, width: "100%" }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: pagePadding.padding,
                }}
            >
                <Typography variant="h4">{member.display_name}</Typography>
                <Stack direction="row" spacing={pagePadding.padding}>
                    <Button
                        variant="contained"
                        disabled={
                            loggedInMember?._id !== member._id ||
                            !!member.deleted_at
                        }
                        color={memberClockedIn ? "error" : "success"}
                        onClick={
                            memberClockedIn ? handleClockOut : handleClockIn
                        }
                    >
                        {memberClockedIn ? "Clock Out" : "Clock In"}
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={pagePadding.padding}>
                <MemberInfoForm member={member} />
                <MemberEventTable member_id={member._id} />
            </Grid>
        </Stack>
    );
}
