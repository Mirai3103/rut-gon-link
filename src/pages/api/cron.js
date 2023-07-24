import UrlShortenerService from "@/services/urt-shortener.service";

export default async function handler(req, res) {
    await UrlShortenerService.clearUnusedLink();
    res.status(200).end();
}
