import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Doc } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType, WithoutSystemFields } from "convex/server";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import InputContainer from "./InputContainer";
import MemberStatusChip from "./MemberStatusChip";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FormData
    extends Omit<WithoutSystemFields<Doc<"team_member">>, "user_id"> {}

export default function MemberEditForm({
    member,
}: {
    member: FunctionReturnType<typeof api.team_member.getMember>;
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const loggedInMember = useQuery(api.team_member.getLoggedInMember, {});
    const updateMember = useMutation(api.team_member.updateMember);
    const toggleMemberActivation = useMutation(
        api.team_member.toggleMemberActivation
    );

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        display_name: "",
        nfc_id: "",
        is_student: false,
        is_admin: false,
        deleted_at: undefined,
    });

    if (!member) {
        return (
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        <CircularProgress size={100} />
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    const handleEdit = () => {
        setFormData({
            display_name: member.display_name || "",
            nfc_id: member.nfc_id || "",
            is_student: member.is_student || false,
            is_admin: member.is_admin || false,
            deleted_at: member.deleted_at || undefined,
        });
        setIsEditing(true);
    };

    const handleToggleMemberActivation = () => {
        toggleMemberActivation({ member_id: member._id });
    };

    const handleSave = async () => {
        try {
            await updateMember({
                member_id: member._id,
                ...formData,
            });
            setIsEditing(false);
            toast.success("Member updated successfully");
        } catch {
            toast.error("Failed to update member");
        }
    };

    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={1.5}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                            }}
                        >
                            <Typography variant="h6">
                                User Information
                            </Typography>
                            {loggedInMember?.is_admin &&
                                (isEditing ? (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={handleSave}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: isMobile
                                                ? "column"
                                                : "row",
                                            alignItems: "end",
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color={
                                                member.deleted_at
                                                    ? "success"
                                                    : "error"
                                            }
                                            size="small"
                                            onClick={
                                                handleToggleMemberActivation
                                            }
                                        >
                                            {member.deleted_at
                                                ? "Reactivate"
                                                : "Deactivate"}
                                        </Button>
                                    </Box>
                                ))}
                        </Box>
                        <InputContainer label="Display Name">
                            <TextField
                                name="display_name"
                                value={
                                    isEditing
                                        ? formData.display_name
                                        : member.display_name
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        display_name: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                size="small"
                                fullWidth
                                required
                            />
                        </InputContainer>
                        <InputContainer label="NFC ID">
                            <TextField
                                name="nfc_id"
                                value={
                                    isEditing ? formData.nfc_id : member.nfc_id
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nfc_id: e.target.value,
                                    })
                                }
                                disabled={!isEditing}
                                size="small"
                                fullWidth
                                required
                            />
                        </InputContainer>
                        <FormControlLabel
                            label="Is Student"
                            control={
                                <Checkbox
                                    checked={
                                        isEditing
                                            ? formData.is_student
                                            : member.is_student
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_student: e.target.checked,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Is Admin"
                            control={
                                <Checkbox
                                    checked={
                                        isEditing
                                            ? formData.is_admin
                                            : member.is_admin
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_admin: e.target.checked,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            }
                        />
                        <InputContainer label="Last Clock In">
                            <Typography variant="h6">
                                {member.latest_event?.clock_in
                                    ? format(
                                          new Date(
                                              member.latest_event?.clock_in
                                          ),
                                          "MM/dd/yy HH:mm"
                                      )
                                    : "--"}
                            </Typography>
                        </InputContainer>
                        <InputContainer label="Status">
                            <MemberStatusChip active={member.active} />
                        </InputContainer>
                        <InputContainer label="Total Hours">
                            <Typography variant="h4" color="primary">
                                {member.total_hours.toFixed(2)}
                            </Typography>
                        </InputContainer>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    );
}
