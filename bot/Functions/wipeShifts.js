const cron = require("node-cron")
const UserShifts = require("../schemas/UserShift")
async function wipeShifts() {
  cron.schedule("0 0 * * 0", async () => {
    console.log("[CRON] Resetting all shifts...");
    try {
      await UserShifts.updateMany({}, { $set: { shift_Total: 0, shift_TotalBreakTime: 0, shift_endBreak: 0, shift_OnDuty: false, shift_OnBreak: false, shift_start: 0, shift_startBreak: 0, shift_Type: null } });
      console.log("[CRON] All shifts successfully reset.");
    } catch (error) {
      console.error("[CRON] Failed to reset shifts:", error);
    }
  })
}

module.exports = wipeShifts
