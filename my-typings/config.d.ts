interface IConfig {
    port: string | number;
    mongoUri: string;
    github: {
        token: string,
    };
    amountPerRun: number;
}
