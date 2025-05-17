import { CreateEventParams, GetEventByIdParams, RecordEventParams, UpdateEventParams } from '../schemas/event.schemas.js'
import { supabase } from '../utils/supabase.js'

const EVENT_TABLE_NAME = 'timeclock_event'

export async function getAllEvents() {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .select('*')

    if (error) throw error
    return data
}

export async function getEventById({ params }: GetEventByIdParams) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .select('*')
        .eq('id', params.id)
        .single()

    if (error) throw error
    return data
}

export async function createEvent({ body }: CreateEventParams) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .insert([body])
        .single()

    if (error) throw error
    return data
}

export async function updateEvent({params, body}: UpdateEventParams) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .update(body)
        .eq('id', params.id)
        .maybeSingle()

    if (error) throw error
    return data
}

export async function getLatestForNFCId({ query }: RecordEventParams) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .select('*')
        .eq('nfc_id', query.nfc_id)
        .order('clock_in', { ascending: false })
        .limit(1)

    if (error) throw error
    return data[0]
}