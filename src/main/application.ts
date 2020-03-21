import { Application, OnError, Patch, Post, Request, Response, ServerEventDispatcher } from 'skeidjs';
import { InfectionService } from './service/infection.service';
import {
    CmNewUserResponsePayload,
    CmNotificationSubscriptionOptions,
    CmPatchInfectionStatePayload, NotificationEvent
} from './model/client.model';
import { UserService } from './service/user.service';
import has = Reflect.has;

@Application({
    contentType: 'application/json',
    server: {
        port: 80,
        maxConnections: 10,
        timeout: 500,
        keepAliveTimeout: 500
    },
})
class RSubOneBoot implements OnError {

    constructor( private infectionService: InfectionService, private userService: UserService ) {}

    onError( error?: any ) {
        console.log(error)
    }

    @Post({ route: '/v0/' } )
    createNew( request: Request, response: Response ) {
        this.userService.createNew().then(id => {
            response.status(201, 'User Created').respond({ id } as CmNewUserResponsePayload)
        });
    }

    @Post({ route: '/v0/_self/notifications' } )
    subscribeNotifications( request: Request, response: Response ) {
        response.setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Expose-Headers', '*')
        .setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        const payload = request.json() as CmNotificationSubscriptionOptions;
        const eventDispatcher: ServerEventDispatcher = response.event();
        this.infectionService.observePotentialContaminationWithContactList(payload.contactPersonIds)
            .subscribe(hasRisk => {
                if(hasRisk) {
                    eventDispatcher.dispatch('CONTACT_CONFIRMED', {})
                }
            });
    }

    @Post({ route: '/v0/_self/infection-info' })
    getStatus( request: Request, response: Response ) {
        const payload = request.json() as CmNotificationSubscriptionOptions;
        this.infectionService.hadContactWithContaminated(payload.contactPersonIds)
            .then(hadContactToInfectedPeople => {
                response.status(200, 'OK').respond({ hadContactToInfectedPeople })
            });
    }

    @Patch({ route: '/v0/_self' } )
    patchInfectionStatus( request: Request, response: Response ) {
        const body: CmPatchInfectionStatePayload = request.json() as CmPatchInfectionStatePayload;
        this.infectionService.patchUserInfection(body.userId, body.state).then(_ => {
            response.status(204, 'User infection was patched').respond();
        }).catch(_ => response.status(500, 'Internal Server Error'));
    }

}
