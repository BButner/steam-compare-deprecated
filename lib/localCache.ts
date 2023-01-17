import { ISteamPlayer } from "./models/steamPlayer"

export interface ICachedPlayer {
	steamId: string
	personaName: string
}

export const savePlayerToLocalCache = (player: ISteamPlayer) => {
	console.log("Saving player to local cache", player)

	const players: ICachedPlayer[] = JSON.parse(
		localStorage.getItem("players") || "[]",
	) as ICachedPlayer[]

	// If the player is already in the cache, remove it
	const filteredPlayers = players.filter((p) => p.steamId !== player.steamId)

	filteredPlayers.push({ steamId: player.steamId, personaName: player.personaName })

	localStorage.setItem("players", JSON.stringify(filteredPlayers))
}

export const getPlayersFromLocalCache = (): ICachedPlayer[] => {
	let players = JSON.parse(localStorage.getItem("players") || "[]") as ICachedPlayer[]

	// check players for any that are no longer valid
	players = players.filter(
		(p) => p.steamId !== undefined && p.personaName !== undefined,
	)

	return players
}
