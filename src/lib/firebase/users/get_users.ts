"use client";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "../config";
import { DisplacementStatus, EducationalLevel, UserProfile, usersCollection } from "./profile";

/**
 * Fetches a user profile from Firestore by document ID.
 *
 * @param {string} id - The Firestore document ID of the user.
 * @returns {Promise<UserProfile | null>} The UserProfile object or null if not found or on error.
 */
export const getUserById = async (id: string): Promise<UserProfile | null> => {
    if (!id) {
        console.error("Error: getUserById called with empty ID.");
        return null;
    }
    try {
        const docRef = doc(db, usersCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Ensure data is not undefined before mapping
            if (data) {
                return mapFirestoreDataToUserProfile(docSnap.id, data);
            } else {
                console.warn(`Document ${id} exists but data is undefined.`);
                return null;
            }
        } else {
            console.log(`No user found with ID: ${id}`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting user document ${id}: `, error);
        return null; // Return null on error as per original logic
    }
};

/**
 * Maps raw Firestore document data to a UserProfile object.
 *
 * @param {string} id - The Firestore document ID.
 * @param {DocumentData} data - The raw data from Firestore.
 * @returns {UserProfile} The constructed UserProfile object.
 * @throws {Error} if essential data fields are missing or have incorrect types.
 */
const mapFirestoreDataToUserProfile = (id: string, data: DocumentData): UserProfile => {
    // Extract and validate/cast basic types
    const age = data.age as number;
    const nationality = data.nationality as string;
    const occupation = data.occupation as string;
    const educationalLevel = data.educationalLevel as EducationalLevel; // Cast to specific type
    const currentCity = data.currentCity as string;
    const currentCountry = data.currentCountry as string;

    // Construct DisplacementStatus correctly
    const hasExperience = data.hasDisplacementExperience as boolean; // Assuming this field name exists
    const narrativeFromDb = data.narrative as string | undefined | null;

    // Explicitly check boolean value, handle undefined case
    let displacementStatus: DisplacementStatus;
    if (hasExperience === true) {
        displacementStatus = { hasExperience: true, narrative: narrativeFromDb || "" };
    } else {
        displacementStatus = { hasExperience: false, narrative: null };
    }

    return new UserProfile(
        {
            uid: id,
            age: age,
            nationality:nationality,
            occupation: occupation,
            educationalLevel: educationalLevel,
            displacementStatus: displacementStatus,
            currentCity: currentCity,
            currentCountry: currentCountry,
       }
    );
};
