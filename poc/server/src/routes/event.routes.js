import { Router } from 'express'
import * as eventController from '../controllers/event.controller.js'
import { validateRequest } from '../middleware/validateRequest.js'
import * as schemas from '../schemas/event.schemas.js'

const router = Router()

router.get('/', eventController.getAllEvents)
router.get('/:id', validateRequest(schemas.getEventById), eventController.getEventById)
router.post('/', validateRequest(schemas.createEvent), eventController.createEvent)
router.put('/:id', validateRequest(schemas.updateEvent), eventController.updateEvent)

export default router