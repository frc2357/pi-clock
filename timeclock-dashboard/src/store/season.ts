import { create } from "zustand";
import { Id } from "../../convex/_generated/dataModel";

interface SeasonState {
    selectedSeasonId?: Id<"frc_season">;
    expectedHours?: number | null;
    setSelectedSeasonId: (seasonId?: Id<"frc_season">) => void;
    setExpectedHours: (newExpectedHours?: number | null) => void;
}

export const useSeasonStore = create<SeasonState>((set) => {
    return {
        selectedSeasonId: undefined,
        expectedHours: undefined,
        setSelectedSeasonId: (newSelectedSeasonId?: Id<"frc_season">) =>
            set(() => ({ selectedSeasonId: newSelectedSeasonId })),
        setExpectedHours: (newExpectedHours?: number | null) =>
            set(() => ({ expectedHours: newExpectedHours })),
    };
});
