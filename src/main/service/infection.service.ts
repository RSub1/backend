import { Injectable } from 'skeidjs';
import { InfectionState } from '../model/client.model';
import { User, UserModelAccessor } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import moment = require('moment');

@Injectable()
export class InfectionService {

    constructor() {

    }

    patchUserInfection( userKey: string, infectionState: InfectionState ): Promise<void> {
        const dateOfConfirmedInfection = infectionState === InfectionState.CONFIRMED ? moment().toDate() : null;
        return UserModelAccessor.findOneAndUpdate({ userKey }, { infectionState, dateOfConfirmedInfection })
            .exec().then();
    }

    findInfectionByIdAndDate( userKey: string, date: Date ): Promise<Array<User>> {
        const riskDate = moment(date).subtract(28, 'days').toDate();
        return UserModelAccessor.find({ dateOfConfirmedInfection: { $gte: riskDate, $lt: date } }).exec();
    }

    hadContactWithContaminated( contactList: Array<string> ): Promise<boolean> {
        return Promise.all(contactList.map(contact => this.findInfectionByIdAndDate(contact, moment().toDate())))
            .then(results => !!results.filter(r => !!r.length).length);
    }

    observePotentialContaminationWithContactList( contactList: Array<string> ) {
        const changes$ = new BehaviorSubject(false);
        this.hadContactWithContaminated(contactList).then(contact => changes$.next(contact));
        const pipeline = [{
            $match: ''
        }]
        UserModelAccessor.watch().on('change', (change) => {
            console.log(change)

        });


    }
}
