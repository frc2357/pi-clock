import InputContainer from "@/components/InputContainer";
import {
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useQuery } from "convex/react";
import { WithoutSystemFields } from "convex/server";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

export type formDataType = WithoutSystemFields<Doc<"team_member">> & {
    users: Doc<"users">[];
};

export const defaultMemberData: formDataType = {
    display_name: "",
    nfc_id: "",
    users: [] as Doc<"users">[],
    is_student: false,
    is_admin: false,
};

export default function useMemberForm(
    memberData: formDataType = defaultMemberData,
    disabled: boolean = false
) {
    const [formData, setFormData] = useState({ ...memberData });

    const clearForm = () => setFormData({ ...memberData });

    const memberlessUsers = useQuery(api.auth.getUsersWithoutMember) || [];

    const allUsers = [
        ...new Set([...memberData.users, ...memberlessUsers]),
    ].filter((u): u is NonNullable<typeof u> => u != null);
    const userMap = Object.fromEntries(allUsers.map((u) => [u._id, u]));

    const formInputs = (
        <>
            <InputContainer label="Display Name">
                <TextField
                    name="display_name"
                    value={formData.display_name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            display_name: e.target.value,
                        })
                    }
                    disabled={disabled}
                    size="small"
                    required
                />
            </InputContainer>
            <InputContainer label="Users">
                <Select
                    name="users"
                    value={formData.users.map((u) => u._id)}
                    onChange={(e) => {
                        const userIds = e.target.value as Id<"users">[];
                        setFormData({
                            ...formData,
                            users: userIds
                                ?.map(
                                    (user_id: Id<"users">) => userMap[user_id]
                                )
                                .filter(
                                    (u): u is NonNullable<typeof u> => u != null
                                ),
                        });
                    }}
                    disabled={disabled}
                    size="small"
                    multiple
                >
                    {allUsers?.map((user) => (
                        <MenuItem value={user!._id}>{user!.email}</MenuItem>
                    ))}
                </Select>
            </InputContainer>
            <InputContainer label="NFC ID">
                <TextField
                    name="nfc_id"
                    value={formData.nfc_id}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            nfc_id: e.target.value,
                        })
                    }
                    disabled={disabled}
                    size="small"
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
                disabled={disabled}
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
                disabled={disabled}
            />
        </>
    );

    return {
        formInputs,
        formData,
        clearForm,
    };
}
