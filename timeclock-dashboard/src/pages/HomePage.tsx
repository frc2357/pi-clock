import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import MemberStatusChip from "../components/MemberStatusChip";
import RealtimeClockinModal from "../components/RealtimeClockinModal";
import useCustomStyles from "../useCustomStyles";

export default function HomePage() {
    const { pagePadding, tableSize } = useCustomStyles();

    const teamMembers = useQuery(api.team_member.list);
    const navigate = useNavigate();

    return (
        <Box sx={pagePadding}>
            <Typography variant="h3" sx={{ padding: pagePadding.padding }}>
                Team Dashboard
            </Typography>
            <RealtimeClockinModal />
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <TableContainer>
                        <Table size={tableSize}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "30%" }}>
                                        Team Member
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ width: "20%" }}
                                    >
                                        Total Hours
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ width: "25%" }}
                                    >
                                        Last Clock In
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ width: "20%" }}
                                    >
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teamMembers?.map((member) => (
                                    <TableRow
                                        onClick={() =>
                                            navigate(`/member/${member._id}`)
                                        }
                                        hover={true}
                                        key={member._id}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell>
                                            {member.display_name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {member.total_hours}
                                        </TableCell>
                                        <TableCell align="right">
                                            {member.latest_event?.clock_in
                                                ? format(
                                                      new Date(
                                                          member.latest_event.clock_in
                                                      ),
                                                      "MM/dd/yy HH:MM"
                                                  )
                                                : "Never"}
                                        </TableCell>
                                        <TableCell align="right">
                                            <MemberStatusChip
                                                active={member.active}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}
