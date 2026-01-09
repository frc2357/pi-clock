import Google from "@auth/core/providers/google";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
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

    const userMap = await Promise.all(
      users.map(async (user) => {
        const user_member_map = await ctx.db
          .query("user_member_map")
          .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
          .first();
        return !user_member_map?.member_id ? user : null;
      })
    )

    return userMap.filter(Boolean)
  }
})