import useMemberForm, {
    defaultMemberData,
    formDataType,
} from "@/hooks/useMemberForm";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import InputContainer from "./InputContainer";
import MemberStatusChip from "./MemberStatusChip";

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

    const { display_name, nfc_id, is_student, is_admin, users } = member || {};
    const memberData = member
        ? ({
              display_name,
              nfc_id,
              is_student,
              is_admin,
              users,
          } as formDataType)
        : defaultMemberData;

    const [isEditing, setIsEditing] = useState(false);
    const { formInputs, formData, clearForm } = useMemberForm(
        memberData,
        !isEditing
    );

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
        clearForm();
        setIsEditing(true);
    };

    const handleToggleMemberActivation = () => {
        toggleMemberActivation({ member_id: member._id });
    };

    const handleSave = async () => {
        try {
            const { users, ...otherFormData } = formData;
            await updateMember({
                member_id: member._id,
                user_ids: users.map((u) => u._id),
                ...otherFormData,
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
                                            disabled={
                                                member._id ===
                                                loggedInMember._id
                                            }
                                        >
                                            {member.deleted_at
                                                ? "Reactivate"
                                                : "Deactivate"}
                                        </Button>
                                    </Box>
                                ))}
                        </Box>
                        {formInputs}
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
