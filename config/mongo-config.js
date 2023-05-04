import { connect } from 'mongoose';

export const connection = async () => {
    const mongoDbUri = process.env.MONGO_DB_URI ? process.env.MONGO_DB_URI : 'mongodb://127.0.0.1:27017/devCamper';
    const conn = await connect(mongoDbUri);
    console.log(`MongoDB connected with uri ${mongoDbUri}`);
};