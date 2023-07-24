import UrlShortenerService from "@/services/urt-shortener.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import UserService from "@/services/user.service";
export default async function handler(req, res) {
    switch (req.method) {
        case "DELETE":
            return await DELETE(req, res);
        case "PATCH":
            return await PATCH(req, res);
        case "POST":
            return await POST(req, res);
        case "GET":
            return await GET(req, res);
        default:
            return res.status(405).end(); //Method Not Allowed
    }
}
async function DELETE(req, res) {
    const { code } = req.query;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).end();
    }
    const { email } = session.user;
    const isDeleted = await UrlShortenerService.delete({ code, ownerEmail: email });
    return res.status(200).json({ isDeleted });
}

async function PATCH(req, res) {
    const { oldCode, newCode, password } = req.body;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).end();
    }
    const { email } = session.user;
    const url = await UrlShortenerService.update({ oldCode, newCode, password, ownerEmail: email });
    return res.status(200).json(url);
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
