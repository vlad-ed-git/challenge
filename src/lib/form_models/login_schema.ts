import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string()
        .min(1, { message: "emailRequired" }) 
        .email({ message: "emailInvalid" }),
    password: z.string()
        .min(1, { message: "passwordRequired" })
        .min(6, { message: "passwordMinLength" }), 
});

export type LoginFormValues = z.infer<typeof LoginSchema>;