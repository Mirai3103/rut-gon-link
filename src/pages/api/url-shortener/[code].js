import UrlShortenerService from "@/services/urt-shortener.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import UserService from "@/services/user.service";
export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return await POST(req, res);
        case "GET":
            return await GET(req, res);
        default:
            return res.status(405).end(); //Method Not Allowed
    }
}

async function POST(req, res) {
    const password = req.body.password;
    const { code } = req.query;
    const url = await UrlShortenerService.getByCode(code, true);
    if (url && url.password === password) {
        return res.status(200).json(url);
    } else {
        return res.status(404).end();
    }
}

async function GET(req, res) {
    // get id from dynamic route
    const { code } = req.query;
    const url = await UrlShortenerService.getByCode(code, true);
    if (url) {
        res.status(200).json({
            ...url,
            password: undefined,
            isHasPassword: !!url.password,
            originalUrl: url.password ? undefined : url.originalUrl,
            headerHtml: url.password ? undefined : url.headerHtml,
        });
    } else {
        res.status(404).end();
    }
}
