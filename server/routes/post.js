import express from 'express'
import { verifyToken } from '../middleware/verifyUser.js'
import { CommentOnPostHandler, CreatePostHandler, DeletePosthandler, GetAllPostHandler, GetFollowingPost, GetLikedPostHandler, LikeUnlikePostHandler } from '../controller/post.js'
import { Upload } from '../utils/multer.js'

const router = express.Router()

router.route("/").get(verifyToken,GetAllPostHandler)
router.route("/getLikedPost/:id").get(verifyToken,GetLikedPostHandler)
router.route("/getFollowingPost").get(verifyToken,GetFollowingPost)
router.route("/create").post(Upload.single("img"),verifyToken,CreatePostHandler)
router.route("/delete/:id").delete(verifyToken,DeletePosthandler)
router.route("/like/:id").post(verifyToken,LikeUnlikePostHandler)
router.route("/comment/:id").post(verifyToken,CommentOnPostHandler)


export default router