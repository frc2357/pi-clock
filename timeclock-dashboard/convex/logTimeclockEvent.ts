import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const MILLIS_PER_HOUR = 60 * 60 * 1000;
const LONGEST_ALLOWED_SHIFT_HOURS = parseInt(process.env.LONGEST_ALLOWED_SHIFT_HOURS!, 10);

const isClockInOutdated = (clock_in: number, timestamp: number) => {
    const age = timestamp - clock_in;
    const allowed_age = LONGEST_ALLOWED_SHIFT_HOURS * MILLIS_PER_HOUR;
    return age > allowed_age;
}

export const recordTimeclockEvent = httpAction(async (ctx, request) => {
    const { nfc_id, timestamp } = await request.json();
    const member = await ctx.runQuery(api.team_member.getByNfcId, { nfc_id });

    if (member) {
        const latestEvent = await ctx.runQuery(api.team_member.getLatestEvent, { member_id: member._id });    
        if (
            !latestEvent ||
            latestEvent.clock_out ||
            (latestEvent.clock_in && isClockInOutdated(latestEvent.clock_in, timestamp))
        ) {
            // If the latest event has a clock_out, create a new clock_in event
            await ctx.runMutation(api.timeclock_event.clockIn, {
                member_id: member._id,
                clock_in: timestamp,
            });

            return Response.json(
                { event: 'clock_in', member },
                { status: 200}
            )
        } else {
            // Otherwise, update clock_out for the latest event
            await ctx.runMutation(api.timeclock_event.clockOut, {
                event_id: latestEvent._id,
                clock_out: timestamp,
            })

            return Response.json(
                { event: 'clock_out', member },
                { status: 200 }
            )
        }
    }

    return Response.json(
        { error: 'Member not found or NFC ID not recognized' },
        { status: 404 }
    );
})