import * as mongoose from "mongoose";

interface ISnapshotDocument extends mongoose.Document {
    lastUserId: number;
}

const SnapshotSchema = new mongoose.Schema({
    lastUserId: Number,
});

const Snapshot = mongoose.model<ISnapshotDocument>("GithubRankerSnapshot", SnapshotSchema);

export { Snapshot, ISnapshotDocument };
