async function searchRobloxUsers(query) {
  if (!query) return [];

  const fetch = (await import('node-fetch')).default;

  const res = await fetch(`https://users.roblox.com/v1/usernames/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usernames: [query],
      excludeBannedUsers: true
    })
  });

  const data = await res.json();
  return data.data || [];
}

module.exports = searchRobloxUsers;
