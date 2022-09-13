import { ISteamPlayer, SteamPlayer } from "./models/steamPlayer"

export const loadFriends = async (steamId: string): Promise<SteamPlayer[]> => {
	return fetch(`/api/user/${steamId}/friends`)
		.then((resp) => resp.json())
		.then((friends: ISteamPlayer[]) => friends.map((f) => new SteamPlayer(f)))
		.catch((_) => [])
}
