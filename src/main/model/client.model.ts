
export interface CmNewUserResponsePayload {
    id: string
}

export interface CmCreateIdEncryptionPayload {
    privateId: string;
}

export interface CmCipher {
    cipher: string;
}

export interface CmNotificationSubscriptionOptions {
    contactPersonIds: Array<string>;
}

export interface CmInfectionInfo {
    hadContactToInfectedPeople: boolean;
}

export interface CmPatchInfectionStatePayload {
    state: InfectionState;
    userId: string;
}

export interface CmPatchTogglesPayload {
    enable: Array<string>;
    disable: Array<string>;
}

export interface CmPatchSessionPayload {
    addContactPersonIds: Array<string>;
}

export interface CmCreatedSession {
    sessionId: string;
}

export enum InfectionState {
    CONFIRMED= 'CONFIRMED',
    PENDING = 'PENDING',
    HEALTHY = 'HEALTHY'
}

export enum NotificationEvent {
    CONTACT_CONFIRMED = 'CONTACT_CONFIRMED'
}
