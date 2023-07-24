import databaseInstance from "@/models/db/database.connection";
import UrlShortenerModel from "@/models/url_shortener.model";
import UserModel from "@/models/user.model";
import CrawlService from "./crawl.service";

export default class UrlShortenerService {
    static async getByCode(code, isVisitsIncrement = false) {
        const urlShortener = await UrlShortenerModel.findOne({ code: code }).lean();
        if (urlShortener && isVisitsIncrement) {
            UrlShortenerModel.updateOne({ code: code }, { $inc: { visits: 1 } }).exec();
        }
        return urlShortener;
    }
    static async create({ originalUrl, code, password, userId }) {
        const urlShortener = await UrlShortenerModel.create({ originalUrl, code, password, createdBy: userId });
        await new Promise((resolve, reject) => {
            CrawlService.crawlUrlInfo({ url: originalUrl })
                .then(async (headerHtml) => {
                    urlShortener.headerHtml = headerHtml.html;
                    urlShortener.title = headerHtml.title;
                    await urlShortener.save(); //
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return urlShortener;
    }
    static async getAllLinkCreateByUser({ email }) {
        const { _id } = await UserModel.findOne({ email }).lean();
        const urlShorteners = await UrlShortenerModel.find({ createdBy: _id }).lean();
        return urlShorteners;
    }
    static async update({ oldCode, newCode, password, ownerEmail }) {
        const { _id } = await UserModel.findOne({ email: ownerEmail }).lean();
        const url = await UrlShortenerModel.findOne({ code: oldCode, createdBy: _id });
        if (url) {
            url.code = newCode === undefined ? oldCode : newCode;
            url.password = password === undefined ? url.password : password;
            await url.save();
            return url;
        }
        return null;
    }

    static async delete({ code, ownerEmail }) {
        const { _id } = await UserModel.findOne({ email: ownerEmail }).lean();
        const url = await UrlShortenerModel.deleteOne({ code: code, createdBy: _id });
        if (url.deletedCount > 0) {
            return true;
        }
        return false;
    }
    static async clearUnusedLink() {
        // delete where createdAt < 24h and created by anonymous
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const urlShorteners = await UrlShortenerModel.find({
            createdAt: { $lt: yesterday },
            createdBy: null,
        }).lean();
        const ids = urlShorteners.map((item) => item._id);
        await UrlShortenerModel.deleteMany({ _id: { $in: ids } });
    }
}
