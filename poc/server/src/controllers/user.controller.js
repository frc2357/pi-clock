import * as userService from '../services/user.service.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body)
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}