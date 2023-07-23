import UrlShortenerService from "@/services/urt-shortener.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import UserService from "@/services/user.service";
export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return await POST(req, res);
        default:
            return res.status(405).end(); //Method Not Allowed
    }
}

async function POST(req, res) {
    const session = await getServerSession(req, res, authOptions);
    let userId = null;
    if (session) {
        const user = await UserService.findUserByEmail(session.user.email);
        userId = user._id;
    }

    const { originalUrl, code, password } = req.body;
    const url = await UrlShortenerService.create({
        originalUrl,
        code,
        password,
        userId,
    });
    res.status(200).json(url);
}
