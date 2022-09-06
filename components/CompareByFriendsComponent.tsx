import { useAtomValue } from "jotai"
import { useEffect } from "react"

import { SteamPlayer } from "../lib/models/steamPlayer"
import { friendsAtom, selectedSteamPlayersAtom } from "../lib/store"
import { SteamFriendsComponent } from "./SteamFriendsComponent"
import { SteamGamesComponent } from "./SteamGamesComponent"

interface ComareByFriendsComponentProps {
	player: SteamPlayer
}

export const CompareByFriendsComponent: React.FC<ComareByFriendsComponentProps> = ({
	player,
}) => {
	const friends = useAtomValue(friendsAtom)
	const selectedPlayers = useAtomValue(selectedSteamPlayersAtom)

	// get the games that the player and selected players have in common
	const commonGames = player.games.filter((game) =>
		selectedPlayers.every((p) => p.games.some((g) => g.appid === game.appid)),
	)

	return (
		<div className="flex">
			<SteamFriendsComponent className="w-1/3 p-2" />
			<SteamGamesComponent games={commonGames} />
		</div>
	)
}
