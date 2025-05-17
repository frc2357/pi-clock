import * as eventService from '../services/event.service.js'
import * as userService from '../services/user.service.js'
import { isClockInTimeTooOld } from '../utils/event.utils.js'
import { PostgresError } from 'pg-error-enum'

export const getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id)
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body)
        res.status(201).json(event)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateEvent = async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body)
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const recordEvent = async (req, res) => {
    try {
        const nfc_id = req.query.nfc_id
        const existingEvent = await eventService.getLatestForNFCId(nfc_id)
        const now = new Date()
        const clock_in_time = new Date(existingEvent?.clock_in)
        let event = null

        if (!existingEvent || existingEvent.clock_out || isClockInTimeTooOld(now, clock_in_time)) {
            // New clock in event
            await eventService.createEvent({
                nfc_id,
                clock_in: now
            })
            event = 'clock_in'
        } else {
            // Update existingEvent with clock_out time
            await eventService.updateEvent(existingEvent.id, {
                clock_out: now
            })
            event = 'clock_out'
        }

        const user = await userService.getUserByNfcId(nfc_id)
        return res.status(200).json({ event, user, when: now.toISOString() })
    } catch (error) {
        switch (error.code) {
            case PostgresError.FOREIGN_KEY_VIOLATION:
                return res.status(400).json(error)
            default:
                return res.status(500).json(error)
        }
    }
}