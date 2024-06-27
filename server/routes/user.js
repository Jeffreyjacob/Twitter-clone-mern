import express from 'express';
import { verifyToken } from '../middleware/verifyUser.js';
import { FollowUnfollowUser, GetProfilebyUsername, GetSuggestedUser, GetUserHandler, UpdateUserProfile } from '../controller/user.js';

const router = express.Router()

router.route("/getUser").get(verifyToken,GetUserHandler)
router.get("/suggestedProfile",verifyToken,GetSuggestedUser)
router.route("/profile/:username").get(verifyToken,GetProfilebyUsername)
router.post("/follow/:id",verifyToken,FollowUnfollowUser)
router.post("/update",verifyToken,UpdateUserProfile)

export default router;