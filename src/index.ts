import * as mongoose from "mongoose";

import { DevelopmentConfig, ProductionConfig } from "./config";
import { Counter } from "./counter";

const config = process.env.NODE_ENV === undefined || process.env.NODE_ENV === "dev" ? DevelopmentConfig : ProductionConfig;

(mongoose as PromiseMongoose).Promise = global.Promise;
mongoose.connect(config.mongoUri);

const counter = new Counter();
counter.count();
