
export interface CmNewUserResponsePayload {
    id: string
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

export enum InfectionState {
    CONFIRMED= 'CONFIRMED',
    PENDING = 'PENDING',
    HEALTHY = 'HEALTHY'
}

export enum NotificationEvent {
    CONTACT_CONFIRMED = 'CONTACT_CONFIRMED'
}
