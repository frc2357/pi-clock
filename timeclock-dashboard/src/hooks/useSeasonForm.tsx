import InputContainer from "@/components/InputContainer";
import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { WithoutSystemFields } from "convex/server";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export type formDataType = WithoutSystemFields<Doc<"frc_season">>;

export const defaultSeasonData: formDataType = {
    name: "",
    start_date: new Date().valueOf(),
    end_date: new Date().valueOf(),
    meeting_schedule: [],
    canceled_meetings: [],
};

export default function useSeasonForm() {
    const [formData, setFormData] = useState(defaultSeasonData);

    const numberToTime = (value: number): string => {
        const str = value.toString().padStart(4, "0");
        return `${str.slice(0, 2)}:${str.slice(2)}`;
    };

    const formInputs = (
        <>
            <InputContainer label="Season Name">
                <TextField
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                    size="small"
                    required
                />
            </InputContainer>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["DatePicker"]} sx={{ padding: 0 }}>
                    <InputContainer label="Start Date">
                        <DatePicker
                            name="start_date"
                            value={new Date(formData.start_date)}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    start_date: e?.valueOf() ?? 0,
                                })
                            }
                            slotProps={{
                                textField: { size: "small", required: true },
                            }}
                        />
                    </InputContainer>
                </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["DatePicker"]} sx={{ padding: 0 }}>
                    <InputContainer label="End Date">
                        <DatePicker
                            name="end_date"
                            value={new Date(formData.end_date)}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    end_date: e?.valueOf() ?? 0,
                                })
                            }
                            slotProps={{
                                textField: { size: "small", required: true },
                            }}
                        />
                    </InputContainer>
                </DemoContainer>
            </LocalizationProvider>
            <InputContainer label="Meeting Schedule">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {formData.meeting_schedule?.map((schedule, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                paddingLeft: 1,
                                paddingBottom: 1.5,
                                borderRadius: 1,
                            }}
                        >
                            <Select
                                name="weekday"
                                value={schedule.weekday}
                                onChange={(e) => {
                                    const updated = [
                                        ...(formData.meeting_schedule ?? []),
                                    ];
                                    updated[index].weekday = e.target.value as
                                        | 0
                                        | 1
                                        | 2
                                        | 3
                                        | 4
                                        | 5
                                        | 6;
                                    setFormData({
                                        ...formData,
                                        meeting_schedule: updated,
                                    });
                                }}
                                size="small"
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value={0}>Sunday</MenuItem>
                                <MenuItem value={1}>Monday</MenuItem>
                                <MenuItem value={2}>Tuesday</MenuItem>
                                <MenuItem value={3}>Wednesday</MenuItem>
                                <MenuItem value={4}>Thursday</MenuItem>
                                <MenuItem value={5}>Friday</MenuItem>
                                <MenuItem value={6}>Saturday</MenuItem>
                            </Select>
                            <TextField
                                name="start"
                                type="time"
                                value={numberToTime(schedule.start)}
                                onChange={(e) => {
                                    const updated = [
                                        ...(formData.meeting_schedule ?? []),
                                    ];
                                    updated[index].start =
                                        parseInt(
                                            e.target.value.replace(":", "")
                                        ) || 0;
                                    const { start, end } = updated[index];
                                    updated[index].duration_hours =
                                        end / 100 - start / 100;
                                    setFormData({
                                        ...formData,
                                        meeting_schedule: updated,
                                    });
                                }}
                                size="small"
                            />
                            <TextField
                                name="end"
                                type="time"
                                value={numberToTime(schedule.end)}
                                onChange={(e) => {
                                    const updated = [
                                        ...(formData.meeting_schedule ?? []),
                                    ];
                                    updated[index].end =
                                        parseInt(
                                            e.target.value.replace(":", "")
                                        ) || 0;
                                    const { start, end } = updated[index];
                                    updated[index].duration_hours =
                                        end / 100 - start / 100;
                                    setFormData({
                                        ...formData,
                                        meeting_schedule: updated,
                                    });
                                }}
                                size="small"
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {
                                    const updated =
                                        formData.meeting_schedule?.filter(
                                            (_, i) => i !== index
                                        );
                                    setFormData({
                                        ...formData,
                                        meeting_schedule: updated,
                                    });
                                }}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setFormData({
                                ...formData,
                                meeting_schedule: [
                                    ...(formData.meeting_schedule ?? []),
                                    {
                                        weekday: 1,
                                        start: 0,
                                        end: 0,
                                        duration_hours: 0,
                                    },
                                ],
                            });
                        }}
                    >
                        Add Meeting Schedule
                    </Button>
                </Box>
            </InputContainer>
            <InputContainer label="Canceled Meetings">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {formData.canceled_meetings?.map(
                        (canceled_meeting, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                    paddingLeft: 1,
                                    paddingBottom: 1.5,
                                    borderRadius: 1,
                                }}
                            >
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                >
                                    <DemoContainer
                                        components={["DatePicker"]}
                                        sx={{ padding: 0 }}
                                    >
                                        <InputContainer label="">
                                            <DatePicker
                                                name="date_canceled"
                                                value={
                                                    new Date(
                                                        canceled_meeting.date_canceled
                                                    )
                                                }
                                                onChange={(e) => {
                                                    const updated = [
                                                        ...(formData.canceled_meetings ??
                                                            []),
                                                    ];
                                                    updated[
                                                        index
                                                    ].date_canceled =
                                                        e?.valueOf() ?? 0;
                                                    setFormData({
                                                        ...formData,
                                                        canceled_meetings:
                                                            updated,
                                                    });
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        size: "small",
                                                        required: true,
                                                    },
                                                }}
                                            />
                                        </InputContainer>
                                    </DemoContainer>
                                </LocalizationProvider>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        const updated =
                                            formData.canceled_meetings?.filter(
                                                (_, i) => i !== index
                                            );
                                        setFormData({
                                            ...formData,
                                            canceled_meetings: updated,
                                        });
                                    }}
                                >
                                    Remove
                                </Button>
                            </Box>
                        )
                    )}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setFormData({
                                ...formData,
                                canceled_meetings: [
                                    ...(formData.canceled_meetings ?? []),
                                    { date_canceled: new Date().valueOf() },
                                ],
                            });
                        }}
                    >
                        Add Canceled Meeting
                    </Button>
                </Box>
            </InputContainer>
        </>
    );

    return {
        formInputs,
        formData,
        setFormData,
    };
}
