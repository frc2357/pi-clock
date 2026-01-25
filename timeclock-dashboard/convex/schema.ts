import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const meeting_schedule_schema = v.array(
    v.object({
        weekday: v.union(
            v.literal(0), // 0 = Sunday
            v.literal(1),
            v.literal(2),
            v.literal(3),
            v.literal(4),
            v.literal(5),
            v.literal(6)
        ),
        start: v.number(),
        end: v.number(),
        duration_hours: v.number(),
    })
);

export const canceled_meetings_schema = v.array(
    v.object({ date_canceled: v.number() })
);

export default defineSchema({
    ...authTables,
    team_member: defineTable({
        display_name: v.string(),
        nfc_id: v.string(),
        is_student: v.boolean(),
        is_admin: v.boolean(),
        deleted_at: v.optional(v.number()),
    })
        .index("by_nfc_id", ["nfc_id"])
        .index("by_deleted_at", ["deleted_at"]),

    timeclock_event: defineTable({
        member_id: v.id("team_member"),
        clock_in: v.optional(v.number()),
        clock_out: v.optional(v.number()),
    })
        .index("by_member_id", ["member_id"])
        .index("by_member_id_clock_in", ["member_id", "clock_in"])
        .index("by_clock_in", ["clock_in"]),

    frc_season: defineTable({
        name: v.string(),
        start_date: v.number(),
        end_date: v.number(),

        meeting_schedule: meeting_schedule_schema,
        canceled_meetings: canceled_meetings_schema,
    })
        .index("by_name", ["name"])
        .index("by_start", ["start_date"])
        .index("by_end", ["end_date"])
        .index("by_start_and_end", ["start_date", "end_date"]),

    user_member_map: defineTable({
        user_id: v.id("users"),
        member_id: v.id("team_member"),
    })
        .index("by_user_id", ["user_id"])
        .index("by_member_id", ["member_id"]),
});
