import {
    Box,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import MemberStatusChip from "../components/MemberStatusChip";
import useCustomStyles from "../useCustomStyles";
import { ReactNode, useMemo, useState } from "react";
import { FunctionReturnType } from "convex/server";
import { useSeasonStore } from "@/store/season";

type MemberType = FunctionReturnType<typeof api.team_member.getMember>;

const tableHeaders: {
    id: string;
    label: string;
    align: TableCellProps["align"];
    width: string;
    render: (member: MemberType) => ReactNode;
}[] = [
    {
        id: "display_name",
        label: "Team Member",
        align: "left",
        width: "30%",
        render: (member: MemberType) => member?.display_name,
    },
    {
        id: "total_hours",
        label: "Total Hours",
        align: "right",
        width: "15%",
        render: (member: MemberType) => member?.total_hours?.toFixed(2),
    },
    {
        id: "latest_clock_in",
        label: "Last Clock In",
        align: "right",
        width: "30%",
        render: (member: MemberType) =>
            member?.latest_event?.clock_in
                ? format(
                      new Date(member.latest_event.clock_in),
                      "MM/dd/yy HH:mm"
                  )
                : "Never",
    },
    {
        id: "active",
        label: "Status",
        align: "right",
        width: "25%",
        render: (member: MemberType) => (
            <MemberStatusChip active={member?.active || false} />
        ),
    },
];

export default function HomePage() {
    const { pagePadding, tableSize } = useCustomStyles();

    const { selectedSeasonId: season_id } = useSeasonStore();

    const [showDeactivatedUsers, setShowDeactivatedUsers] = useState(false);
    const [direction, setDirection] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof MemberType>(
        "display_name" as keyof MemberType
    );

    const teamMembers = useQuery(api.team_member.list, { season_id });
    const navigate = useNavigate();

    const handleSortRequest = (property: keyof MemberType) => {
        const isAsc = orderBy === property && direction === "desc";
        setDirection(isAsc ? "asc" : "desc");
        setOrderBy(property);
    };

    const sortedMembers = useMemo(() => {
        return (
            teamMembers &&
            [...teamMembers]
                .sort((a: MemberType, b: MemberType) => {
                    if (!a) return 1;
                    if (!b) return -1;
                    if (direction === "asc") {
                        return a[orderBy] > b[orderBy] ? 1 : -1;
                    } else {
                        return a[orderBy] < b[orderBy] ? 1 : -1;
                    }
                })
                .filter(
                    (member) =>
                        showDeactivatedUsers || member.deleted_at === undefined
                )
        );
    }, [teamMembers, orderBy, direction, showDeactivatedUsers]);

    return (
        <Box sx={pagePadding}>
            <Typography variant="h3" sx={{ padding: pagePadding.padding }}>
                Member Dashboard
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <Card
                    sx={{ borderRadius: 3, maxWidth: "1200px", width: "100%" }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: "center",
                            }}
                        >
                            <FormControlLabel
                                label="Show Deactivated Users"
                                labelPlacement="start"
                                control={
                                    <Checkbox
                                        checked={showDeactivatedUsers}
                                        onChange={() =>
                                            setShowDeactivatedUsers(
                                                !showDeactivatedUsers
                                            )
                                        }
                                    />
                                }
                            />
                        </Box>
                        <TableContainer>
                            <Table
                                size={tableSize}
                                sx={{ tableLayout: "fixed", width: "100%" }}
                            >
                                <TableHead>
                                    <TableRow>
                                        {tableHeaders.map((header) => (
                                            <TableCell
                                                key={header.id}
                                                align={
                                                    header.align as TableCellProps["align"]
                                                }
                                                sx={{ width: header.width }}
                                            >
                                                <TableSortLabel
                                                    active={
                                                        orderBy === header.id
                                                    }
                                                    direction={
                                                        orderBy === header.id
                                                            ? direction
                                                            : "asc"
                                                    }
                                                    onClick={() =>
                                                        handleSortRequest(
                                                            header.id as keyof MemberType
                                                        )
                                                    }
                                                >
                                                    {header.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedMembers?.map((member) => (
                                        <TableRow
                                            onClick={() =>
                                                navigate(
                                                    `/member/${member._id}`
                                                )
                                            }
                                            hover={true}
                                            key={member._id}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            {tableHeaders.map((header) => (
                                                <TableCell
                                                    key={header.id}
                                                    align={header.align}
                                                    sx={{ width: header.width }}
                                                >
                                                    {header.render(member)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
