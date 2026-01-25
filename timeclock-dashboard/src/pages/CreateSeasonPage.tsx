import useSeasonForm from "@/hooks/useSeasonForm";
import useCustomStyles from "@/useCustomStyles";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function CreateSeasonPage() {
    const { pagePadding } = useCustomStyles();

    const { formInputs, formData } = useSeasonForm();

    const createSeason = useMutation(api.frc_season.createSeason);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createSeason(formData);
            toast.success("Season created successfully");
        } catch {
            toast.error("Failed to create season");
        }
    };

    return (
        <Box sx={{ ...pagePadding, height: "100%", width: "100%" }}>
            <Typography variant="h3" sx={{ margin: 1 }}>
                Create Season
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
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
                            Create Season
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
