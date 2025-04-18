// Enum for the 7 distinct policy areas
export enum PolicyAreaId {
    ACCESS = 'access',
    LANGUAGE = 'language',
    TRAINING = 'training',
    CURRICULUM = 'curriculum',
    SUPPORT = 'support',
    FINANCIAL = 'financial',
    CERTIFICATION = 'certification'


}

export const policyAreaIdToString = (policyAreaId: PolicyAreaId): string => {
    switch (policyAreaId) {
        case PolicyAreaId.ACCESS:
            return 'Access to Education';
        case PolicyAreaId.LANGUAGE:
            return 'Language Instruction';
        case PolicyAreaId.TRAINING:
            return 'Teacher Training';
        case PolicyAreaId.CURRICULUM:
            return 'Curriculum Adaptation';
        case PolicyAreaId.SUPPORT:
            return 'Psychosocial Support';
        case PolicyAreaId.FINANCIAL:
            return 'Financial Support';
        case PolicyAreaId.CERTIFICATION:
            return 'Certification/Accreditation';
        default:
            return '';
    }
}

// Enum for the 3 options within each area
export enum PolicyOptionId {
    OPTION_1 = 'option1',
    OPTION_2 = 'option2',
    OPTION_3 = 'option3'
}

// Interface for a single policy option
export interface PolicyOption {
    id: PolicyOptionId; // e.g., PolicyOptionId.OPTION_1
    cost: 1 | 2 | 3; // Explicit cost, matching the option number
    titleKey: string; // Translation key for a short title/summary (optional but good for UI)
    descriptionKey: string; // Translation key for the main description
    advantageKey: string; // Translation key for the advantage text
    disadvantageKey: string; // Translation key for the disadvantage text
}

// Interface for a policy area category
export interface PolicyArea {
    id: PolicyAreaId; // e.g., PolicyAreaId.ACCESS
    nameKey: string; // Translation key for the area name (e.g., "Access to Education")
    options: [PolicyOption, PolicyOption, PolicyOption]; // Exactly 3 options, typed
}

// Type for the complete game policy data structure
export type PolicyData = PolicyArea[];

export const gamePolicyData: PolicyData = [
    // 1. Access to Education
    {
        id: PolicyAreaId.ACCESS,
        nameKey: 'policyArea_access_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_access_option1_title',
                descriptionKey: 'policyArea_access_option1_description',
                advantageKey: 'policyArea_access_option1_advantage',
                disadvantageKey: 'policyArea_access_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_access_option2_title',
                descriptionKey: 'policyArea_access_option2_description',
                advantageKey: 'policyArea_access_option2_advantage',
                disadvantageKey: 'policyArea_access_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_access_option3_title',
                descriptionKey: 'policyArea_access_option3_description',
                advantageKey: 'policyArea_access_option3_advantage',
                disadvantageKey: 'policyArea_access_option3_disadvantage'
            }
        ]
    },
    // 2. Language Instruction
    {
        id: PolicyAreaId.LANGUAGE,
        nameKey: 'policyArea_language_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_language_option1_title',
                descriptionKey: 'policyArea_language_option1_description',
                advantageKey: 'policyArea_language_option1_advantage',
                disadvantageKey: 'policyArea_language_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_language_option2_title',
                descriptionKey: 'policyArea_language_option2_description',
                advantageKey: 'policyArea_language_option2_advantage',
                disadvantageKey: 'policyArea_language_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_language_option3_title',
                descriptionKey: 'policyArea_language_option3_description',
                advantageKey: 'policyArea_language_option3_advantage',
                disadvantageKey: 'policyArea_language_option3_disadvantage'
            }
        ]
    },
    // 3. Teacher Training
    {
        id: PolicyAreaId.TRAINING,
        nameKey: 'policyArea_training_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_training_option1_title',
                descriptionKey: 'policyArea_training_option1_description',
                advantageKey: 'policyArea_training_option1_advantage',
                disadvantageKey: 'policyArea_training_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_training_option2_title',
                descriptionKey: 'policyArea_training_option2_description',
                advantageKey: 'policyArea_training_option2_advantage',
                disadvantageKey: 'policyArea_training_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_training_option3_title',
                descriptionKey: 'policyArea_training_option3_description',
                advantageKey: 'policyArea_training_option3_advantage',
                disadvantageKey: 'policyArea_training_option3_disadvantage'
            }
        ]
    },
    // 4. Curriculum Adaptation
    {
        id: PolicyAreaId.CURRICULUM,
        nameKey: 'policyArea_curriculum_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_curriculum_option1_title',
                descriptionKey: 'policyArea_curriculum_option1_description',
                advantageKey: 'policyArea_curriculum_option1_advantage',
                disadvantageKey: 'policyArea_curriculum_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_curriculum_option2_title',
                descriptionKey: 'policyArea_curriculum_option2_description',
                advantageKey: 'policyArea_curriculum_option2_advantage',
                disadvantageKey: 'policyArea_curriculum_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_curriculum_option3_title',
                descriptionKey: 'policyArea_curriculum_option3_description',
                advantageKey: 'policyArea_curriculum_option3_advantage',
                disadvantageKey: 'policyArea_curriculum_option3_disadvantage'
            }
        ]
    },
    // 5. Psychosocial Support
    {
        id: PolicyAreaId.SUPPORT,
        nameKey: 'policyArea_support_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_support_option1_title',
                descriptionKey: 'policyArea_support_option1_description',
                advantageKey: 'policyArea_support_option1_advantage',
                disadvantageKey: 'policyArea_support_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_support_option2_title',
                descriptionKey: 'policyArea_support_option2_description',
                advantageKey: 'policyArea_support_option2_advantage',
                disadvantageKey: 'policyArea_support_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_support_option3_title',
                descriptionKey: 'policyArea_support_option3_description',
                advantageKey: 'policyArea_support_option3_advantage',
                disadvantageKey: 'policyArea_support_option3_disadvantage'
            }
        ]
    },
    // 6. Financial Support
    {
        id: PolicyAreaId.FINANCIAL,
        nameKey: 'policyArea_financial_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_financial_option1_title',
                descriptionKey: 'policyArea_financial_option1_description',
                advantageKey: 'policyArea_financial_option1_advantage',
                disadvantageKey: 'policyArea_financial_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_financial_option2_title',
                descriptionKey: 'policyArea_financial_option2_description',
                advantageKey: 'policyArea_financial_option2_advantage',
                disadvantageKey: 'policyArea_financial_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_financial_option3_title',
                descriptionKey: 'policyArea_financial_option3_description',
                advantageKey: 'policyArea_financial_option3_advantage',
                disadvantageKey: 'policyArea_financial_option3_disadvantage'
            }
        ]
    },
    // 7. Certification/Accreditation
    {
        id: PolicyAreaId.CERTIFICATION,
        nameKey: 'policyArea_certification_name',
        options: [
            {
                id: PolicyOptionId.OPTION_1, cost: 1,
                titleKey: 'policyArea_certification_option1_title',
                descriptionKey: 'policyArea_certification_option1_description',
                advantageKey: 'policyArea_certification_option1_advantage',
                disadvantageKey: 'policyArea_certification_option1_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_2, cost: 2,
                titleKey: 'policyArea_certification_option2_title',
                descriptionKey: 'policyArea_certification_option2_description',
                advantageKey: 'policyArea_certification_option2_advantage',
                disadvantageKey: 'policyArea_certification_option2_disadvantage'
            },
            {
                id: PolicyOptionId.OPTION_3, cost: 3,
                titleKey: 'policyArea_certification_option3_title',
                descriptionKey: 'policyArea_certification_option3_description',
                advantageKey: 'policyArea_certification_option3_advantage',
                disadvantageKey: 'policyArea_certification_option3_disadvantage'
            }
        ]
    }
];