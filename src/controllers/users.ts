import { Request, Response } from "express"

import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../db/users"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers()

    return res.status(200).json(users)
  } catch (error) {
    console.log(error)

    return res.sendStatus(400)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(400)
    }

    const deletedUser = await deleteUserById(id)
    return res.status(200).json(deletedUser)
  } catch (error) {
    console.log(error)

    return res.sendStatus(400)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) {
      return res.sendStatus(400)
    }

    const user = await getUserById(id)

    if (!user) {
      return res.sendStatus(404)
    }

    user.username = username

    await user.save()

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
