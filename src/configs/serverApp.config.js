const serverAppConfig = {
    app: {
        port: parseInt(process.env.PORT || "3000"),
        env: process.env.NODE_ENV | "development",
    },
    db: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "27017"),
        name: process.env.DB_NAME || "url_shortener",
        password: process.env.DB_PASSWORD || "",
        user: process.env.DB_USER || "",
    },
    auth: {
        accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "1d",
    },
};

export default serverAppConfig;
