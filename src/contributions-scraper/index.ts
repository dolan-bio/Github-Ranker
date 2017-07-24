import * as cheerio from "cheerio";
import * as request from "request";
import { Observable } from "rxjs/Rx";

export class ContributionsScraper {

    public fetch(username: string): void {
        const url = `https://github.com/users/${username}/contributions`;

        const getAsObservable = Observable.bindCallback<[Error, request.RequestResponse, string]>(request.get);
        const contributionCount$ = getAsObservable({
            url: url,
        }).map(([error, response, body]) => {
            if (error || response.statusCode !== 200) {
                console.error(error);
                console.error(body);
                return;
            }

            const $ = cheerio.load(body);

            const contributions: number[] = [];

            $("rect").each(function(): void {
                const count = $(this).attr("data-count");
                contributions.push(parseInt(count, 10));
            });

            console.log(contributions.reduce((a, b) => {
                return a + b;
            }));
        });

        contributionCount$.subscribe();
    }
}
