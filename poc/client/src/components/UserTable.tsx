import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import axios from 'axios'

const MILLIS_PER_HOUR = 1000 * 60 * 60

const UserTable = () => {
    const today = new Date()
    const [users, setUsers] = useState<UserEventsEndpointResponse[]>([])

    useEffect(() => {
        console.log(import.meta.env.VITE_API_URL)
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/events`)
            .then((response) => {
                const userData = response.data.map((user: RawUserEventsEndpointResponse) => ({
                    ...user,
                    timeclock_event: user.timeclock_event.map((event: RawTimeclockEvent) => ({
                        ...event,
                        clock_in: event.clock_in ? new Date(event.clock_in) : null,
                        clock_out: event.clock_out ? new Date(event.clock_out) : null
                    }))
                }))
                setUsers(userData)
            })
    }, [])

    const getUserTotalHours = (user: UserEventsEndpointResponse) => {
        const events = user.timeclock_event
        console.log(events[0].clock_in)
        const filteredEvents = events.filter(({clock_in}) => clock_in?.getFullYear() === today.getFullYear())
        const totalMillis = filteredEvents.reduce((acc, {clock_in, clock_out}) => {
            return acc + ((clock_in && clock_out) ? clock_out.getTime() - clock_in.getTime() : 0)
        }, 0)
        return (totalMillis / MILLIS_PER_HOUR).toFixed(2)
    }

    const getUserStatusChip = (user: UserEventsEndpointResponse) => {
        const latest_event = user.timeclock_event[0]
        if (
            latest_event.clock_in &&
            !latest_event.clock_out &&
            latest_event.clock_in.toDateString() === today.toDateString()
        ) {
            return <Chip label="Active" color="success"/>
        }

        return <Chip label="Inactive"/>
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Total Hours</TableCell>
                    <TableCell>Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user) => (
                    <TableRow>
                        <TableCell>{user.display_name}</TableCell>
                        <TableCell>{user.user_role.description}</TableCell>
                        <TableCell>{getUserTotalHours(user)}</TableCell>
                        <TableCell>{getUserStatusChip(user)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
};

export default UserTable;
