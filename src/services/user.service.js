import databaseInstance from "@/models/db/database.connection";
import UserModel from "@/models/user.model";

export default class UserService {
    static async create({ email, password, name, role, isBlocked, avatar, provider }) {
        const user = await UserModel.create({ email, password, name, role, isBlocked, avatar, provider });
        return user;
    }

    static async findUserByEmail(email) {
        const user = await UserModel.findOne({ email });
        return user;
    }
}
