
export const usersCollection = "users";


export enum EducationalLevel {
    DID_NOT_COMPLETE_HIGH_SCHOOL = "DID_NOT_COMPLETE_HIGH_SCHOOL",
    HIGH_SCHOOL_DIPLOMA_OR_EQUIVALENT = "HIGH_SCHOOL_DIPLOMA_OR_EQUIVALENT",
    COLLEGE_NO_DEGREE = "COLLEGE_NO_DEGREE",
    ASSOCIATES_DEGREE = "ASSOCIATES_DEGREE",
    BACHELORS_DEGREE = "BACHELORS_DEGREE",
    MASTERS_DEGREE = "MASTERS_DEGREE",
    DOCTORAL_DEGREE = "DOCTORAL_DEGREE",
    PROFESSIONAL_DEGREE = "PROFESSIONAL_DEGREE",
    OTHER_PREFER_NOT_TO_SAY = "OTHER_PREFER_NOT_TO_SAY"
}

export const getEducationLevelStringKey = (level: EducationalLevel): string => {
    switch (level) {
        case EducationalLevel.DID_NOT_COMPLETE_HIGH_SCHOOL:
            return "did_not_complete_high_school_label_key";
        case EducationalLevel.HIGH_SCHOOL_DIPLOMA_OR_EQUIVALENT:
            return "high_school_diploma_or_equivalent_label_key";
        case EducationalLevel.COLLEGE_NO_DEGREE:
            return "college_no_degree_label_key";
        case EducationalLevel.ASSOCIATES_DEGREE:
            return "associates_degree_label_key";
        case EducationalLevel.BACHELORS_DEGREE:
            return "bachelors_degree_label_key";
        case EducationalLevel.MASTERS_DEGREE:
            return "masters_degree_label_key";
        case EducationalLevel.DOCTORAL_DEGREE:
            return "doctoral_degree_label_key";
        case EducationalLevel.PROFESSIONAL_DEGREE:
            return "professional_degree_label_key";
        case EducationalLevel.OTHER_PREFER_NOT_TO_SAY:
            return "other_prefer_not_to_say_label_key";
        default:
            return "did_not_complete_high_school_label_key";
    }
}

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
    public email: string;

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
     * @param {string} email - Participant's email address.
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
            currentCountry,
            email,


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
                email: string,
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
        this.email = email;
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

