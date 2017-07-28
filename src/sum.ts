import * as mongoose from "mongoose";

import { DevelopmentConfig, ProductionConfig } from "./config";
import { Summer } from "./summer";

const config = process.env.NODE_ENV === undefined || process.env.NODE_ENV === "dev" ? DevelopmentConfig : ProductionConfig;

(mongoose as PromiseMongoose).Promise = global.Promise;
mongoose.connect(config.mongoUri);

const summer = new Summer();
summer.summarise();
