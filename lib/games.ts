import { ISteamGame } from "./models/steamGame"
import { IFriendGameEntry } from "./store"

export const loadGames = async (steamId: string): Promise<ISteamGame[]> => {
	return fetch(`/api/user/${steamId}/games`)
		.then((resp) => resp.json())
		.then((games: ISteamGame[]) => games)
		.catch((_) => [])
}

export const loadGamesWithSteamId = async (
	steamId: string,
): Promise<IFriendGameEntry> => {
	return loadGames(steamId).then((games) => ({ steamId, games }))
}
