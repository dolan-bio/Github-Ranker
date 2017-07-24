import { Observable } from "rxjs/Rx";

import { ContributionsFetcher } from "./contributions-fetcher";
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
        const userId = 0; // retreieve from db;

        this.getCombinedContributionData(userId).bufferCount(50).subscribe((data) => {
            console.log(data);
            // console.log(data.length);
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
