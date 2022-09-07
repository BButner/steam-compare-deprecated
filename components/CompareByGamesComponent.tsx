import { useAtomValue } from "jotai"

import { SteamPlayer } from "../lib/models/steamPlayer"
import { friendsAtom, selectedSteamGamesAtom } from "../lib/store"
import { SteamFriendsComponent } from "./SteamFriendsComponent"
import { SteamGamesComponent } from "./SteamGamesComponent"

interface CompareByGamesComponentProps {
	player: SteamPlayer
}

export const CompareByGamesComponent: React.FC<CompareByGamesComponentProps> = ({
	player,
}) => {
	const friends = useAtomValue(friendsAtom)
	const selectedGames = useAtomValue(selectedSteamGamesAtom)

	// find the friends that have all of the selected games
	const commonFriends = friends.filter((friend) =>
		selectedGames.every((game) => friend.games?.some((g) => g.appid === game.appid)),
	)

	return (
		<div className="flex p-4">
			<SteamFriendsComponent
				friends={commonFriends}
				className="mx-auto w-1/2 p-2"
				readonly
			/>
			<SteamGamesComponent
				className="mx-auto w-1/2 p-2"
				games={player.games}
				isCompareMaster
			/>
		</div>
	)
}
