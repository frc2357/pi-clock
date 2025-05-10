import { z } from 'zod';

const fields = {
    id: z.coerce.number().int(),
    nfc_id: z.string(),
    email: z.string(),
    display_name: z.string(),
    profile_pic_url: z.string()
}

export const getUserById = z.object({
    params: z.object({
        id: fields.id
    })
})

export const createUser = z.object({
    body: z.object({
        nfc_id: fields.nfc_id,
        email: fields.email,
        display_name: fields.display_name.nullable(),
        profile_pic_url: fields.profile_pic_url.nullable()
    })
})

export const updateUser = z.object({
    params: z.object({
        id: fields.id
    }),
    body: z.object({
        nfc_id: fields.nfc_id.optional(),
        email: fields.email.optional(),
        display_name: fields.display_name.nullable().optional(),
        profile_pic_url: fields.profile_pic_url.nullable().optional()
    })
})