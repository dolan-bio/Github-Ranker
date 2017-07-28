import * as mongoose from "mongoose";

interface ISnapshotDocument extends mongoose.Document {
    user: {
        from: number,
        to: number,
        count: number,
    };
    c: number;
    d: number;
    contributions: {
        average: number,
        highest: number,
    };
}

const SnapshotSchema = new mongoose.Schema(
    {
        user: {
            from: Number,
            to: Number,
            count: Number,
        },
        c: Number,
        d: Number,
        contributions: {
            average: Number,
            highest: Number,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    });

const Snapshot = mongoose.model<ISnapshotDocument>("GithubRankerSnapshot", SnapshotSchema);

export { Snapshot, ISnapshotDocument };
