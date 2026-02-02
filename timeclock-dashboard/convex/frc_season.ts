import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { canceled_meetings_schema, meeting_schedule_schema } from "./schema";

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
