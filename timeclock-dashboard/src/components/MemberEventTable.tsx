import { Card, CardContent, CircularProgress, Grid } from "@mui/material";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import EventTable from "./EventTable";

export default function MemberEventTable({
    member_id,
}: {
    member_id: Id<"team_member">;
}) {
    const memberEvents = useQuery(api.timeclock_event.getEventsForMember, {
        member_id,
    });

    return (
        <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    {memberEvents ? (
                        <EventTable events={memberEvents} />
                    ) : (
                        <CircularProgress />
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
}
