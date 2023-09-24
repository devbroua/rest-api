import { Router } from "express"

import { deleteUser, getAllUsers, updateUser } from "../controllers/users"
import { isAutheticated, isOwner } from "../middlewares"

export default (router: Router) => {
  router.get("/users", isAutheticated, getAllUsers)
  router.delete("/users/:id", isAutheticated, isOwner, deleteUser)
  router.patch("/users/:id", isAutheticated, isOwner, updateUser)
}
