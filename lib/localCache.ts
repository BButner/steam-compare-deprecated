import { ISteamPlayer } from "./models/steamPlayer"

export interface ICachedPlayer {
	steamId: string
	personaName: string
}

export const savePlayerToLocalCache = (player: ISteamPlayer) => {
	const players: ICachedPlayer[] = JSON.parse(
		localStorage.getItem("players") || "[]",
	) as ICachedPlayer[]

	// If the player is already in the cache, remove it
	const filteredPlayers = players.filter((p) => p.steamId !== player.steamId)

	filteredPlayers.push({ steamId: player.steamId, personaName: player.personaName })

	localStorage.setItem("players", JSON.stringify(filteredPlayers))
}

export const getPlayersFromLocalCache = (): ICachedPlayer[] => {
	return JSON.parse(localStorage.getItem("players") || "[]") as ICachedPlayer[]
}
