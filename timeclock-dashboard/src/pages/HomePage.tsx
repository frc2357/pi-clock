import {
    Box,
    Chip,
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
import { api } from "../../convex/_generated/api";
import RealtimeClockinModal from "../components/RealtimeClockinModal";
import { useNavigate } from "react-router-dom";

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
                                        <Chip
                                            sx={{ width: 150 }}
                                            label={
                                                member.active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            color={
                                                member.active
                                                    ? "success"
                                                    : undefined
                                            }
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
