import UserService from "@/services/user.service";

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return await POST(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function POST(req, res) {
    const { name, email, password } = req.body;
    if (name && email && password) {
        const existedUser = await UserService.findUserByEmail(email);
        if (existedUser) {
            return res.status(400).json({
                message: "Email đã  tồn tại",
            });
        }
        const user = await UserService.register({ name, email, password });
        return res.status(200).json({
            _id: user._id,
        });
    }
    return res.status(400).end();
}
