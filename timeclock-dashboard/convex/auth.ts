import Google from "@auth/core/providers/google";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated} = convexAuth({
  providers: [Anonymous, Google]
})

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  }
})

export const getUsersWithoutMember = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect()

    const usersMap = await Promise.all(
      users.map(async (user) => {
        const members = await ctx.db
          .query("team_member")
          .withIndex("by_user_id_deleted_at", (q) => q.eq("user_id", user._id).eq("deleted_at", undefined))
          .collect()
        return members.length === 0 ? user : null;
      })
    )
    return usersMap.filter((user) => user !== null)
  }
})