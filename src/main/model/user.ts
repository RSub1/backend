import * as mongoose from "mongoose";
import { InfectionState } from './client.model';

const uri: string = process.env.MONGO_URL;
const user: string = process.env.MONGO_USR;
const pass: string = process.env.MONGO_PW;

const env = process.env.ENV;

const localUri = 'mongodb://0.0.0.0:27017/rsubone';

if(env === 'dev') {
    mongoose.connect(localUri, _ => {});
} else {
    mongoose.connect(uri, { user, pass }, _ => {});
}


export interface User extends mongoose.Document {
    infectionState: InfectionState;
    dateOfConfirmedInfection: Date;
}

export const UserSchema = new mongoose.Schema({
    infectionState: { type: String, required: false, enum: [ 'HEALTHY', 'CONFIRMED', 'PENDING', null ] },
    dateOfConfirmedInfection: { type: Date, required: false },
});

export const UserModelAccessor = mongoose.model<User>('users', UserSchema);
