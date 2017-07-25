import * as mongoose from "mongoose";

interface ISnapshotDocument extends mongoose.Document {
    user: {
        from: number,
        to: number,
        count: number,
    };
    average: number;
}

const SnapshotSchema = new mongoose.Schema(
    {
        user: {
            from: Number,
            to: Number,
            count: Number,
        },
        average: Number,
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    });

const Snapshot = mongoose.model<ISnapshotDocument>("GithubRankerSnapshot", SnapshotSchema);

export { Snapshot, ISnapshotDocument };
