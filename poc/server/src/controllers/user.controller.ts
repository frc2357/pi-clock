import * as schemas from '../schemas/user.schemas.js'
import * as userService from '../services/user.service.js'
import ControllerBuilder from '../utils/controller-builder.js'

export const getAllUsers = new ControllerBuilder()
    .calls(userService.getAllUsers)
    .build()
export const getUserById = new ControllerBuilder()
    .validatesWith(schemas.getUserById)
    .calls(userService.getUserById)
    .build()
export const createUser = new ControllerBuilder()
    .validatesWith(schemas.createUser)
    .calls(userService.createUser)
    .onSuccess(201)
    .build()
export const updateUser = new ControllerBuilder()
    .validatesWith(schemas.updateUser)
    .calls(userService.updateUser)
    .build()