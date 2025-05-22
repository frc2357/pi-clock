interface UserRole {
    id: number
    description: string
}

interface UserProfile {
    id: number
    user_uid: string
    user_role_id: number
    display_name: string
    nfc_id: string
    show_realtime_clockins: boolean
}

interface RawTimeclockEvent {
    id: number
    nfc_id: string
    clock_in: string | null
    clock_out: string | null
}

interface TimeclockEvent extends RawTimeclockEvent {
    clock_in: Date | null
    clock_out: Date | null
}

interface UserEndpointResponse extends UserProfile {
    user_role: UserRole
}

interface RawUserEventsEndpointResponse extends UserEndpointResponse {
    timeclock_event: RawTimeclockEvent[]
}

interface UserEventsEndpointResponse extends RawUserEventsEndpointResponse {
    timeclock_event: TimeclockEvent[]
}