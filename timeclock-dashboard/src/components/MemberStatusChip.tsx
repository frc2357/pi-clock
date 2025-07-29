import { Chip } from "@mui/material";

export default function MemberStatusChip({ active }: { active: boolean }) {
    return (
        <Chip
            sx={{ width: 150 }}
            label={active ? "Active" : "Inactive"}
            color={active ? "success" : undefined}
        />
    );
}
