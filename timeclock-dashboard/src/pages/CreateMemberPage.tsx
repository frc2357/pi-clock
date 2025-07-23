import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useQuery, useMutation } from "convex/react";
import { useState, FormEvent } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function CreateUserPage() {
    const memberlessUsers = useQuery(api.auth.getUsersWithoutMember);
    const [formData, setFormData] = useState({
        user_id: "" as Id<"users">,
        nfc_id: "",
        is_student: false,
        is_admin: false,
        show_realtime_clockins: false,
    });

    const createMember = useMutation(api.team_member.createMember);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createMember(formData);
    };

    return (
        <Box sx={{ paddingY: 8, height: "100%", width: "100%" }}>
            <Typography variant="h3" sx={{ margin: 5 }}>
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
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 3,
                        borderRadius: 3,
                        width: "50%",
                        minWidth: 350,
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                        }}
                    >
                        <label>User *</label>
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
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                        }}
                    >
                        <label>NFC ID *</label>
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
                    </Box>
                    <FormControlLabel
                        label="Is Student"
                        control={
                            <Checkbox
                                value={formData.is_student}
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
                                value={formData.is_admin}
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
                                value={formData.show_realtime_clockins}
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
                </Paper>
            </Box>
        </Box>
    );
}
