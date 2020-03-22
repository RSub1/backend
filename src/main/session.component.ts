import { Component, Get, Patch, Post, Request, Response } from 'skeidjs';
import { FeatureToggleService } from './service/feature-toggle.service';
import { Session, SessionService } from './service/session.service';
import { CmCreatedSession, CmPatchSessionPayload } from './model/client.model';
import { EncryptionService } from './service/encryption-service';
import { InfectionService } from './service/infection.service';

@Component({
    route: '/v0/sessions/'
})
export class SessionComponent {
    constructor(private togglzService: FeatureToggleService,
                private sessionService: SessionService,
                private encryptionService: EncryptionService,
                private infectionService: InfectionService
    ) {}

    @Post({ route: '' })
    createNewSession( request: Request, response: Response ) {
        if ( this.testFeature(response) ) {
            const payload = request.json() as CmPatchSessionPayload;
            const session = this.sessionService.createSession();
            session.addToUserIdContactList(payload.addContactPersonIds.map(id => this.mapId(id)));

            response.status(201).respond(<CmCreatedSession>{ sessionId: session.getSessionId() })
        }
    }

    @Patch({ route: '/:sessionId' })
    patchSession( request: Request, response: Response ) {
        if ( this.testFeature(response) ) {
            const payload = request.json() as CmPatchSessionPayload;
            const session: Session = this.sessionService
                .findBySessionId((request.params as { sessionId: string }).sessionId);

            session.addToUserIdContactList(payload.addContactPersonIds.map(id => this.mapId(id)));

            response.status(204, 'Added contact ids to the session');
        }
    }

    @Get({ route: '/:sessionId/notifications' })
    subscribeSession( request: Request, response: Response ) {
        if (this.testFeature(response)) {
            const session: Session = this.sessionService
                .findBySessionId((request.params as { sessionId: string }).sessionId);

            const eventDispatcher = response.event();

            this.infectionService
                .observePotentialContaminationWithContactList(session.getUserIdContactList())
                .subscribe(hasRisk => {
                    if(hasRisk) {
                        eventDispatcher.dispatch('CONTACT_CONFIRMED', {})
                    }
                });
        }
    }

    private testFeature( response: Response ): boolean {
        if ( this.togglzService.isActive('SUBSCRIPTION_SESSION') ) {
            return true;
        } else {
            response.status(403, 'Sessions Feature is currently disabled');
        }
        return false;
    }

    private mapId(id: string) {
        if (this.togglzService.isActive('ANONYMOUS_IDS')) {
            return this.encryptionService.decrypt(id);
        }
        return id;
    }


}
