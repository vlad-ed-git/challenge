
import * as z from "zod";
import { EducationalLevel } from "../firebase/users/profile";


const enumValues = Object.values(EducationalLevel);
const educationalLevelEnumValues = [enumValues[0], ...enumValues.slice(1)] as [string, ...string[]];

export const SignupSchema = z.object({
    email: z.string()
        .min(1, { message: "emailRequired" })
        .email({ message: "emailInvalid" }),
    password: z.string()
        .min(1, { message: "passwordRequired" })
        .min(8, { message: "passwordMinLength" }),
    confirmPassword: z.string()
        .min(1, { message: "confirmPasswordRequired" }),
    age: z.coerce.number({
        required_error: "ageRequired",
        invalid_type_error: "ageInvalidType"
    })
        .int({ message: "ageMustBeInteger" })
        .min(16, { message: "ageMin" }),
    nationality: z.string()
        .min(1, { message: "nationalityRequired" }),
    occupation: z.string()
        .min(1, { message: "occupationRequired" }),
    educationalLevel: z.enum(educationalLevelEnumValues, {
        required_error: "educationRequired",
        invalid_type_error: "educationRequired",
    }),
    hasDisplacementExperience: z.boolean({
        required_error: "displacementRequired",
        invalid_type_error: "displacementRequired",
    }),
    displacementNarrative: z.string().optional(),
    currentCity: z.string()
        .min(1, { message: "cityRequired" }),
    currentCountry: z.string()
        .min(1, { message: "countryRequired" }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "passwordsMustMatch",
        path: ["confirmPassword"],
    })
    .refine((data) => {

        if (data.hasDisplacementExperience === true) {
            return data.displacementNarrative && data.displacementNarrative.trim().length > 0;
        }

        return true;
    }, {
        message: "narrativeRequired",
        path: ["displacementNarrative"],
    });


export type SignupFormValues = z.infer<typeof SignupSchema>;