import { z } from 'zod';

const fields = {
    id: z.coerce.number().int(),
    user_id: z.coerce.number().int(),
    clock_in: z.string().datetime().nullable(),
    clock_out: z.string().datetime().nullable(),
}

export const getEventById = z.object({
    params: z.object({
        id: fields.id
    })
})

export const createEvent = z.object({
    body: z.object({
        user_id: fields.user_id,
        clock_in: fields.clock_in,
        clock_out: fields.clock_in,
    })
})

export const updateEvent = z.object({
    params: z.object({
        id: fields.id
    }),
    body: z.object({
        user_id: fields.user_id.optional(),
        clock_in: fields.clock_in.optional(),
        clock_out: fields.clock_in.optional(),
    })
})