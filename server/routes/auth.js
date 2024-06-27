import express from "express"
import { LogOutHandler, LoginHandleer, SignUpHandler } from "../controller/auth.js";

const router = express.Router()

router.route("/signup").post(SignUpHandler)
router.route("/login").post(LoginHandleer)
router.route("/logout").post(LogOutHandler)

export default router