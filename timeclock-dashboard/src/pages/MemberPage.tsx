import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function MemberPage() {
    const { member_id } = useParams();
    const member = useQuery(api.team_member.getMember, {
        member_id: member_id as Id<"team_member">,
    });

    return (
        <Box sx={{ paddingY: 8, height: "100%", width: "100%" }}>
            {member === undefined ? (
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress size={100} />
                </Box>
            ) : member === null ? (
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography align="center" variant="h5">
                        Member not found
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography variant="h3" sx={{ margin: 5 }}>
                        {member.display_name}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        temp
                    </Box>
                </>
            )}
        </Box>
    );
}
