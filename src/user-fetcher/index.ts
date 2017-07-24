import * as request from "request";
import { Observable } from "rxjs/Rx";

const COUNT_PER_PAGE = 100;

export class UserFetcher {

    public fetch(userId: number): void {
        const getAsObservable = Observable.bindCallback<[Error, request.RequestResponse, GithubUserSummary[]]>(request.get);
        const users$ = getAsObservable({
            url: `https://api.github.com/users?since=${userId}&per_page=${COUNT_PER_PAGE}`,
            json: true,
            headers: { "user-agent": "node.js" },
        }).map(([err, response, body]) => {
            console.log(body.length);
        });

        users$.subscribe();
    }
}
