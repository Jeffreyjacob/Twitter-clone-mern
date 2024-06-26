import z from 'zod'

export const SignUpSchema = z.object({
    fullname:z.string().min(1,"Please enter a name").max(255),
    username:z.string().min(1,"Please enter a username").max(255),
    email:z.string().email().min(1,"email is required"),
    password:z.string().min(6,"Your password must be at least 6 characters").max(50)
})

export const LoginSchema = z.object({
    username:z.string().min(1,"username is required").max(255),
    password:z.string().min(6,"Your password must be at least 6 characters").max(50)
})