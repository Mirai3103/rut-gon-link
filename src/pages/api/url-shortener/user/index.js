import UrlShortenerService from "@/services/urt-shortener.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserService from "@/services/user.service";
export default async function handler(req, res) {
    switch (req.method) {
        // case "POST":
        //     return await POST(req, res);
        case "GET":
            return await GET(req, res);
        default:
            return res.status(405).end(); //Method Not Allowed
    }
}

async function POST(req, res) {}

async function GET(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).end();
    }
    const { email } = session.user;
    const links = await UrlShortenerService.getAllLinkCreateByUser({ email });
    res.status(200).json(links);
}
