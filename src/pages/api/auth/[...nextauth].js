import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import UserService from "@/services/user.service";
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = { id: 1, name: "Admin" };
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            new Promise(async (resolve, reject) => {
                if (account.provider === "credentials") {
                    resolve(true);
                    return;
                }
                if (await UserService.findUserByEmail(user.email)) {
                    resolve(true);
                } else {
                    await UserService.create({
                        email: user.email,
                        name: user.name,
                        role: "user",
                        isBlocked: false,
                        avatar: user.image,
                        provider: account.provider,
                    });
                    resolve(true);
                }
            }).then();
            return true;
        },
    },
    secret: process.env.JWT_SECRET || "cc",
};
export default NextAuth(authOptions);
