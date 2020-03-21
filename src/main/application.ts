import { Application, Patch, Post, Request, Response } from 'skeidjs';
import { filter } from 'rxjs/operators'
import { InfectionService } from './service/infection.service';
import { CmNotificationSubscriptionOptions, CmPatchInfectionStatePayload } from './model/client.model';

@Application({
    contentType: 'application/json',
    server: {
        maxConnections: 10,
        timeout: 500,
        keepAliveTimeout: 500
    },
})
class RSubOneBoot {

    constructor( private infectionService: InfectionService ) {}

    @Post({ route: '/v0/' } )
    createNew( request: Request, response: Response ) {

    }

    @Post({ route: '/v0/_self' } )
    subscribeNotifications( request: Request, response: Response ) {
        const payload = request.json() as CmNotificationSubscriptionOptions;
        this.infectionService.observePotentialContaminationWithContactList(payload.contactPersonIds)
            .pipe(filter(s => s))
            .subscribe(hasRisk => response.event().dispatch('RISK', {}))
    }

    @Patch({ route: '/v0/_self' } )
    patchInfectionStatus( request: Request, response: Response ) {
        const body: CmPatchInfectionStatePayload = request.json() as CmPatchInfectionStatePayload;
        this.infectionService.patchUserInfection(body.user, body.state).then(_ => {
            response.status(204, 'User infection was patched').respond();
        }).catch(_ => response.status(500, 'Internal Server Error'));
    }

}
