import { Router } from 'express'
import * as eventController from '../controllers/event.controller.js'

const router = Router()

router.get('/', eventController.getAllEvents)
router.get('/:id', eventController.getEventById)
router.post('/', eventController.createEvent)
router.put('/:id', eventController.updateEvent)
router.post('/record', eventController.recordEvent)

export default router