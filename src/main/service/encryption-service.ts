import { Injectable } from 'skeidjs';

import * as RSA from 'node-rsa';

@Injectable()
export class EncryptionService {
    private static rsaKeyPrivate: RSA = null;

    private static rsaKeyPublic: RSA = null;

    public getConfiguration(): { privateKey: RSA, publicKey: RSA } {
        return { privateKey: EncryptionService.rsaKeyPrivate, publicKey: EncryptionService.rsaKeyPublic };
    }

    public setConfiguration( privateKey: RSA, publicKey: RSA ) {
        if (EncryptionService.rsaKeyPrivate === null && EncryptionService.rsaKeyPublic === null) {
            EncryptionService.rsaKeyPrivate = privateKey;
            EncryptionService.rsaKeyPublic = publicKey;
        }
    }

    public decrypt(something: unknown): string {
        return EncryptionService.rsaKeyPrivate.decrypt(something, 'utf8');
    }
}
