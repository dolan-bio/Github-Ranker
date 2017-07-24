import { ContributionsFetcher } from "./contributions-fetcher";
import { UserFetcher } from "./user-fetcher";

export class Counter {
    private userFetcher: UserFetcher;
    private contributionsFetcher: ContributionsFetcher;

    constructor() {
        this.userFetcher = new UserFetcher();
        this.contributionsFetcher = new ContributionsFetcher();
    }

    public count(): void {
        const userId = 0; // retreieve from db;

        this.userFetcher.fetch(userId)
            .flatMap((user) => {
                return this.contributionsFetcher.fetch(user.login).map((count) => {
                    return {
                        login: user.login,
                        id: user.id,
                        contributions: count,
                    };
                });
            }).subscribe((data) => {
                console.log(data);
                // console.log(data.length);
            });
    }
}
