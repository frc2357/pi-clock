import { useSeasonStore } from "@/store/season";
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export default function SeasonDropdown() {
    const navigate = useNavigate();

    const loggedInMember = useQuery(api.team_member.getLoggedInMember, {});

    const allSeasons = useQuery(api.frc_season.list);
    const currentSeason = useQuery(api.frc_season.currentSeason);
    const { selectedSeasonId, setSelectedSeasonId } = useSeasonStore();

    useEffect(() => {
        if (currentSeason?._id && !selectedSeasonId) {
            setSelectedSeasonId(currentSeason._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSeason]);

    const handleEditClick = (
        e: React.MouseEvent,
        seasonId: Id<"frc_season">
    ) => {
        e.stopPropagation();
        navigate(`/season/${seasonId}`);
    };

    const renderValue = (value: Id<"frc_season">) => {
        const season = allSeasons?.find((s) => s._id === value);
        return season?.name || "";
    };

    return (
        <FormControl sx={{ m: "6px", minWidth: 120 }} size="small">
            <InputLabel
                id="season-select-label"
                shrink={false}
                sx={{ display: !selectedSeasonId ? undefined : "none" }}
            >
                Season
            </InputLabel>
            <Select
                labelId="season-select-label"
                id="season-select"
                value={selectedSeasonId || ("" as Id<"frc_season">)}
                onChange={(e) =>
                    setSelectedSeasonId(e.target.value as Id<"frc_season">)
                }
                renderValue={renderValue}
                sx={{ "& .MuiSelect-select": { padding: "6.5px" } }}
            >
                {allSeasons?.map((season) => (
                    <MenuItem key={season._id} value={season._id}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            {season.name}
                            {loggedInMember?.is_admin && (
                                <IconButton
                                    size="small"
                                    onClick={(e) =>
                                        handleEditClick(e, season._id)
                                    }
                                    sx={{ ml: 1 }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    </MenuItem>
                ))}
                {loggedInMember?.is_admin && (
                    <MenuItem onClick={() => navigate("/create-season")}>
                        <AddIcon sx={{ mr: 1 }} />
                        Create Season
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    );
}
