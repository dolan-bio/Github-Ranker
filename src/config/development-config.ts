export const DevelopmentConfig: IConfig = {
    port: process.env.PORT || 9000,
    mongoUri: process.env.MONGODB_URI,
    github: {
        token: process.env.GITHUB_TOKEN,
    },
};
