import mongoose from "mongoose";
import 'dotenv/config';

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DaTaBaSe =======>")
    })
}

export default connectDB;