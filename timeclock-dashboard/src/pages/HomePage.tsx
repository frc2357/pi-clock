import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import MemberStatusChip from "../components/MemberStatusChip";
import RealtimeClockinModal from "../components/RealtimeClockinModal";

export default function HomePage() {
    const teamMembers = useQuery(api.team_member.list);
    const navigate = useNavigate();

    return (
        <Box sx={{ paddingTop: 8, height: "100%" }}>
            <Typography variant="h3" sx={{ margin: 5 }}>
                Team Dashboard
            </Typography>
            <RealtimeClockinModal />
            <Paper sx={{ width: "auto", marginX: 10 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "40%" }}>
                                    Team Member
                                </TableCell>
                                <TableCell align="right" sx={{ width: "20%" }}>
                                    Total Hours
                                </TableCell>
                                <TableCell align="right" sx={{ width: "20%" }}>
                                    Last Clock In
                                </TableCell>
                                <TableCell align="right" sx={{ width: "20%" }}>
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
                                    <TableCell>{member.display_name}</TableCell>
                                    <TableCell align="right">
                                        {member.total_hours}
                                    </TableCell>
                                    <TableCell align="right">
                                        {member.latest_event?.clock_in
                                            ? new Date(
                                                  member.latest_event.clock_in
                                              ).toLocaleString()
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
            </Paper>
        </Box>
    );
}
