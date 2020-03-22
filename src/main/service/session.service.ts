import { Injectable } from 'skeidjs';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {

    private static sessions: Array<Session> = [];

    constructor() {}

    createSession(): Session {
        const sessionId = crypto.randomBytes(24).toString('base64');
        const newSession: Session = new Session(sessionId);
        SessionService.sessions.push(newSession);
        return newSession;
    }

    findBySessionId( sessionId: string ): Session | never {
        const matchingSession: Session = SessionService.sessions.filter(s => s.getSessionId() === sessionId)[0];
        if ( sessionId === undefined ) {
            throw new Error(`Session ${sessionId} not found.`)
        }
        return matchingSession;
    }

    killSession( sessionId: string ): void {
        SessionService.sessions = SessionService.sessions.filter(s => s.getSessionId() !== sessionId);
    }
}

export class Session {

    private userIdContactList: Array<string> = [];

    constructor( private sessionId: string ) {}

    addToUserIdContactList( moreItems: Array<string> ): void {
        this.userIdContactList.push(...moreItems);
    }

    getSessionId(): string {
        return this.sessionId;
    }

    getUserIdContactList(): Array<string> {
        return this.userIdContactList;
    }

}


