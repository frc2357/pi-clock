import { Request, Response } from 'express'
import { ZodError } from 'zod'
import * as schemas from '../schemas/user.schemas.js'
import * as userService from '../services/user.service.js'

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const input = schemas.getUserById.parse(req)
        const user = await userService.getUserById(input)
        res.status(200).json(user)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            res.status(500).json(error)
        }
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const input = schemas.createUser.parse(req)
        const user = await userService.createUser(input)
        res.status(201).json(user)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            res.status(500).json(error)
        }
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const input = schemas.updateUser.parse(req)
        const user = await userService.updateUser(input)
        res.status(200).json(user)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(422).json(error)
        } else {
            res.status(500).json(error)
        }
    }
}