
export interface CmNewUserPayload {

}

export interface CmNotificationSubscriptionOptions {

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
