import { Injectable } from 'skeidjs';
import { InfectionState } from '../model/client.model';
import { User, UserModelAccessor } from '../model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import moment = require('moment');

@Injectable()
export class InfectionService {

    private readonly updates$: BehaviorSubject<User>;

    constructor() {
        this.updates$ = new BehaviorSubject<User>(undefined);
    }

    patchUserInfection( id: string, infectionState: InfectionState ): Promise<void> {
        const dateOfConfirmedInfection = infectionState === InfectionState.CONFIRMED ? moment().toDate() : null;

        return UserModelAccessor.findOneAndUpdate({ _id: id }, { infectionState, dateOfConfirmedInfection })
            .exec().then(usr => this.updates$.next(usr));
    }

    findInfectionByIdAndDate( id: string, date: Date ): Promise<Array<User>> {
        const riskDate = moment(date).subtract(28, 'days').toDate();
        return UserModelAccessor.find({ _id: id, dateOfConfirmedInfection: { $gte: riskDate, $lt: date } }).exec();
    }

    hadContactWithContaminated( contactList: Array<string> ): Promise<boolean> {
        return Promise.all(contactList.map(contact => this.findInfectionByIdAndDate(contact, moment().toDate())))
            .then(results => !!results.filter(r => !!r.length).length);
    }

    observePotentialContaminationWithContactList( contactList: Array<string> ): Observable<boolean> {
        const riskDetection$ = new BehaviorSubject(false);
        this.hadContactWithContaminated(contactList).then(contact => riskDetection$.next(contact));
        this.updates$.pipe(
            filter(user =>
                !!contactList.filter(id => user._id === id && user.infectionState === InfectionState.CONFIRMED).length
            )
        ).subscribe(_ => riskDetection$.next(true));

        return riskDetection$;
    }
}
