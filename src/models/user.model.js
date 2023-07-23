import mongoose from "mongoose";
import crypto from "crypto";

const COLLECTION_NAME = "users";
const DOCUMENT_NAME = "user";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            default: crypto.randomBytes(20).toString("hex"),
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
            enum: ["admin", "user"],
            default: "user",
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        avatar: {
            type: String,
            required: false,
            trim: true,
        },
        provider: {
            type: String,
            required: false,
            trim: true,
            default: "local",
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const User = mongoose.models[DOCUMENT_NAME] || mongoose.model(DOCUMENT_NAME, userSchema);

export default User;
