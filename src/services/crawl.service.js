import axios from "axios";
import { load } from "cheerio";
export default class CrawlService {
    static async crawlUrlInfo({ url }) {
        const res = await axios.get(url);
        const body = res.data;
        const $ = load(body);
        const titleHtml = $.html($("title"));
        const allMetaHtml = $("meta")
            .map((i, el) => $.html(el))
            .get()
            .join("");
        return {
            html: titleHtml + allMetaHtml,
            title: $("title").text(),
        };
    }
}
