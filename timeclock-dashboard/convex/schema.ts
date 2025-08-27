import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,
    team_member: defineTable({
        user_id: v.id("users"),
        display_name: v.string(),
        nfc_id: v.string(),
        is_student: v.boolean(),
        is_admin: v.boolean(),
        deleted_at: v.optional(v.number())
    })
        .index("by_user_id", ["user_id"])
        .index("by_nfc_id", ["nfc_id"])
        .index("by_deleted_at", ["deleted_at"])
        .index("by_user_id_deleted_at", ["user_id", "deleted_at"]),

    timeclock_event: defineTable({
        member_id: v.id("team_member"),
        clock_in: v.optional(v.number()),
        clock_out: v.optional(v.number())
    })
        .index("by_member_id", ["member_id"])
        .index("by_member_id_clock_in", ["member_id", "clock_in"])
        .index("by_clock_in", ["clock_in"])

});