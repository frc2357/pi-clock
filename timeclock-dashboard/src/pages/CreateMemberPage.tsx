import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import InputContainer from "../components/InputContainer";
import useCustomStyles from "../useCustomStyles";

const defaultMemberData = {
    user_id: "" as Id<"users">,
    display_name: "",
    nfc_id: "",
    is_student: false,
    is_admin: false,
    show_realtime_clockins: false,
};

export default function CreateUserPage() {
    const { pagePadding } = useCustomStyles();

    const memberlessUsers = useQuery(api.auth.getUsersWithoutMember);
    const [formData, setFormData] = useState({ ...defaultMemberData });

    const createMember = useMutation(api.team_member.createMember);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createMember(formData);
        setFormData({ ...defaultMemberData });
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
                        <InputContainer label="Display Name *">
                            <TextField
                                name="display_name"
                                value={formData.display_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        display_name: e.target.value,
                                    })
                                }
                                required
                            />
                        </InputContainer>
                        <InputContainer label="User *">
                            <Select
                                name="user_id"
                                value={formData.user_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        user_id: e.target.value as Id<"users">,
                                    })
                                }
                                required
                            >
                                {memberlessUsers?.map((user) => (
                                    <MenuItem value={user._id}>
                                        {user.email}
                                    </MenuItem>
                                ))}
                            </Select>
                        </InputContainer>
                        <InputContainer label="NFC ID *">
                            <TextField
                                name="nfc_id"
                                value={formData.nfc_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nfc_id: e.target.value,
                                    })
                                }
                                required
                            />
                        </InputContainer>
                        <FormControlLabel
                            label="Is Student"
                            control={
                                <Checkbox
                                    checked={formData.is_student}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_student: e.target.checked,
                                        })
                                    }
                                />
                            }
                        />
                        <FormControlLabel
                            label="Is Admin"
                            control={
                                <Checkbox
                                    checked={formData.is_admin}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_admin: e.target.checked,
                                        })
                                    }
                                />
                            }
                        />
                        <FormControlLabel
                            label="Show Realtime Clockins"
                            control={
                                <Checkbox
                                    checked={formData.show_realtime_clockins}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            show_realtime_clockins:
                                                e.target.checked,
                                        })
                                    }
                                />
                            }
                        />
                        <Button variant="contained" type="submit">
                            Create Member
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
