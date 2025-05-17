import { GetUserByIdParams, CreateUserParams, UpdateUserParams } from '../schemas/user.schemas.js'
import { supabase } from '../utils/supabase.js'

const USER_TABLE_NAME = 'user_profile'
const SELECT_USER_STATEMENT = `
    *,
    user_role ( * )
`

export async function getAllUsers() {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_STATEMENT)

    if (error) throw error
    return data
}

export async function getUserById({ params }: GetUserByIdParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_STATEMENT)
        .eq('id', params.id)
        .single()

    if (error) throw error
    return data
}

// TODO: Make general getUserByInput route/controller/service that uses query params
export async function getUserByNfcId(nfc_id: string) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .select(SELECT_USER_STATEMENT)
        .eq('nfc_id', nfc_id)
        .single()

    if (error) throw error
    return data
}

export async function createUser({ body }: CreateUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .insert([body])
        .single()

    if (error) throw error
    return data
}

export async function updateUser({params, body}: UpdateUserParams) {
    const { data, error } = await supabase
        .from(USER_TABLE_NAME)
        .update(body)
        .eq('id', params.id)
        .maybeSingle()

    if (error) throw error
    return data
}