import z from "zod";


export const CreatePostSchema = z.object({
    text:z.string().min(1,"message is required"),
})

export const PostCommentSchema = z.object({
    text:z.string().min(1,"a comment is required")
})