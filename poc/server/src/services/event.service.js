import { supabase } from '../utils/supabase.js'

const EVENT_TABLE_NAME = 'timeclock_event'

export async function getAllEvents() {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .select('*')

    if (error) throw error
    return data
}

export async function getEventById(id) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function createEvent(event) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .insert([event])
        .single()

    if (error) throw error
    return data
}

export async function updateEvent(id, updates) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .maybeSingle()

    if (error) throw error
    return data
}

export async function getLatestForNFCId(nfc_id) {
    const { data, error } = await supabase
        .from(EVENT_TABLE_NAME)
        .select('*')
        .eq('nfc_id', nfc_id)
        .order('clock_in', { ascending: false })
        .limit(1)

    if (error) throw error
    return data[0]
}