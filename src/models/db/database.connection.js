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
        const { host, name, password, port, user } = appConfig.db;
        const connectionString = `${type}://${host}:${port}/${name}`;
        // mongoose.set("debug", false);
        // mongoose.set("debug", { color: true });

        mongoose
            .connect(connectionString, {
                pass: password.length > 0 ? password : undefined,
                maxPoolSize: 50,
                user: user.length > 0 ? user : undefined,
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
