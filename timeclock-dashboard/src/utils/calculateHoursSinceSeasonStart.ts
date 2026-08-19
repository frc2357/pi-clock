import { getDayOfYear } from "date-fns";
import { Doc } from "../../convex/_generated/dataModel";

/**
 * Calculate hours since season start based on user's local timezone
 */
export const calculateHoursSinceSeasonStart = (
    season: Doc<"frc_season"> | null | undefined
): number | undefined => {
    if (!season) return undefined;

    // Convert meeting_schedule array to object for faster lookup
    const schedule_map = Object.fromEntries(
        season.meeting_schedule.map((schedule) => [schedule.weekday, schedule])
    );

    // Convert canceled_meetings to Set of days of year for faster lookup
    const canceled_days = new Set(
        season.canceled_meetings.map(({ date_canceled }) => {
            const date = new Date(date_canceled);
            return getDayOfYear(date);
        })
    );

    // Get season_start day of year and min(today, season_end) day of year
    const season_start = new Date(season.start_date);
    const season_start_day = getDayOfYear(season_start);
    const end_date = new Date(
        Math.min(new Date().getTime(), new Date(season.end_date).getTime())
    );
    const end_day = getDayOfYear(end_date);

    // Get day of week of Jan 1st so we can use math to determine dow
    // instead of converting to Date objects
    // prettier-ignore
    const first_dow = (((season_start.getDay() - (getDayOfYear(season_start) - 1)) % 7) + 7) % 7;

    // Loop from season_start_day (inclusive) to end_day (exclusive)
    // and count the number of hours of scheduled meetings per day
    let season_hours_passed = 0;
    for (let day = season_start_day; day < end_day; day++) {
        // if day in canceled_days
        if (canceled_days.has(day)) continue;

        const dow = (first_dow + (day - 1)) % 7;
        const schedule_entry = schedule_map[dow];
        if (schedule_entry) {
            season_hours_passed += schedule_entry.duration_hours;
        }
    }

    return season_hours_passed;
};
