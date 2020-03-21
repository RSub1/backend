
export interface CmNewUserPayload {

}

export interface CmNotificationSubscriptionOptions {
    contactPersonIds: Array<string>;
}

export interface CmPatchInfectionStatePayload {
    state: InfectionState;
    user: string;
}

export enum InfectionState {
    CONFIRMED= 'CONFIRMED',
    PENDING = 'PENDING',
    HEALTHY = 'HEALTHY'
}
