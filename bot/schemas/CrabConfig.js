const { Schema, model } = require('mongoose')

const CrabConfig = new Schema({
  crab_DepartmentType: {
    type: String,
    required: false,
  },
  shift_OnDuty: {
    type: String,
    required: false,
  },
  shift_OnBreak: {
    type: String,
    required: false,
  },
  shift_Logs: {
    type: String,
    required: false,
  },
  shift_Types: {
    type: Array,
    required: false,
  },
  perms_PersonnelRole: {
    type: String,
    required: false,
  },
  perms_SupervisorRole: {
    type: String,
    required: false,
  },
  perms_HiCommRole: {
    type: String,
    required: false,
  },
  perms_AllAccessRole: {
    type: String,
    required: false,
  },
  report_Logs: {
    type: String,
    required: false,
  },
  records_Logs: {
    type: String,
    required: false,
  },
  infract_Logs: {
    type: String,
    required: false,
  },
  promote_Logs: {
    type: String,
    required: false,
  },
  demote_Logs: {
    type: String,
    required: false,
  },
  crab_Prefix: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const crabConfig = model("Configuration", CrabConfig);

module.exports = crabConfig;
