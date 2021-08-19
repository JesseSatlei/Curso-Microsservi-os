import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    ranking: {
        type: String,
    },
    positionRanking: {
        type: Number,
    },
    urlImagePlayer: {
        typeKey: String,
    }
}, { timestamps: true, collection: 'players'});


