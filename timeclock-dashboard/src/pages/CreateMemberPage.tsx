import useMemberForm from "@/hooks/useMemberForm";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useMutation } from "convex/react";
import { FormEvent } from "react";
import { api } from "../../convex/_generated/api";
import useCustomStyles from "../useCustomStyles";

export default function CreateUserPage() {
    const { pagePadding } = useCustomStyles();

    const { formInputs, formData, clearForm } = useMemberForm();

    const createMember = useMutation(api.team_member.createMember);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { users, ...rest } = formData;
        const user_ids = users.map((user) => user._id);
        await createMember({ user_ids, ...rest });
        clearForm();
    };

    return (
        <Box sx={{ ...pagePadding, height: "100%", width: "100%" }}>
            <Typography variant="h3" sx={{ margin: 1 }}>
                Create Member
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
                            Create Member
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
