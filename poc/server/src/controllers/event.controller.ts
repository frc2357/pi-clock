import { Request, Response } from 'express'
import { ZodError } from 'zod'
import * as schemas from '../schemas/event.schemas.js'
import * as eventService from '../services/event.service.js'
import * as userService from '../services/user.service.js'
import { isClockInTimeTooOld } from '../utils/event.utils.js'
import { PostgresError } from 'pg-error-enum'
import ControllerBuilder from '../utils/controller-builder.js'

export const getAllEvents = new ControllerBuilder()
    .calls(eventService.getAllEvents)
    .build()
export const getEventById = new ControllerBuilder()
    .validatesWith(schemas.getEventById)
    .calls(eventService.getEventById)
    .build()
export const createEvent = new ControllerBuilder()
    .validatesWith(schemas.createEvent)
    .calls(eventService.createEvent)
    .onSuccess(201)
    .build()
export const updateEvent = new ControllerBuilder()
    .validatesWith(schemas.updateEvent)
    .calls(eventService.updateEvent)
    .build()

export const recordEvent = async (req: Request, res: Response) => {
    try {
        const input = schemas.recordEvent.parse(req)
        const existingEvent = await eventService.getLatestForNFCId(input)
        const now = new Date()
        const clock_in_time = new Date(existingEvent?.clock_in)
        let event = null

        if (!existingEvent || existingEvent.clock_out || isClockInTimeTooOld(now, clock_in_time)) {
            // New clock in event
            await eventService.createEvent({
                body: {
                    nfc_id: input.query.nfc_id,
                    clock_in: now.toISOString(),
                    clock_out: null
                }
            })
            event = 'clock_in'
        } else {
            // Update existingEvent with clock_out time
            await eventService.updateEvent({
                params: {
                    id: existingEvent.id, 
                },
                body: {
                    clock_out: now.toISOString()
                }
            })
            event = 'clock_out'
        }

        const user = await userService.getUserByNfcId(input)
        res.status(200).json({ event, user, when: now.toISOString() })
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            switch (error.code) {
                case PostgresError.FOREIGN_KEY_VIOLATION:
                    res.status(400).json(error)
                    break
                default:
                    res.status(500).json(error)
            }
        }
    }
}
