import { PolicyAreaId } from "@/lib/types/policy_types";

export const policyAreaAccentColors = [
    'text-cyan-600 border-cyan-400 ring-cyan-400 bg-cyan-50',
    'text-orange-500 border-orange-400 ring-orange-400 bg-orange-50',
    'text-lime-500 border-lime-400 ring-lime-400 bg-lime-50',
    'text-fuchsia-600 border-fuchsia-400 ring-fuchsia-400 bg-fuchsia-50',
    'text-blue-600 border-blue-400 ring-blue-400 bg-blue-50',
    'text-yellow-500 border-yellow-400 ring-yellow-400 bg-yellow-50',
    'text-emerald-500 border-emerald-400 ring-emerald-400 bg-emerald-50'
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
            return policyAreaAccentColors[0];
    }
}