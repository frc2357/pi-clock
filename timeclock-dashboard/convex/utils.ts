import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

const MILLIS_PER_HOUR = 60 * 60 * 1000;
const LONGEST_ALLOWED_SHIFT_HOURS = parseInt(
    process.env.LONGEST_ALLOWED_SHIFT_HOURS!,
    10
);

export const isClockInOutdated = (clock_in: number, now: number) => {
    const age = now - clock_in;
    const allowed_age = LONGEST_ALLOWED_SHIFT_HOURS * MILLIS_PER_HOUR;
    return age > allowed_age;
};

export const filterEventsBySeason = async (
    ctx: QueryCtx,
    events: Doc<"timeclock_event">[],
    season_id: Id<"frc_season"> | undefined
) => {
    if (!season_id || !events?.length) {
        return events;
    }

    const season = await ctx.db.get(season_id);

    if (!season) return events;

    return events.filter(({ clock_in }) => {
        if (!clock_in) return false;
        return clock_in >= season.start_date && clock_in <= season.end_date;
    });
};
