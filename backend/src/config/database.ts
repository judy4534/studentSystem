import mongoose from 'mongoose';
import process from 'process';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
           console.error(`Error: ${error.message}`);
        } else {
           console.error('An unknown error occurred during DB connection');
        }
        process.exit(1);
    }
};

export default connectDB;