import { PolicyAreaId } from "@/lib/types/policy_types";

export const policyAreaAccentColors = [
    'text-rose-600 border-rose-500 ring-rose-500 bg-rose-50', // ACCESS (Example: Reddish)
    'text-sky-600 border-sky-500 ring-sky-500 bg-sky-50',   // LANGUAGE (Example: Blue)
    'text-amber-600 border-amber-500 ring-amber-500 bg-amber-50', // TRAINING (Example: Orange/Yellow)
    'text-emerald-600 border-emerald-500 ring-emerald-500 bg-emerald-50', // CURRICULUM (Example: Green)
    'text-indigo-600 border-indigo-500 ring-indigo-500 bg-indigo-50', // SUPPORT (Example: Indigo)
    'text-lime-600 border-lime-500 ring-lime-500 bg-lime-50',   // FINANCIAL (Example: Lime Green)
    'text-fuchsia-600 border-fuchsia-500 ring-fuchsia-500 bg-fuchsia-50', // CERTIFICATION (Example: Fuchsia)
];

export const getColorForPolicyArea = (policyArea: PolicyAreaId) => {
    switch (policyArea) {
        case PolicyAreaId.ACCESS:
            return policyAreaAccentColors[0];
        case PolicyAreaId.LANGUAGE:
            return policyAreaAccentColors[1];
        case PolicyAreaId.TRAINING:
            return policyAreaAccentColors[2];
        case PolicyAreaId.CURRICULUM:
            return policyAreaAccentColors[3];
        case PolicyAreaId.SUPPORT:
            return policyAreaAccentColors[4];
        case PolicyAreaId.FINANCIAL:
            return policyAreaAccentColors[5];
        case PolicyAreaId.CERTIFICATION:
            return policyAreaAccentColors[6];
        default:
            return policyAreaAccentColors[0]; // Default to first color if unknown
    }
}