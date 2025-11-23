import { Document } from "mongoose";

export interface ConfigInterface extends Document {
    crab_DepartmentType: string;
    crab_Prefix: string;
    shift_OnDuty: string;
    shift_OnBreak: string;
    shift_Logs: string;
    shift_Types: string[];
    perms_PersonnelRole: string;
    perms_SupervisorRole: string;
    perms_HiCommRole: string;
    perms_AllAccessRole: string;
    report_Logs: string;
    records_Logs: string;
    punish_Logs: string;
    promote_Logs: string;
    crab_AppealLink: string;
    guildId: string;
}
