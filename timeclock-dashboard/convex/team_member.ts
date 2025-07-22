import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("team_member")
      .withIndex("by_deleted_at", (q) => q.eq("deleted_at", undefined))
      .collect()

    const enriched = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.user_id);
        const events = await ctx.db
          .query("timeclock_event")
          .withIndex("by_member_id_clock_in", (q) => q.eq("member_id", member._id))
          .order("desc")
          .collect()

        const latest_event = events[0] || null;
        const active = !latest_event?.clock_out 
        const total_hours = events.reduce((acc, event) => {
          if (event.clock_in && event.clock_out) {
            return acc + (event.clock_out - event.clock_in) / 3600000.0 // Convert ms to hours
          }
          return acc
        }, 0.0)

        return {
          ...member,
          user,
          events,
          latest_event,
          active,
          total_hours: total_hours.toFixed(2)
        }
      })
    )

    return enriched
  }
})

export const getByNfcId = query({
  args: { nfc_id: v.string()},
  handler: async (ctx, { nfc_id }) => {
    const member = await ctx.db
      .query("team_member")
      .withIndex("by_nfc_id", (q) => q.eq("nfc_id", nfc_id))
      .first()
    if (!member) return null;
    const user = await ctx.db.get(member.user_id);

    return {
      ...member,
      user
    }
  }
})

export const getLatestEvent = query({
  args: { member_id: v.id("team_member") },
  handler: async (ctx, { member_id }) => {
    return ctx.db
      .query("timeclock_event")
      .withIndex("by_member_id_clock_in", (q) => q.eq("member_id", member_id))
      .order("desc")
      .first()
  }
})