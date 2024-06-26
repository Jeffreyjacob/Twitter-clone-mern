import express from "express"
import { GetUserHandler, LogOutHandler, LoginHandleer, SignUpHandler } from "../controller/auth.js"
import { verifyToken } from "../middleware/verifyUser.js"



const router = express.Router()

router.route("/signup").post(SignUpHandler)
router.route("/login").post(LoginHandleer)
router.route("/logout").post(LogOutHandler)
router.route("/getUser").get(verifyToken,GetUserHandler)

export default router