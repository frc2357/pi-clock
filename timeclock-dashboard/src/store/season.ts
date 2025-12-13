import { create } from "zustand";
import { Id } from "../../convex/_generated/dataModel";

interface SeasonState {
    selectedSeasonId: Id<"frc_season">;
    setSelectedSeasonId: (seasonId: Id<"frc_season">) => void;
}

export const useSeasonStore = create<SeasonState>((set) => {
    return {
        selectedSeasonId: "" as Id<"frc_season">,
        setSelectedSeasonId: (newSelectedSeasonId: Id<"frc_season">) =>
            set(() => ({ selectedSeasonId: newSelectedSeasonId })),
    };
});
