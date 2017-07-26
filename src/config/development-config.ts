export const DevelopmentConfig: IConfig = {
    port: process.env.PORT || 9000,
    mongoUri: process.env.MONGODB_URI,
    github: {
        token: process.env.GITHUB_TOKEN,
    },
    amountPerRun: parseInt(process.env.AMOUNT_PER_RUN, 10) || 200,
};
