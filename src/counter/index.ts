import * as _ from "lodash";
import { Observable } from "rxjs/Rx";

import { ContributionsFetcher } from "./contributions-fetcher";
import { ISnapshotDocument, Snapshot } from "./snapshot-model";
import { UserFetcher } from "./user-fetcher";

interface IUserContributionData {
    login: string;
    id: number;
    contributions: number;
}

export class Counter {
    private userFetcher: UserFetcher;
    private contributionsFetcher: ContributionsFetcher;

    constructor() {
        this.userFetcher = new UserFetcher();
        this.contributionsFetcher = new ContributionsFetcher();
    }

    public count(): void {
        const s$ = Observable.fromPromise<ISnapshotDocument>(Snapshot.findOne().sort("-created_at").sort("-created_at"));

        s$.flatMap((snapshot) => {
            const userId = snapshot ? snapshot.user.to : 0;

            return this.getCombinedContributionData(userId).take(200).toArray().map((data) => {
                return data.sort((a, b) => {
                    return a.id > b.id ? 1 : -1;
                });
            });
        }).subscribe((data) => {
            const snapshot = new Snapshot({
                user: {
                    from: data[0].id,
                    to: data[data.length - 1].id,
                    count: data.length,
                },
                average: _.meanBy(data, (o) => o.contributions),
            });
            snapshot.save();
            process.exit();
        });
    }

    private getCombinedContributionData(startId: number): Observable<IUserContributionData> {
        return this.userFetcher.fetch(startId)
            .flatMap((user) => {
                return this.contributionsFetcher.fetch(user.login).map((count) => {
                    return {
                        login: user.login,
                        id: user.id,
                        contributions: count,
                    };
                });
            });
    }
}
