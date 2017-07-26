import * as mongoose from "mongoose";

interface IResultDocument extends mongoose.Document {
    average: number;
    totalDocuments: number;
    myRank: number;
    myContributions: number;
    deltaRatio: number;
    absoluteRatio: number;
}

const ResultSchema = new mongoose.Schema(
    {
        average: Number,
        totalDocuments: Number,
        myRank: Number,
        myContributions: Number,
        deltaRatio: Number,
        absoluteRatio: Number,
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    });

const Result = mongoose.model<IResultDocument>("GithubRankerResult", ResultSchema);

export { Result, IResultDocument };
