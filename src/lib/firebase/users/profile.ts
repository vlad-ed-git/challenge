
export const usersCollection = "users";

export type EducationalLevel =
    | "Did not complete High School"
    | "High School Diploma or Equivalent"
    | "College, No Degree"
    | "Associate's Degree"
    | "Bachelor's Degree"
    | "Master's Degree"
    | "Doctoral Degree (PhD, EdD, etc.)"
    | "Professional Degree (MD, JD, etc.)"
    | "Other/Prefer not to say";

export type DisplacementStatus =
    | { hasExperience: false; narrative: null }
    | { hasExperience: true; narrative: string };

export class UserProfile {
    public uid: string;
    public age: number;
    public nationality: string;
    public occupation: string;
    public educationalLevel: EducationalLevel; // Uses the predefined type
    public displacementStatus: DisplacementStatus; // Uses the structured type
    public currentCity: string;
    public currentCountry: string;

    /**
     * Creates an instance of UserProfile.
     *
     * @param {string} uid - Unique identifier for the user.
     * @param {number} age - Participant's age.
     * @param {string} nationality - Participant's nationality.
     * @param {string} occupation - Participant's occupation.
     * @param {EducationalLevel} educationalLevel - Participant's selected educational level.
     * @param {DisplacementStatus} displacementStatus - Participant's displacement status object ({hasExperience, narrative}).
     * @param {string} currentCity - Participant's current city.
     * @param {string} currentCountry - Participant's current country.
     */
    constructor(
        {
            uid,
            age,
            nationality,
            occupation,
            educationalLevel,
            displacementStatus,
            currentCity,
            currentCountry
            

        }:
        {
                uid: string,
                age: number,
                nationality: string,
                occupation: string,
                educationalLevel: EducationalLevel,
                displacementStatus: DisplacementStatus,
                currentCity: string,
                currentCountry: string
        }
    ) {
        this.uid = uid;
        this.age = age;
        this.nationality = nationality;
        this.occupation = occupation;
        this.educationalLevel = educationalLevel;
        this.displacementStatus = displacementStatus;
        this.currentCity = currentCity;
        this.currentCountry = currentCountry;
    }


    public getLocationString(): string {
        return `${this.currentCity}, ${this.currentCountry}`;
    }


    public getDisplacementNarrative(): string | null {
        return this.displacementStatus.narrative;
    }

    public hasDisplacementExperience(): boolean {
        return this.displacementStatus.hasExperience;
    }
}
