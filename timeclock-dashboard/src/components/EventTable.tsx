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
import { format } from "date-fns";
import useCustomStyles from "../useCustomStyles";

export default function EventTable({
    events,
}: {
    events: FunctionReturnType<typeof api.timeclock_event.list>;
}) {
    const { tableSize } = useCustomStyles();

    return (
        <TableContainer>
            <Table size={tableSize}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "25%" }}>Member</TableCell>
                        <TableCell sx={{ width: "25%" }}>Clock In</TableCell>
                        <TableCell sx={{ width: "25%" }}>Clock Out</TableCell>
                        <TableCell sx={{ width: "25%" }}>Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events?.map((event) => (
                        <TableRow hover={true} key={event._id}>
                            <TableCell>{event.member?.display_name}</TableCell>
                            <TableCell>
                                {event.clock_in
                                    ? format(
                                          new Date(event.clock_in),
                                          "MM/dd/yy HH:mm"
                                      )
                                    : "--"}
                            </TableCell>
                            <TableCell>
                                {event.clock_out
                                    ? format(
                                          new Date(event.clock_out),
                                          "MM/dd/yy HH:mm"
                                      )
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
