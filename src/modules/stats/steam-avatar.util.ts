import axios from 'axios';

export async function fetchSteamAvatars(
  steamIds: string[],
  apiKey: string,
): Promise<Record<string, string>> {
  if (!apiKey || steamIds.length === 0) return {};
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamIds.join(',')}`;
  try {
    const resp = await axios.get(url);
    const players = resp.data?.response?.players || [];
    // Map steamid to avatarfull
    const map: Record<string, string> = {};
    for (const player of players) {
      if (player.steamid && player.avatarfull) {
        map[player.steamid] = player.avatarfull;
      }
    }
    return map;
  } catch (err) {
    // fail silently, return empty
    return {};
  }
}
