const ShiftCommands = require("../Commands/Slash/shift")
const PunishmentCommands = require("../Commands/Slash/infractions")
const PromotionCommands = require("../Commands/Slash/promotion")
const RecordCommands = require("../Commands/Slash/records")
const ReportCommands = require("../Commands/Slash/reports")

module.exports = {
  shifts: {
    name: "Shifts",
    command: ShiftCommands
  },
  infraction: {
    name: "Punishments",
    command: PunishmentCommands
  },
  promotion: {
    name: "Promotions",
    command: PromotionCommands
  },
  record: {
    name: "Records",
    command: RecordCommands
  },
  report: {
    name: "Reports",
    command: ReportCommands
  },
}
