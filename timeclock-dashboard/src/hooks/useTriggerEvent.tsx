import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function useTriggerEvent() {
    const loggedInMember = useQuery(api.team_member.getLoggedInMember);
    const memberClockedIn = loggedInMember?.active;

    const clockIn = useMutation(api.timeclock_event.clockIn);
    const clockOut = useMutation(api.timeclock_event.clockOut);
    const handleClockIn = async () => {
        if (loggedInMember) {
            await clockIn({
                member_id: loggedInMember._id,
                clock_in: Date.now(),
            });
        }
    };
    const handleClockOut = async () => {
        if (loggedInMember && loggedInMember.latest_event) {
            await clockOut({
                event_id: loggedInMember.latest_event._id,
                clock_out: Date.now(),
            });
        }
    };

    return {
        loggedInMember,
        memberClockedIn,
        handleClockIn,
        handleClockOut,
    };
}
