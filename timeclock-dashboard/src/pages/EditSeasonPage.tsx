import useSeasonForm, { formDataType } from "@/hooks/useSeasonForm";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import useCustomStyles from "../useCustomStyles";

export default function EditSeasonPage() {
    const { pagePadding } = useCustomStyles();

    const updateSeason = useMutation(api.frc_season.updateSeason);

    const { season_id } = useParams();
    const season = useQuery(api.frc_season.get, {
        season_id: season_id as Id<"frc_season">,
    });

    const { formInputs, formData, setFormData } = useSeasonForm();

    useEffect(() => {
        if (season) {
            const {
                name,
                start_date,
                end_date,
                meeting_schedule,
                canceled_meetings,
            } = season;
            setFormData({
                name,
                start_date,
                end_date,
                meeting_schedule,
                canceled_meetings,
            } as formDataType);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [season === undefined]);

    if (season === undefined) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress size={100} />
            </Box>
        );
    }

    if (season === null) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography align="center" variant="h5">
                    Season not found
                </Typography>
            </Box>
        );
    }

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateSeason({
                season_id: season_id as Id<"frc_season">,
                ...formData,
            });
            toast.success("Season updated successfully");
        } catch {
            toast.error("Failed to update season");
        }
    };

    return (
        <Box sx={{ ...pagePadding, height: "100%", width: "100%" }}>
            <Typography variant="h3" sx={{ margin: 1 }}>
                Edit Season
            </Typography>
            <Box
                component="form"
                onSubmit={handleSave}
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <Card
                    sx={{
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "800px",
                        width: "100%",
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {formInputs}
                        <Button variant="contained" type="submit">
                            Save Season
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
