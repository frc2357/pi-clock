import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { canceled_meetings_schema, meeting_schedule_schema } from "./schema";

const localeDAYOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    timeZone: "America/Chicago",
};

export const list = query({
    args: {},
    handler: async (ctx) => {
        const seasons = await ctx.db.query("frc_season").collect();
        const sorted = seasons.sort((a, b) => b.start_date - a.start_date);
        return sorted;
    },
});

export const currentSeason = query({
    args: {},
    handler: async (ctx) => {
        const today = Date.now();
        const seasons: Doc<"frc_season">[] = await ctx.runQuery(
            api.frc_season.list
        );

        return seasons?.find(({ start_date, end_date }) => {
            return today >= start_date && today < end_date;
        });
    },
});

export const get = query({
    args: { season_id: v.optional(v.id("frc_season")) },
    handler: (ctx, { season_id }) => {
        if (!season_id) return null;
        return ctx.db.get(season_id);
    },
});

export const createSeason = mutation({
    args: {
        name: v.string(),
        start_date: v.number(),
        end_date: v.number(),
        meeting_schedule: meeting_schedule_schema,
        canceled_meetings: canceled_meetings_schema,
    },
    handler: (ctx, args) => {
        return ctx.db.insert("frc_season", args);
    },
});

export const updateSeason = mutation({
    args: {
        season_id: v.id("frc_season"),
        name: v.optional(v.string()),
        start_date: v.optional(v.number()),
        end_date: v.optional(v.number()),
        meeting_schedule: meeting_schedule_schema,
        canceled_meetings: canceled_meetings_schema,
    },
    handler: (ctx, args) => {
        const { season_id, ...rest } = args;
        return ctx.db.patch(season_id, rest);
    },
});

export const getHoursSinceSeasonStart = query({
    args: {
        season_id: v.optional(v.id("frc_season")),
    },
    handler: async (ctx, args) => {
        if (!args.season_id) return undefined;

        const season = await ctx.db.get(args.season_id);
        if (!season) return undefined;

        // Convert meeting_schedule array to object for faster lookup
        const schedule_map = Object.fromEntries(
            season.meeting_schedule.map((schedule) => [
                schedule.weekday,
                schedule,
            ])
        );
        // Convert canceled_meetings to Set of days of year for faster lookup
        const canceled_days = new Set(
            season.canceled_meetings.map(({ date_canceled }) =>
                parseInt(
                    new Date(date_canceled).toLocaleString(
                        "en-US",
                        localeDAYOptions
                    )
                )
            )
        );

        // Get season_start day of year and today day of year
        const season_start = new Date(season.start_date);
        const season_start_day = parseInt(
            season_start.toLocaleString("en-US", localeDAYOptions)
        );
        const today = new Date();
        const today_day = parseInt(
            today.toLocaleString("en-US", localeDAYOptions)
        );

        // Get day of week of Jan 1st so we can use math to determine dow
        // instead of converting to Date objects
        // prettier-ignore
        const first_dow = (((season_start.getDay() - (season_start.getDate() - 1)) % 7) + 7) % 7;

        // Loop from season_start_day (inclusive) to today_day (exclusive)
        // and count the number of hours of scheduled meetings per day
        let season_hours_passed = 0;
        for (let day = season_start_day; day < today_day; day++) {
            // if day in canceled_
            if (canceled_days.has(day)) continue;

            const dow = (first_dow + (day - 1)) % 7;
            const schedule_entry = schedule_map[dow];
            if (schedule_entry) {
                season_hours_passed += schedule_entry.duration_hours;
            }
        }

        return season_hours_passed;
    },
});
