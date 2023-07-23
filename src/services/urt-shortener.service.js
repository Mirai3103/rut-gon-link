import databaseInstance from "@/models/db/database.connection";
import UrlShortenerModel from "@/models/url_shortener.model";
import CrawlService from "./crawl.service";

export default class UrlShortenerService {
    static async getByCode(code) {
        const urlShortener = await UrlShortenerModel.findOne({ code: code }).lean();
        return urlShortener;
    }
    static async create({ originalUrl, code, password, userId }) {
        const urlShortener = await UrlShortenerModel.create({ originalUrl, code, password, createdBy: userId });
        CrawlService.crawlUrlInfo({ url: originalUrl }).then((headerHtml) => {
            urlShortener.headerHtml = headerHtml.html;
            urlShortener.title = headerHtml.title;
            urlShortener.save(); //
        });

        return urlShortener;
    }
}
