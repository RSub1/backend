import { Application, Patch, Post, Request, Response } from 'skeidjs';
import { InfectionService } from './service/infection.service';
import { CmPatchInfectionStatePayload } from './model/client.model';

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
    }

    @Patch({ route: '/v0/_self' } )
    patchInfectionStatus( request: Request, response: Response ) {
        const body: CmPatchInfectionStatePayload = request.json() as CmPatchInfectionStatePayload;
        this.infectionService.patchUserInfection(body.user, body.state).then(_ => {
            response.status(204, 'User infection was patched').respond();
        }).catch(_ => response.status(500, 'Internal Server Error'));
    }

}
