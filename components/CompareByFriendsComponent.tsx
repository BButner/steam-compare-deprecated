import { useAtomValue } from "jotai"

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

	if (!player.games) return <p>Games are private!</p>

	// get the games that the player and selected players have in common
	const commonGames = player.games.filter((game) =>
		selectedPlayers.every(
			(p) => p.games && p.games.some((g) => g.appid === game.appid),
		),
	)

	return (
		<div className="flex p-4">
			<SteamFriendsComponent
				friends={friends}
				className="mx-auto w-1/2 p-2"
				isCompareMaster
				loaded
			/>
			<SteamGamesComponent
				className="mx-auto w-1/2 p-2"
				games={commonGames}
				readonly
				loaded
			/>
		</div>
	)
}
