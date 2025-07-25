import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const DISPLAY_TIME = 5000; // 5 seconds

export default function BasicModal() {
    const latestEvent = useQuery(api.timeclock_event.latestEventWithMember);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (latestEvent) {
            const now = Date.now();
            const updatedAt = latestEvent.clock_out ?? latestEvent.clock_in;
            if (!!updatedAt && now - updatedAt < DISPLAY_TIME) {
                // If event was updated within the DISPLAY_TIME, show the modal
                setOpen(true);
                // In DISPLAY_TIME millis, close the modal
                setTimeout(() => {
                    setOpen(false);
                }, DISPLAY_TIME);
            }
        } else {
            setOpen(false);
        }
    }, [latestEvent]);

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        height: 250,
                        bgcolor: "background.paper",
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: 5,
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        alignItems: "center",
                    }}
                >
                    <Typography id="modal-modal-title" variant="h4">
                        {latestEvent?.clock_out
                            ? "New Clock Out"
                            : "New Clock In"}
                    </Typography>
                    <Typography variant="h5">
                        {latestEvent?.member?.display_name}
                    </Typography>
                    <Typography variant="h6">
                        {new Date(
                            (latestEvent?.clock_out ?? latestEvent?.clock_in)!
                        ).toLocaleString()}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
