import * as cheerio from "cheerio";
import * as request from "request";
import { Observable } from "rxjs/Rx";

export class ContributionsFetcher {

    public fetch(username: string): Observable<number> {
        const url = `https://github.com/users/${username}/contributions`;

        // tslint:disable-next-line:no-any
        const getAsObservable = Observable.bindCallback<[any, request.RequestResponse, string]>(request.get);
        return getAsObservable({
            url: url,
        }).map(([error, response, body]) => {
            if (error || response.statusCode !== 200) {
                throw new Error(error);
            }

            const $ = cheerio.load(body);

            const contributions: number[] = [];

            $("rect").each(function(): void {
                const count = $(this).attr("data-count");
                contributions.push(parseInt(count, 10));
            });

            const total = contributions.reduce((a, b) => {
                return a + b;
            });

            return total;
        }).retry(10);

    }
}
