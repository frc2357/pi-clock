import { query } from "./_generated/server";
import { getOneFrom } from "convex-helpers/server/relationships";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("team_member")
      .withIndex("by_deleted_at", (q) => q.eq("deleted_at", undefined))
      .collect()

    const enriched = await Promise.all(
      members.map(async (member) => {
        const user = await getOneFrom(ctx.db, "users", "by_id", member.user_id, "_id")
        return { ...member, user }
      })
    )

    return enriched
  }
})