export enum AuthErrorCodes {
    INVALID_LOGIN_CREDENTIALS = "invalid_login_credentials",
    EMAIL_CHANGE_NEEDS_VERIFICATION = "email_change_needs_verification",
    EMAIL_EXISTS = "email_exists",
    INVALID_EMAIL = "invalid_email",
    INVALID_PASSWORD = "invalid_password",
    TOO_MANY_ATTEMPTS_TRY_LATER = "too_many_attempts_try_later",
    WEAK_PASSWORD = "weak_password",
    UNKNOWN_AUTH_ERROR = "unknown_auth_error",
    NETWORK_ERROR = "network_error",
}

export function mapAuthErrorToEnum(errorMessage: string): AuthErrorCodes {
    const errorMap: { [key: string]: AuthErrorCodes } = {
        "Firebase: Error (auth/email-change-needs-verification).":
            AuthErrorCodes.EMAIL_CHANGE_NEEDS_VERIFICATION,
        "Firebase: Error (auth/email-already-in-use).": AuthErrorCodes.EMAIL_EXISTS,
        "Firebase: Error (auth/invalid-email).": AuthErrorCodes.INVALID_EMAIL,
        "Firebase: Error (auth/wrong-password).": AuthErrorCodes.INVALID_PASSWORD,
        "Firebase: Error (auth/too-many-requests).":
            AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER,
        "Firebase: Error (auth/weak-password).": AuthErrorCodes.WEAK_PASSWORD,
        "Firebase: Error (auth/invalid-credential).":
            AuthErrorCodes.INVALID_LOGIN_CREDENTIALS,
        "Firebase: Error (auth/network-request-failed).":
            AuthErrorCodes.NETWORK_ERROR,
    };

    return errorMap[errorMessage] || AuthErrorCodes.UNKNOWN_AUTH_ERROR;
}