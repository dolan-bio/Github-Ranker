import * as mongoose from "mongoose";

interface IEducationDocument extends mongoose.Document {
    degree: string;
    fieldOfStudy: string;
    notes: string;
    schoolName: string;
    startDate: {
        year: number,
    };
    endDate: {
        year: number,
    };
}

const EducationSchema = new mongoose.Schema({
    degree: String,
    fieldOfStudy: String,
    notes: String,
    schoolName: String,
    startDate: {
        year: Number,
    },
    endDate: {
        year: Number,
    },
});

const Education = mongoose.model<IEducationDocument>("Education", EducationSchema);

export { Education, IEducationDocument };
