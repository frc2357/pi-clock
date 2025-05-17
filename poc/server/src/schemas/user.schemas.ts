import { z } from 'zod';

const fields = {
    id: z.coerce.number().int(),
    user_uid: z.string().uuid(),
    user_role_id: z.coerce.number().int(),
    nfc_id: z.string(),
    show_realtime_clockins: z.boolean().default(false),
}

const baseUserFields = {
    user_uid: fields.user_uid,
    user_role_id: fields.user_role_id,
    nfc_id: fields.nfc_id,
    show_relatime_clockins: fields.show_realtime_clockins
}

const partialUserFields = {
    user_uid: fields.user_uid,
    user_role_id: fields.user_role_id,
    nfc_id: fields.nfc_id,
    show_relatime_clockins: fields.show_realtime_clockins
}

export const getUserById = z.object({
    params: z.object({ id: fields.id })
})

export const createUser = z.object({
    body: z.object(baseUserFields)
})

export const updateUser = z.object({
    params: z.object({ id: fields.id }),
    body: z.object(partialUserFields)
})

export type GetUserByIdParams = z.infer<typeof getUserById>
export type CreateUserParams = z.infer<typeof createUser>
export type UpdateUserParams = z.infer<typeof updateUser>