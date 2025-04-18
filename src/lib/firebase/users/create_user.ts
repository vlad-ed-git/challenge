"use client";;
import { ProfileFormValues } from "@/lib/form_models/register_schema";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config";
import { usersCollection } from "./profile";

interface IEditProfileResult {
    success: boolean;
    docId?: string;
    error?: any;
}
const editProfile = async (
    profileId: string,
    values: ProfileFormValues): Promise<IEditProfileResult> => {

    try {
        // update the time period
        const docRef = doc(db, usersCollection, profileId);
        await setDoc(docRef, {
            ...values,
        }, { merge: true });
        return { success: true, docId: docRef.id };
    } catch (error) {
        return { success: false, error };
    }
}

export { editProfile };