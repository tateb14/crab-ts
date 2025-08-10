async function detectIdType(client, ID) {
  const user = await client.users.fetch(ID).catch(() => null)
  if (user) return { type: 'user', object: user };
  const guild = await client.guilds.fetch(ID).catch(() => null)
  if (guild) return { type: 'guild', object: guild };

  return { type: 'unknown', object: null };
}

module.exports = detectIdType
