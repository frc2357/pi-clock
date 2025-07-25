import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const clockOut = mutation({
    args: { event_id: v.id("timeclock_event"), clock_out: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.event_id, { clock_out: args.clock_out });
    }
})

export const clockIn = mutation({
    args: { member_id: v.id("team_member"), clock_in: v.number()},
    handler: async (ctx, args) => {
        const eventId = await ctx.db.insert("timeclock_event", {
            member_id: args.member_id,
            clock_in: args.clock_in
        })
        const event = await ctx.db.get(eventId);

        return event;
    }
})

export const latestEventWithMember = query({
    handler: async (ctx) => {
        const latestEvent = await ctx.db
            .query("timeclock_event")
            .order("desc")
            .first();
        if (!latestEvent) return null;
        const member = await ctx.db.get(latestEvent.member_id);
        return {
            ...latestEvent,
            member
        };
    }
})