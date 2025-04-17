
import { z } from "zod";
import { DisplacementStatus, EducationalLevel, UserProfile } from "../firebase/users/profile";
import { PolicySelections } from "@/components/game/types";


export const reflectionQuestionKeys = [
    'reflection_emotions',
    'reflection_familiarity',
    'reflection_assumptions',
    'reflection_dynamics',
    'reflection_understanding_shift',
    'reflection_interests_served',
    'reflection_power_absent',
    'reflection_compromises',
    'reflection_game_limits',
    'reflection_transformation'
] as const; 


export type ReflectionQuestionKey = typeof reflectionQuestionKeys[number];



export const ReflectionSchema = z.object({
    reflection_emotions: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_familiarity: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_assumptions: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_dynamics: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_understanding_shift: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_interests_served: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_power_absent: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_compromises: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_game_limits: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    reflection_transformation: z.string().min(10, { message: "reflection_reflectionMinLength" }),
    optional_feedback: z.string().optional(),
});

export const reflectionsCollection = "reflections";
export type ReflectionFormValues = z.infer<typeof ReflectionSchema>;


export interface ReflectionReportData {
    userId: string; 
    userProfileSnapshot: {
        uid: string;
        age: number;
        nationality: string;
        occupation: string;
        educationalLevel: EducationalLevel;
        displacementStatus: DisplacementStatus;
        currentCity: string;
        currentCountry: string;
    };
    phaseOneSelections: Required<PolicySelections> | null;
    phaseTwoSelections: Required<PolicySelections> | null;
    agentHappiness: {
        state: number; 
        citizen: number; 
        humanRights: number; 
    };
    reflectionAnswers: ReflectionFormValues; 
    submittedAt: Date; 
    optional_feedback: string | null;
}