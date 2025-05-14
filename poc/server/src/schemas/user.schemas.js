import { z } from 'zod';

const fields = {
    id: z.coerce.number().int(),
    user_uid: z.string().uuid(),
    user_role_id: z.coerce.number().int(),
    nfc_id: z.string(),
    show_realtime_clockins: z.boolean().default(false),
}

export const getUserById = z.object({
    params: z.object({
        id: fields.id
    })
})

export const createUser = z.object({
    body: z.object({
        user_role_id: fields.user_role_id,
        nfc_id: fields.nfc_id,
        show_realtime_clockins: fields.show_realtime_clockins,
    })
})

export const updateUser = z.object({
    params: z.object({
        id: fields.id
    }),
    body: z.object({
        user_uid: fields.user_uid.optional(),
        user_role_id: fields.user_role_id.optional(),
        nfc_id: fields.nfc_id.optional(),
        show_realtime_clockins: fields.show_realtime_clockins.optional(),
    })
})