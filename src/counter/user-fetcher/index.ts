import * as _ from "lodash";
import * as request from "request";
import { Observable } from "rxjs/Rx";

const COUNT_PER_PAGE = 100;

interface IStrippedUser {
    login: string;
    id: number;
}

export class UserFetcher {

    public fetch(userId: number): Observable<IStrippedUser> {
        const getAsObservable = Observable.bindCallback<[Error, request.RequestResponse, GithubUserSummary[]]>(request.get);
        return getAsObservable({
            url: `https://api.github.com/users?since=${userId}&per_page=${COUNT_PER_PAGE}`,
            json: true,
            headers: { "user-agent": "node.js" },
        }).map(([err, response, body]) => {
            return body;
        }).flatMap((user) => {
            return user;
        }).map((user) => {
            return _.pick(user, ["login", "id"]);
        });
    }
}
