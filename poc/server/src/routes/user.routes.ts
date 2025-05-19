import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.get('/', userController.getAllUsers)
router.get('/events', userController.getAllUserEvents)
router.get('/find', userController.getSingleUser)
router.get('/events/:id', userController.getUserEvents)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)

export default router