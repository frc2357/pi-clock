import { CreateUserParams, UpdateUserParams, GetSingleUserParams } from '../schemas/user.schemas.js'
import { supabase } from '../utils/supabase.js'

const USER_TABLE_NAME = 'user_profile'
const SELECT_USER_STATEMENT = `
    *,
    user_role ( * )
`
const SELECT_USER_AND_EVENTS_STATEMENT = `
    *,
    user_role ( * ),
    timeclock_event ( * )
`

export async function getAllUsers() {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_STATEMENT)

    if (error) throw error
    return data
}

export async function getAllUserEvents() {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_AND_EVENTS_STATEMENT)
        .order('clock_in', { ascending: false, referencedTable: 'timeclock_event' })
    
    if (error) throw error
    return data
}

export async function getUserById({ query }: GetSingleUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_STATEMENT)
        .eq('id', query.id)
        .single()

    if (error) throw error
    return data
}

export async function getUserByNfcId({ query }: GetSingleUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_STATEMENT)
        .eq('nfc_id', query.nfc_id)
        .single()

    if (error) throw error
    return data
}

export async function getUserEventsById({ query }: GetSingleUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_AND_EVENTS_STATEMENT)
        .order('clock_in', { ascending: false, referencedTable: 'timeclock_event' })
        .eq('id', query.id)

    if (error) throw error
    return data
}

export async function getUserEventsByNfcId({ query }: GetSingleUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_AND_EVENTS_STATEMENT)
        .eq('id', query.nfc_id)

    if (error) throw error
    return data
}

export async function createUser({ body }: CreateUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .insert([body])
        .select()

    if (error) throw error
    return data
}

export async function updateUser({params, body}: UpdateUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .update(body)
        .eq('id', params.id)
        .select()

    if (error) throw error
    return data
}