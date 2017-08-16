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
            console.log(`Ticking in timer: ${this.currentStartId}`);
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
            return body;
        }).do((body) => {
            const endId = body[body.length - 1].id;
            const isReachedEnd = endId === startUserId;
            // Reset back to 1 if reached end of Github database
            if (isReachedEnd) {
                console.warn("WARNING: Reached end of database. If this doesn't seem right, then something went wrong.");
            }
            this.currentStartId = isReachedEnd ? endId : 1;
        }).retry(5).flatMap((user) => {
            return user;
        }).map((user) => {
            return _.pick(user, ["login", "id"]);
        });
    }
}
