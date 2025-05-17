import { z } from 'zod';

const fields = {
  id: z.coerce.number().int(),
  nfc_id: z.string().min(1).max(64),
  clock_in: z.string().datetime({ offset: true }).nullable(),
  clock_out: z.string().datetime({ offset: true }).nullable(),
};

const baseEventFields = {
  nfc_id: fields.nfc_id,
  clock_in: fields.clock_in,
  clock_out: fields.clock_out,
};

const partialEventFields = {
  nfc_id: fields.nfc_id.optional(),
  clock_in: fields.clock_in.optional(),
  clock_out: fields.clock_out.optional(),
};

export const getEventById = z.object({
  params: z.object({ id: fields.id }),
});

export const createEvent = z.object({
  body: z.object(baseEventFields),
});

export const updateEvent = z.object({
  params: z.object({ id: fields.id }),
  body: z.object(partialEventFields),
});

export const recordEvent = z.object({
  query: z.object({ nfc_id: fields.nfc_id }),
});

// Optional type exports for controllers/services
export type GetEventByIdParams = z.infer<typeof getEventById>;
export type CreateEventParams = z.infer<typeof createEvent>;
export type UpdateEventParams = z.infer<typeof updateEvent>;
export type RecordEventParams = z.infer<typeof recordEvent>;