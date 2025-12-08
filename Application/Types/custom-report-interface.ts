import { Document } from "mongoose";

export interface CustomReportInterface extends Document {
    crab_ReportName: string;
    crab_ReportField1Label: string;
    crab_ReportField1PlaceHolder: string;
    crab_ReportField2Label: string;
    crab_ReportField2PlaceHolder: string;
    crab_ReportField3Label: string;
    crab_ReportField3PlaceHolder: string;
    crab_ReportId: string;
    guildId: string;
}
