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
            default:
                "https://cdn.discordapp.com/attachments/745580405088059442/1132218031796408320/2696ba1f83b1728c8c1c58216070bfb8.png",
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
