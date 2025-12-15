import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
    Box,
    Button,
    ClickAwayListener,
    Paper,
    Popper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    gridClasses,
    GridColDef,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    Toolbar,
    ToolbarButton,
} from "@mui/x-data-grid";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface CustomToolbarProps {
    member_id: Id<"team_member">;
}

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        member_id: Id<"team_member">;
    }
}

function CustomToolbar({ member_id }: CustomToolbarProps) {
    const createEvent = useMutation(api.timeclock_event.createEvent);

    const [panelOpen, setPanelOpen] = useState(false);
    const panelTriggerButtonRef = useRef<HTMLButtonElement>(null);

    const handleClose = () => {
        setPanelOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            handleClose();
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const clock_in_input = formData.get("clock_in") as string;
        const clock_out_input = formData.get("clock_out") as string;
        const clock_in = !clock_in_input
            ? undefined
            : new Date(clock_in_input).getTime();
        const clock_out = !clock_out_input
            ? undefined
            : new Date(clock_out_input).getTime();

        if (!member_id) {
            createEvent({
                member_id: formData.get("member_id") as Id<"team_member">,
                clock_in,
                clock_out,
            });
        } else {
            createEvent({
                member_id,
                clock_in,
                clock_out,
            });
        }

        handleClose();
    };

    return (
        <Toolbar>
            <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
                Timeclock Events
            </Typography>

            <Tooltip title="Add new event">
                <ToolbarButton
                    ref={panelTriggerButtonRef}
                    aria-describedby="new-panel"
                    onClick={() => setPanelOpen((prev) => !prev)}
                >
                    <AddIcon fontSize="small" />
                </ToolbarButton>
            </Tooltip>

            <Popper
                open={panelOpen}
                anchorEl={panelTriggerButtonRef.current}
                placement="bottom-end"
                id="new-panel"
                onKeyDown={handleKeyDown}
            >
                <ClickAwayListener
                    onClickAway={handleClose}
                    mouseEvent="onMouseDown"
                >
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: 300,
                            p: 2,
                        }}
                        elevation={8}
                    >
                        <Typography fontWeight="bold">Add new event</Typography>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Clock In"
                                    type="datetime-local"
                                    name="clock_in"
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                                <TextField
                                    label="Clock Out"
                                    type="datetime-local"
                                    name="clock_out"
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    Add Event
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Toolbar>
    );
}

interface EventTableProps {
    events: FunctionReturnType<typeof api.timeclock_event.list>;
    member_id?: Id<"team_member">;
}

export default function EventTable({ events, member_id }: EventTableProps) {
    const updateEvent = useMutation(api.timeclock_event.updateEvent);
    const deleteEvent = useMutation(api.timeclock_event.deleteEvent);

    const loggedInMember = useQuery(api.team_member.getLoggedInMember, {});

    const rows = events?.map((event) => ({
        id: event._id,

        clock_in: event.clock_in ? new Date(event.clock_in) : null,
        clock_out: event.clock_out ? new Date(event.clock_out) : null,
        duration: event.duration_hours,

        ...(!member_id ? { member: event.member?.display_name ?? "--" } : {}),
    }));

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel((old) => ({
            ...old,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((old) => ({
            ...old,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        deleteEvent({ id: id as Id<"timeclock_event"> });
        setRowModesModel((old) => ({
            ...old,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel((old) => ({
            ...old,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        await updateEvent({
            id: newRow.id,
            clock_in: newRow.clock_in.getTime() ?? null,
            clock_out: newRow.clock_out.getTime() ?? null,
        });

        return newRow;
    };

    const columns: GridColDef[] = [
        {
            field: "clockIn",
            headerName: "Clock In",
            type: "dateTime",
            flex: 1,
            editable: loggedInMember?.is_admin,
            valueGetter: (_value, row) => row.clock_in,
            valueSetter: (value, row) => {
                return {
                    ...row,
                    clock_in: value,
                };
            },
            valueFormatter: (params) =>
                params ? format(params, "MM/dd/yy HH:mm") : "--",
        },
        {
            field: "clockOut",
            headerName: "Clock Out",
            type: "dateTime",
            flex: 1,
            editable: loggedInMember?.is_admin,
            valueGetter: (_value, row) => row.clock_out,
            valueSetter: (value, row) => {
                return {
                    ...row,
                    clock_out: value,
                };
            },
            valueFormatter: (params) =>
                params ? format(params, "MM/dd/yy HH:mm") : "--",
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 1,
            editable: false,
            valueFormatter: (params: number) =>
                params != null ? params.toFixed(3) : "--",
        },
        ...((loggedInMember?.is_admin
            ? [
                  {
                      field: "actions",
                      headerName: "Actions",
                      type: "actions",
                      getActions: (params) => {
                          const isEditing =
                              rowModesModel[params.id]?.mode ===
                              GridRowModes.Edit;

                          if (isEditing) {
                              return [
                                  <GridActionsCellItem
                                      label="save"
                                      icon={<SaveIcon />}
                                      onClick={handleSaveClick(
                                          params.id as string
                                      )}
                                      showInMenu={false}
                                  />,
                                  <GridActionsCellItem
                                      label="cancel"
                                      icon={<CancelIcon />}
                                      onClick={handleCancelClick(
                                          params.id as string
                                      )}
                                      showInMenu={false}
                                  />,
                              ];
                          }

                          return [
                              <GridActionsCellItem
                                  label="edit"
                                  icon={<EditIcon />}
                                  onClick={handleEditClick(params.id as string)}
                                  showInMenu={false}
                              />,
                              <GridActionsCellItem
                                  label="delete"
                                  icon={<DeleteIcon />}
                                  onClick={handleDeleteClick(
                                      params.id as string
                                  )}
                                  showInMenu={false}
                              />,
                          ];
                      },
                  },
              ]
            : []) as GridColDef[]),
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(err) => console.error(err)}
                disableRowSelectionOnClick
                editMode="row"
                slots={{ toolbar: CustomToolbar }}
                slotProps={{ toolbar: { member_id } }}
                showToolbar={loggedInMember?.is_admin || false}
                hideFooter
                disableColumnMenu
                sx={{
                    // Override the default cell style for text wrapping
                    [`& .${gridClasses.cell}`]: {
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        lineHeight: "normal",
                        display: "flex",
                        alignItems: "center",
                    },
                }}
            />
        </Box>
    );
}
