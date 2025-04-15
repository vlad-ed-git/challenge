'use server';

import { defaultLocale, Locale } from '@/i18n/config';
import { cookies } from 'next/headers';


// The name of the cookie that stores the user's locale
const COOKIE_NAME = 'CHALLENGE_NEXT_LOCALE';

export async function getUserLocale() {
    return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    (await cookies()).set(COOKIE_NAME, locale);
}