"use client";
import { getAuth } from "firebase/auth";
import { sendEmailVerification, User } from "firebase/auth";

const sendVerificationEmail = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        await sendEmailVerification(user!);
        return {
            success: true,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error
        };
    }
}

export { sendVerificationEmail };