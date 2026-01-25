import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { isClockInOutdated } from "./utils";
import { filterEventsBySeason } from "./utils";
import { getAll } from "convex-helpers/server/relationships";
import { enrichEvent } from "./timeclock_event";

const enrichMember = async (
    ctx: QueryCtx,
    member: Doc<"team_member">,
    season_id: Id<"frc_season"> | undefined = undefined
) => {
    const events = await ctx.db
        .query("timeclock_event")
        .withIndex("by_member_id_clock_in", (q) =>
            q.eq("member_id", member._id)
        )
        .order("desc")
        .collect();

    const filteredEvents = await filterEventsBySeason(ctx, events, season_id);

    const enrichedEvents = await Promise.all(
        filteredEvents.map(async (event) => enrichEvent(ctx, event))
    );

    const umms = await ctx.db
        .query("user_member_map")
        .withIndex("by_member_id", (q) => q.eq("member_id", member._id))
        .collect();
    const users = await getAll(
        ctx.db,
        umms.map((umm) => umm.user_id)
    );

    const latest_event = events[0] || null;
    const latest_event_filtered = filteredEvents[0] || null;
    const active =
        latest_event &&
        !latest_event.clock_out &&
        !isClockInOutdated(latest_event.clock_in!, Date.now());
    const total_hours = enrichedEvents.reduce((acc, event) => {
        if (event.clock_in && event.clock_out) {
            return acc + (event.clock_out - event.clock_in) / 3600000.0; // Convert ms to hours
        }
        return acc;
    }, 0.0);

    return {
        ...member,
        events: enrichedEvents,
        latest_clock_in: latest_event_filtered?.clock_in || null,
        latest_event: latest_event_filtered,
        active,
        total_hours,
        users,
    };
};

export const getMember = query({
    args: {
        member_id: v.id("team_member"),
        season_id: v.optional(v.id("frc_season")),
    },
    handler: async (ctx, { member_id, season_id }) => {
        const member = await ctx.db.get(member_id);
        if (!member) return member;
        return enrichMember(ctx, member, season_id);
    },
});

export const toggleMemberActivation = mutation({
    args: {
        member_id: v.id("team_member"),
    },
    handler: async (ctx, args) => {
        const member = await ctx.db.get(args.member_id);
        if (member?.deleted_at) {
            return ctx.db.patch(args.member_id, {
                deleted_at: undefined,
            });
        } else {
            return ctx.db.patch(args.member_id, {
                deleted_at: Date.now(),
            });
        }
    },
});

export const updateMember = mutation({
    args: {
        member_id: v.id("team_member"),
        display_name: v.optional(v.string()),
        nfc_id: v.optional(v.string()),
        user_ids: v.optional(v.array(v.id("users"))),
        is_student: v.optional(v.boolean()),
        is_admin: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { member_id, user_ids: incomingUserIds } = args;

        if (incomingUserIds) {
            const existingUMMs = await ctx.db
                .query("user_member_map")
                .withIndex("by_member_id", (q) => q.eq("member_id", member_id))
                .collect();

            const incomingSet = new Set(incomingUserIds);
            const existingSet = new Set(existingUMMs.map((umm) => umm.user_id));

            const userIdsToAdd = incomingUserIds.filter(
                (id) => !existingSet.has(id)
            );
            const ummsToDelete = existingUMMs.filter(
                (umm) => !incomingSet.has(umm.user_id)
            );

            userIdsToAdd.forEach((user_id) =>
                ctx.db.insert("user_member_map", { member_id, user_id })
            );
            ummsToDelete.forEach((umm) => {
                ctx.db.delete("user_member_map", umm._id);
            });
        }

        return ctx.db.patch(member_id, {
            display_name: args.display_name,
            nfc_id: args.nfc_id,
            is_student: args.is_student,
            is_admin: args.is_admin,
        });
    },
});

export const createMember = mutation({
    args: {
        user_ids: v.array(v.id("users")),
        display_name: v.string(),
        nfc_id: v.string(),
        is_student: v.boolean(),
        is_admin: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { user_ids, ...rest } = args;
        if (user_ids?.length) {
            const userMemberMaps = await ctx.db
                .query("user_member_map")
                .collect();
            const existingUserMemberMaps = userMemberMaps.filter((umm) =>
                user_ids.includes(umm.user_id)
            );

            if (existingUserMemberMaps?.length) {
                throw new Error("Member already exists for this user.");
            }
        }

        const member_id = await ctx.db.insert("team_member", rest);

        user_ids.forEach((user_id) => {
            ctx.db.insert("user_member_map", { user_id, member_id });
        });
        return member_id;
    },
});

export const getLoggedInMember = query({
    args: {
        season_id: v.optional(v.id("frc_season")),
    },
    handler: async (ctx, { season_id }) => {
        const loggedInUserId = await getAuthUserId(ctx);
        if (!loggedInUserId) return null;

        const { member_id } =
            (await ctx.db
                .query("user_member_map")
                .withIndex("by_user_id", (q) => q.eq("user_id", loggedInUserId))
                .first()) || {};
        if (!member_id) return null;
        const member = await ctx.db.get(member_id);
        if (!member) return member;
        return enrichMember(ctx, member, season_id);
    },
});

export const list = query({
    args: {
        season_id: v.optional(v.id("frc_season")),
    },
    handler: async (ctx, { season_id }) => {
        const members = await ctx.db.query("team_member").collect();

        return Promise.all(
            members.map(async (member) => enrichMember(ctx, member, season_id))
        );
    },
});

export const getByNfcId = query({
    args: { nfc_id: v.string() },
    handler: async (ctx, { nfc_id }) => {
        const member = await ctx.db
            .query("team_member")
            .withIndex("by_nfc_id", (q) => q.eq("nfc_id", nfc_id))
            .first();

        return member;
    },
});

export const getLatestEvent = query({
    args: {
        member_id: v.id("team_member"),
        season_id: v.optional(v.id("frc_season")),
    },
    handler: async (ctx, { member_id, season_id }) => {
        const events = await ctx.db
            .query("timeclock_event")
            .withIndex("by_member_id_clock_in", (q) =>
                q.eq("member_id", member_id)
            )
            .order("desc")
            .collect();

        const filteredEvents = await filterEventsBySeason(
            ctx,
            events,
            season_id
        );

        return filteredEvents[0];
    },
});
