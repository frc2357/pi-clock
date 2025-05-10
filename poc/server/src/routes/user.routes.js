import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { validateRequest } from '../middleware/validateRequest.js'
import * as schemas from '../schemas/user.schemas.js'

const router = Router()

router.get('/', userController.getAllUsers)
router.get('/:id', validateRequest(schemas.getUserById), userController.getUserById)
router.post('/', validateRequest(schemas.createUser), userController.createUser)
router.put('/:id', validateRequest(schemas.updateUser), userController.updateUser)

export default router