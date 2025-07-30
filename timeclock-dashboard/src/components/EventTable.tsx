import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";

export default function EventTable({
    events,
}: {
    events: FunctionReturnType<typeof api.timeclock_event.list>;
}) {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "34%" }}>Member</TableCell>
                        <TableCell sx={{ width: "22%" }}>Clock In</TableCell>
                        <TableCell sx={{ width: "22%" }}>Clock Out</TableCell>
                        <TableCell sx={{ width: "22%" }}>Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events?.map((event) => (
                        <TableRow hover={true} key={event._id}>
                            <TableCell>{event.member?.display_name}</TableCell>
                            <TableCell>
                                {event.clock_in
                                    ? new Date(event.clock_in).toLocaleString()
                                    : "--"}
                            </TableCell>
                            <TableCell>
                                {event.clock_out
                                    ? new Date(event.clock_out).toLocaleString()
                                    : "--"}
                            </TableCell>
                            <TableCell>
                                {event.duration_hours ?? "--"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
