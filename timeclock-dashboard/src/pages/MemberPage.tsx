import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MemberInfoForm from "../components/MemberInfoForm";
import MemberEventTable from "../components/MemberEventTable";
import useCustomStyles from "../useCustomStyles";

export default function MemberPage() {
    const { pagePadding } = useCustomStyles();

    const { member_id } = useParams();
    const member = useQuery(api.team_member.getMember, {
        member_id: member_id as Id<"team_member">,
    });

    const loggedInMember = useQuery(api.team_member.getLoggedInMember);

    const clockIn = useMutation(api.timeclock_event.clockIn);
    const clockOut = useMutation(api.timeclock_event.clockOut);
    const handleClockIn = async () => {
        if (member) {
            await clockIn({
                member_id: member._id,
                clock_in: Date.now(),
            });
        }
    };
    const handleClockOut = async () => {
        if (member && member.latest_event) {
            await clockOut({
                event_id: member.latest_event._id,
                clock_out: Date.now(),
            });
        }
    };

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
                    {member.active ? (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClockOut}
                            disabled={loggedInMember?._id !== member._id}
                        >
                            Clock Out
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleClockIn}
                            disabled={loggedInMember?._id !== member._id}
                        >
                            Clock In
                        </Button>
                    )}
                </Stack>
            </Box>

            <Grid container spacing={pagePadding.padding}>
                <MemberInfoForm member={member} />
                <MemberEventTable member_id={member._id} />
            </Grid>
        </Stack>
    );
}
