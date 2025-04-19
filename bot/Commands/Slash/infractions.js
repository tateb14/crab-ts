const { SlashCommandBuilder } = require('discord.js')
const CrabInfraction = require('../../schemas/CrabInfraction')

module.exports = {
  data: new SlashCommandBuilder()
  .setName("infraction")
  .setDescription("..")
  .addSubcommand(subcommand => subcommand
    .setName("issue")
    .setDescription("Issue an infraction to a staff member.")
    .addUserOption(option => option
      .setName("staff-member")
      .setDescription("Staff member you are to infracting.")
    )
    .addStringOption(option => option
      .setName("infraction-type")
      .setDescription("Type of infraction you are issueing.")
      .addChoices(
        { name: 'Warning', value: 'infraction-warning' },
        { name: 'Strike', value: 'infraction-strike' },
        { name: 'Suspension', value: 'infraction-suspension' },
        { name: 'Termination', value: 'infraction-termination' }
      )
    )
  )
}
