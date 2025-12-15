import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { filterEventsBySeason } from "./utils";
import { eventLocation } from './schema';

const MILLIS_PER_MINUTE = 1000 * 60;

const enrichEvent = async (ctx: QueryCtx, event: Doc<"timeclock_event">) => {
    const member = await ctx.db.get(event.member_id);
    const duration_hours =
        event.clock_out && event.clock_in
            ? (event.clock_out - event.clock_in) / 3600000.0
            : null;
    return {
        ...event,
        member,
        duration_hours,
    };
};

const roundToMinute = (timestamp?: number) => {
    if (!timestamp) return timestamp;
    const minutes = Math.floor(timestamp / MILLIS_PER_MINUTE);
    return minutes * MILLIS_PER_MINUTE
}

export const createEvent = mutation({
    args: {
        member_id: v.id("team_member"),
        clock_in: v.optional(v.number()),
        clock_out: v.optional(v.number()),
        clock_in_location: v.optional(eventLocation),
        clock_out_location: v.optional(eventLocation),
    },
    handler: async (ctx, args) => {
        const eventId = await ctx.db.insert("timeclock_event", {
            member_id: args.member_id,
            clock_in: roundToMinute(args.clock_in),
            clock_out: roundToMinute(args.clock_out),
            clock_in_location: args.clock_in_location,
            clock_out_location: args.clock_out_location,
        });

        return await ctx.db.get(eventId);
    },
});

export const clockOut = mutation({
    args: {
        event_id: v.id("timeclock_event"),
        clock_out: v.number(),
        location: eventLocation
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.event_id, {
            clock_out: roundToMinute(args.clock_out),
            clock_out_location: args.location
        });
    },
});

export const clockIn = mutation({
    args: {
        member_id: v.id("team_member"),
        clock_in: v.number(),
        location: eventLocation
    },
    handler: async (ctx, args) => {
        const eventId = await ctx.db.insert("timeclock_event", {
            member_id: args.member_id,
            clock_in: roundToMinute(args.clock_in),
            clock_in_location: args.location
        });

        return await ctx.db.get(eventId);
    },
});

export const latestEventWithMember = query({
    args: { season_id: v.optional(v.id("frc_season")) },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("timeclock_event")
            .order("desc")
            .collect();

        const filtered = await filterEventsBySeason(
            ctx,
            events,
            args.season_id
        );

        const latestEvent = filtered?.[0];
        if (!latestEvent) return null;
        return enrichEvent(ctx, latestEvent);
    },
});

export const getEventsForMember = query({
    args: {
        member_id: v.id("team_member"),
        season_id: v.optional(v.id("frc_season")),
    },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("timeclock_event")
            .withIndex("by_member_id_clock_in", (q) =>
                q.eq("member_id", args.member_id)
            )
            .order("desc")
            .collect();

        const filtered = await filterEventsBySeason(
            ctx,
            events,
            args.season_id
        );

        return Promise.all(
            filtered.map(async (event) => enrichEvent(ctx, event))
        );
    },
});

export const list = query({
    args: { season_id: v.optional(v.id("frc_season")) },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("timeclock_event")
            .withIndex("by_clock_in")
            .order("desc")
            .collect();

        const filtered = await filterEventsBySeason(
            ctx,
            events,
            args.season_id
        );

        return Promise.all(
            filtered.map(async (event) => enrichEvent(ctx, event))
        );
    },
});

export const updateEvent = mutation({
    args: {
        id: v.id("timeclock_event"),
        clock_in: v.number(),
        clock_in_location: eventLocation,
        clock_out: v.number(),
        clock_out_location: eventLocation,
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const deleteEvent = mutation({
    args: { id: v.id("timeclock_event") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
