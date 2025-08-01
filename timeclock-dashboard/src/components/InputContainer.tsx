import { Box } from "@mui/material";
import React from "react";

interface InputContainerProps {
    label: string;
    children: React.ReactNode;
}

export default function InputContainer({
    label,
    children,
}: InputContainerProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
            }}
        >
            <label>{label}</label>
            {children}
        </Box>
    );
}
