import { authentication } from "./../helpers/index"
import express, { Request, Response } from "express"

import { random } from "../helpers"
import { createUser, getUserByEmail } from "../db/users"

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.sendStatus(400).json({ message: "Missing email or password" })
    }

    const findedUser = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    )

    if (!findedUser) {
      return res.sendStatus(400).json({ message: "User doesn`t exists" })
    }

    const expectedHash = authentication(
      findedUser.authentication.salt,
      password
    )

    if (findedUser.authentication.password !== expectedHash) {
      return res.sendStatus(403).json({ message: "Wrong password or email" })
    }

    const salt = random()
    findedUser.authentication.sessionToken = authentication(
      salt,
      findedUser._id.toString()
    )

    await findedUser.save()

    res.cookie("DEVBRO-AUTH", findedUser.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    })

    const {
      _id,
      username,
      email: userEmail,
      authentication: { sessionToken },
    } = findedUser

    return res
      .status(200)
      .json({
        _id,
        username,
        email: userEmail,
      })
      .end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res
        .sendStatus(400)
        .json({ message: "Missing email or password or username" })
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.sendStatus(400).json({ message: "User already exists" })
    }

    const salt = random()
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })

    console.log(user)

    const {
      authentication: { sessionToken },
      ...userWithoutAuthentication
    } = user

    return res
      .status(201)
      .json({
        ...userWithoutAuthentication,
        sessionToken,
      })
      .end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
