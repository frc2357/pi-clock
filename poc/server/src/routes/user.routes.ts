import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)

export default router