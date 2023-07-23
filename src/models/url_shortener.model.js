import mongoose from "mongoose";
import UserModel from "./user.model";
const COLLECTION_NAME = "url_shorteners";
const DOCUMENT_NAME = "url_shortener";

const urlShortenerSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        visits: {
            type: Number,
            required: true,
            default: 0,
        },
        password: {
            type: String,
            required: false,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: UserModel,
            required: false,
        },
        headerHtml: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const UrlShortener = mongoose.models[DOCUMENT_NAME] || mongoose.model(DOCUMENT_NAME, urlShortenerSchema);

export default UrlShortener;
