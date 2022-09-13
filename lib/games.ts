import { ISteamGame } from "./models/steamGame"

export const loadGames = async (steamId: string): Promise<ISteamGame[]> => {
	return fetch(`/api/user/${steamId}/games`)
		.then((resp) => resp.json())
		.then((games: ISteamGame[]) => games)
		.catch((_) => [])
}
