import mongoose from "mongoose";
import appConfig from "@/configs/serverApp.config";

class Database {
    static _instance;
    constructor() {
        this._connect();
    }

    _connect(type = "mongodb") {
        if (this.isConnected()) {
            return;
        }
        const connectionString = process.env.DB_URI;
        // mongoose.set("debug", false);
        // mongoose.set("debug", { color: true });

        mongoose
            .connect(connectionString, {
                maxPoolSize: 50,
            })
            .then(() => console.log("Database connected"))
            .catch((err) => console.log("Error connecting to database", err));
    }
    isConnected() {
        return mongoose.connection?.readyState === 1;
    }

    static getInstance() {
        if (!Database._instance) {
            Database._instance = new Database();
        }
        return Database._instance;
    }
}

const databaseInstance = Database.getInstance();

export default databaseInstance;
