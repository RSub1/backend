import { Injectable } from 'skeidjs';
import { UserModelAccessor } from '../model/user';

@Injectable()
export class UserService {
    constructor() {}

    createNew(): Promise<string> {
        return UserModelAccessor.create({ infectionState: null , dateOfConfirmedInfection: null })
            .then(u => u._id).catch(console.log);
    }
}
