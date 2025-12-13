import { query } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const seasons = await ctx.db.query("frc_season").collect();
        const sorted = seasons.sort((a, b) => b.start_date - a.start_date);
        return sorted;
    },
});

export const currentSeason = query({
    args: {},
    handler: async (ctx) => {
        const today = Date.now();
        const seasons: Doc<"frc_season">[] = await ctx.runQuery(
            api.frc_season.list
        );

        return seasons?.find(({ start_date, end_date }) => {
            return today >= start_date && today <= end_date;
        });
    },
});
