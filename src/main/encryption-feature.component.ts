import {
    Component,
    Get,
    OnInit,
    Post,
    Request,
    Response
} from 'skeidjs';
import { FeatureToggleService } from './service/feature-toggle.service';
import { EncryptionService } from './service/encryption-service';
import { CmCipher, CmCreateIdEncryptionPayload } from './model/client.model';

import * as RSA from 'node-rsa';
const fs = require('fs');

@Component({
    route: '/v0'
})
export class EncryptionFeatureComponent implements OnInit {

    constructor( private togglzService: FeatureToggleService, private encryptionService: EncryptionService ) {}

    public onInit(): void {
        try {
            this.encryptionService.setConfiguration(
                new RSA(fs.readFileSync(process.env.PRIVATE_ID,'utf8')),
                new RSA(fs.readFileSync(process.env.PUBLIC_ID,'utf8'))
            );
        } catch ( e ) {
            console.log(e)
        }
    }


    @Get({ route: '/security/public-key' })
    getPublicKey( request: Request, response: Response ) {
        if ( this.checkState(response) ) {
            response
                .status(200)
                .setHeader('Content-Type', 'text/plain')
                .respond(this.encryptionService.getConfiguration().publicKey.exportKey('public'));
        }
    }

    @Post({ route: '/security/encrypted-id/new' })
    getEncryption( request: Request, response: Response ) {
        const userId = (request.json() as CmCreateIdEncryptionPayload).privateId;
        if ( this.checkState(response) ) {
            const cipher: string = this.encryptionService.encrypt(userId);
            response.status(200).respond({ cipher } as CmCipher)
        }
    }


    private checkState( response: Response ): true | undefined {
        if (this.togglzService.isActive('ANONYMOUS_IDS') && this.encryptionService.getConfiguration().privateKey) {
            return true;
        } else if ( !this.togglzService.isActive('ANONYMOUS_IDS') ) {
            response.status(403, 'Anonymization is currently disabled');
            response.respond();
        } else {
            response.status(500, 'Configuration Error');
            response.respond();
        }
    }
}
