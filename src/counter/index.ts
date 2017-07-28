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

    constructor(private amountToTake: number) {
        this.userFetcher = new UserFetcher();
        this.contributionsFetcher = new ContributionsFetcher();
    }

    public count(): void {
        const s$ = Observable.fromPromise<ISnapshotDocument>(Snapshot.findOne().sort("-created_at").sort("-created_at"));

        s$.flatMap((snapshot) => {
            const userId = snapshot ? snapshot.user.to : 0;

            return this.getCombinedContributionData(userId).take(this.amountToTake).toArray().map((data) => {
                return data.sort((a, b) => {
                    return a.id > b.id ? 1 : -1;
                });
            });
        }).map((data) => {
            const map = new Map<number, number>();

            data.forEach((o) => {
                const key = Math.ceil(o.contributions / 100) * 100;

                if (map.has(key)) {
                    const currentCount = map.get(key);
                    map.set(key, currentCount + 1);
                } else {
                    map.set(key, 1);
                }
            });

            return { map, data };
        }).map((res) => {
            const c = this.calculateC(res.map);
            const dList: number[] = [];

            res.map.forEach((value, key) => {
                dList.push(this.calculateD(key, value, c));
            });

            return {
                map: res.map,
                data: res.data,
                c: c,
                dList: dList.filter((d) => !isNaN(d)),
            };
        }).subscribe((res) => {
            // c and d are constants to model the y = e^(-dx) graph
            const highestUser = _.maxBy(res.data, (o) => o.contributions);
            const snapshot = new Snapshot({
                user: {
                    from: res.data[0].id,
                    to: res.data[res.data.length - 1].id,
                    count: res.data.length,
                },
                c: res.c,
                d: _.mean(res.dList),
                contributions: {
                    average: _.meanBy(res.data, (o) => o.contributions),
                    highest: highestUser.contributions,
                },
            });
            console.log(snapshot);
            console.log(highestUser);
            snapshot.save().then(() => {
                process.exit();
            });
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

    private calculateC(map: Map<number, number>): number {
        const c = map.get(0);

        if (!c) {
            throw new Error("Dataset doesn't have 0 value");
        }

        return c;
    }

    private calculateD(contributions: number, frequency: number, c: number): number {
        const d = -(1 / contributions) * Math.log(c / frequency);

        return d;
    }
}
