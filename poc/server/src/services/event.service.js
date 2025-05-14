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
        .single()

    if (error) throw error
    return data
}