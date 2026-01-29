// Using const objects to avoid erasableSyntaxOnly (enum) issues
export const UserRole = {
    PUBLIC_KIOSK: 'PUBLIC_KIOSK',
    TRAVELER: 'TRAVELER',
    HOST: 'HOST',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const KYCStatus = {
    UNVERIFIED: 'UNVERIFIED',
    PENDING: 'PENDING',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED'
} as const;

export type KYCStatus = typeof KYCStatus[keyof typeof KYCStatus];
