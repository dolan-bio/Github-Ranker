import * as _ from "lodash";
import { Observable } from "rxjs/Rx";

import { ISnapshotDocument, Snapshot } from "../counter/snapshot-model";
import { Summary } from "./summary-model";

export class Summer {

    public summarise(): void {
        const s$ = Observable.fromPromise<ISnapshotDocument[]>(Snapshot.find());

        s$.map((snapshots) => {
            const cList = snapshots.map((o) => o.c);
            const dList = snapshots.map((o) => o.d);
            const averageList = snapshots.map((o) => o.contributions.average);
            const highestList = snapshots.map((o) => o.contributions.highest);

            return {
                totalDocuments: snapshots.length,
                c: _.mean(cList),
                d: _.mean(dList),
                contributions: {
                    average: _.mean(averageList),
                    highest: _.max(highestList),
                },
            };
        }).map((summary) => {
            return new Summary(summary);
        }).subscribe((document) => {
            console.log(document);
            document.save(() => {
                process.exit();
            });
        });
    }
}
