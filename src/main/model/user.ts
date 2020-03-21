import * as mongoose from "mongoose";
import { InfectionState } from './client.model';

const uri: string = process.env.MONGO_URL;
const user: string = process.env.MONGO_USR;
const pass: string = process.env.MONGO_PW;

const replica = '?replicaSet=rs0';
const localUri = 'mongodb://0.0.0.0:27017/rsubone';

mongoose.connect(localUri,(error: any) => {
    if (error) {
        console.log(error.message);
    }

});

export interface User extends mongoose.Document {
    infectionState: InfectionState;
    dateOfConfirmedInfection: Date;
    userKey: string;
}

export const UserSchema = new mongoose.Schema({
    infectionState: { type: String, required: true, enum: [ 'HEALTHY', 'CONFIRMED', 'PENDING' ] },
    dateOfConfirmedInfection: { type: Date, required: false },
    userKey: { type: String, required: true }
});

export const UserModelAccessor = mongoose.model<User>('User', UserSchema);
