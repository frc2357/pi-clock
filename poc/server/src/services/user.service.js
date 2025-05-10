import { supabase } from '../utils/supabase.js'

const USER_TABLE_NAME = 'user'

export async function getAllUsers() {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select('*')

    if (error) throw error
    return data
}

export async function getUserById(id) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function createUser(user) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .insert([user])
        .single()

    if (error) throw error
    return data
}

export async function updateUser(id, updates) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}