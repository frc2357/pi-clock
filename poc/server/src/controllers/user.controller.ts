import * as schemas from '../schemas/user.schemas.js'
import * as userService from '../services/user.service.js'
import ControllerBuilder from '../utils/controller-builder.js'

export const getAllUsers = new ControllerBuilder()
    .calls(userService.getAllUsers)
    .build()
export const getAllUserEvents = new ControllerBuilder()
    .calls(userService.getAllUserEvents)
    .build()
export const getSingleUser = new ControllerBuilder()
    .validatesWith(schemas.getSingleUser)
    .calls(async (input: schemas.GetSingleUserParams) => {
        if (input.query.id !== undefined) {
            return await userService.getUserById(input)
        } else if (input.query.nfc_id !== undefined) {
            return await userService.getUserByNfcId(input)
        }
    })
    .build()
export const getUserEvents = new ControllerBuilder()
    .validatesWith(schemas.getSingleUser)
    .calls(async (input: schemas.GetSingleUserParams) => {
        if (input.query.id !== undefined) {
            return await userService.getUserEventsById(input)
        } else if (input.query.nfc_id !== undefined) {
            return await userService.getUserEventsByNfcId(input)
        }
    })
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