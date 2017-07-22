import * as mongoose from "mongoose";
import * as logger from "winston";

import { StatusRouter } from "./api/status";

import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { DevelopmentConfig, ProductionConfig } from "./config";
import { ContributionsScraper } from "./contributions-scraper/index";

const config = process.env.NODE_ENV === undefined || process.env.NODE_ENV === "dev" ? DevelopmentConfig : ProductionConfig;

(mongoose as PromiseMongoose).Promise = global.Promise;
mongoose.connect(config.mongoUri);

const appWrapper = new ApplicationWrapper(config);

appWrapper.configure((app) => {
    logger.debug("Configuring application routes");
    app.use("/status", new StatusRouter(config).router);
});

appWrapper.start();

const scraper = new ContributionsScraper();
scraper.fetch();