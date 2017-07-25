import * as mongoose from "mongoose";

interface ISnapshotDocument extends mongoose.Document {
    user: {
        from: number,
        to: number,
        count: number,
    };
    average: number;
}

const SnapshotSchema = new mongoose.Schema({
    user: {
        from: Number,
        to: Number,
    },
    average: Number,
});

SnapshotSchema.virtual("user.count")
    .get(function(): number {
        return Math.abs(this.user.to - this.user.from);
    });

const Snapshot = mongoose.model<ISnapshotDocument>("GithubRankerSnapshot", SnapshotSchema);

export { Snapshot, ISnapshotDocument };
