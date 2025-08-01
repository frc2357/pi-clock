import { Chip } from "@mui/material";

export default function MemberStatusChip({ active }: { active: boolean }) {
    return (
        <Chip
            sx={{ maxWidth: 150, minWidth: 75 }}
            label={active ? "Active" : "Inactive"}
            color={active ? "success" : undefined}
        />
    );
}
