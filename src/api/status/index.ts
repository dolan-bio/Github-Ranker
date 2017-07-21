import { Request, Response, Router } from "express";
import * as logger from "winston";

import { EducationsFetcher } from "./educations-fetcher";

export class StatusRouter {
    public router: Router;
    private educationsFetcher: EducationsFetcher;

    constructor(config: IConfig) {
        this.router = Router();
        this.educationsFetcher = new EducationsFetcher();

        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            logger.debug("Getting educations");
            this.educationsFetcher.WhenFetchedEducations.subscribe((data) => {
                res.status(200).send(data);
            }, (err) => {
                logger.error(err);
                const errorResponse: ServerError = {
                    message: "Something went wrong with the server",
                };
                res.status(500).send(errorResponse);
            });
        });
    }
}
