import { Request, Response } from 'express'
import { ZodError } from 'zod'
import * as schemas from '../schemas/event.schemas.js'
import * as eventService from '../services/event.service.js'
import * as userService from '../services/user.service.js'
import { isClockInTimeTooOld } from '../utils/event.utils.js'
import { PostgresError } from 'pg-error-enum'

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getEventById = async (req: Request, res: Response) => {
    try {
        const input = schemas.getEventById.parse(req)
        const event = await eventService.getEventById(input)
        res.status(200).json(event)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            res.status(500).json(error)
        }
    }
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        const input = schemas.createEvent.parse(req)
        const event = await eventService.createEvent(input)
        res.status(201).json(event)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            res.status(500).json(error)
        }
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const input = schemas.updateEvent.parse(req)
        const event = await eventService.updateEvent(input)
        res.status(200).json(event)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            res.status(500).json(error)
        }
    }
}

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

        const user = await userService.getUserByNfcId(input.query.nfc_id)
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