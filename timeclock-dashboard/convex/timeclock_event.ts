import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const enrichEvent = async (ctx: QueryCtx, event: Doc<"timeclock_event">) => {
    const member = await ctx.db.get(event.member_id);
    const duration_hours =
        event.clock_out && event.clock_in
            ? (event.clock_out - event.clock_in) / 3600000.0
            : null;
    return {
        ...event,
        member,
        duration_hours: duration_hours?.toFixed(3)
    };
};

export const clockOut = mutation({
    args: { event_id: v.id("timeclock_event"), clock_out: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.event_id, { clock_out: args.clock_out });
    },
});

export const clockIn = mutation({
    args: { member_id: v.id("team_member"), clock_in: v.number() },
    handler: async (ctx, args) => {
        const eventId = await ctx.db.insert("timeclock_event", {
            member_id: args.member_id,
            clock_in: args.clock_in,
        });
        const event = await ctx.db.get(eventId);

        return event;
    },
});

export const latestEventWithMember = query({
    handler: async (ctx) => {
        const latestEvent = await ctx.db
            .query("timeclock_event")
            .order("desc")
            .first();
        if (!latestEvent) return null;
        return enrichEvent(ctx, latestEvent);
    },
});

export const getEventsForMember = query({
    args: { member_id: v.id("team_member") },
    handler: async (ctx, args) => {
        const events = await ctx.db
            .query("timeclock_event")
            .withIndex("by_member_id_clock_in", (q) =>
                q.eq("member_id", args.member_id)
            )
            .order("desc")
            .collect();

        return Promise.all(
            events.map(async (event) => enrichEvent(ctx, event))
        );
    },
});

export const list = query({
    handler: async (ctx) => {
        const events = await ctx.db
            .query("timeclock_event")
            .withIndex("by_clock_in")
            .order("desc")
            .collect();

        return Promise.all(
            events.map(async (event) => enrichEvent(ctx, event))
        );
    },
});
