import { v } from "convex/values";
import { mutation } from "./_generated/server";

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