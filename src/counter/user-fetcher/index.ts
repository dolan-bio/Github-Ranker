import * as _ from "lodash";
import * as request from "request";
import { Observable } from "rxjs/Rx";

const COUNT_PER_PAGE = 100;

interface IStrippedUser {
    login: string;
    id: number;
}

export class UserFetcher {
    private currentStartId: number;

    constructor() {
        this.currentStartId = 1;
    }

    public fetch(userId: number): Observable<IStrippedUser> {
        this.currentStartId = userId;

        return Observable.timer(0, 10000).flatMap(() => {
            console.log("running");
            console.log(this.currentStartId);
            return this.getUsers(this.currentStartId);
        });
    }

    private getUsers(startUserId: number): Observable<IStrippedUser> {
        const getAsObservable = Observable.bindCallback<[Error, request.RequestResponse, GithubUserSummary[]]>(request.get);
        return getAsObservable({
            url: `https://api.github.com/users?since=${startUserId}&per_page=${COUNT_PER_PAGE}`,
            json: true,
            headers: { "user-agent": "node.js" },
        }).map(([err, response, body]) => {
            this.currentStartId = body[body.length - 1].id;
            return body;
        }).flatMap((user) => {
            return user;
        }).map((user) => {
            return _.pick(user, ["login", "id"]);
        });
    }
}
