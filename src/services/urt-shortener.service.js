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
}
