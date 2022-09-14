import { Switch } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { loadFriends } from "../lib/friends"
import { loadGames } from "../lib/games"
import { ISteamGame } from "../lib/models/steamGame"
import { SteamPlayer } from "../lib/models/steamPlayer"
import {
	currentPlayerAtom,
	friendsAtom,
	friendsGamesAtom,
	selectedSteamPlayersAtom,
} from "../lib/store"
import { LoadingBarComponent } from "./LoadingBarComponent"

export const SteamFriends: React.FC = () => {
	const player = useAtomValue(currentPlayerAtom)
	const [friends, setFriends] = useAtom(friendsAtom)
	const [friendsLoading, setFriendsLoading] = useState(true)
	const [selectedFriends, setSelectedFriends] = useAtom(selectedSteamPlayersAtom)
	const [friendsGames, setFriendsGames] = useAtom(friendsGamesAtom)
	const [filter, setFilter] = useState("")

	useEffect(() => {
		if (!player) return

		if (friends.length === 0) {
			void loadFriends(player.steamId).then((friends) => {
				setFriends(friends)
				setFriendsLoading(false)
			})
		} else {
			setFriendsLoading(false)
		}

		console.log(commonGames)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player, selectedFriends])

	if (!player?.games) return <></>

	const hasInvalidGames = (steamId: string): boolean => {
		// check if the player is in friendsGames, but has no games
		const friendGames = friendsGames.find((friend) => friend.steamId === steamId)
		if (!friendGames) return false
		return friendGames.games.length === 0
	}

	const commonGames = player.games.filter((game) => {
		return friendsGames
			.filter((friendGameEntry) => !hasInvalidGames(friendGameEntry.steamId))
			.every((friendGame) =>
				friendGame.games.some((friendGame) => friendGame.appid === game.appid),
			)
	})

	const handleFriendSelection = (friend: SteamPlayer) => {
		if (selectedFriends.includes(friend)) {
			setSelectedFriends(selectedFriends.filter((f) => f.steamId !== friend.steamId))
			setFriendsGames(friendsGames.filter((fg) => fg.steamId !== friend.steamId))
		} else {
			setSelectedFriends([...selectedFriends, friend])

			if (friendsGames.some((g) => g.steamId === friend.steamId)) return

			void loadGames(friend.steamId).then((games) => {
				setFriendsGames([...friendsGames, { steamId: friend.steamId, games }])
			})
		}
	}

	return (
		<div className="flex flex-wrap items-start justify-center">
			{friendsLoading && <LoadingBarComponent className="mt-20 w-1/2" />}
			{!friendsLoading && (
				<div className="flex w-full items-center">
					<div className="flex w-1/2 px-4 pt-2">
						<input
							type="text"
							placeholder="Search Friends..."
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="mb-4 block h-12 w-full rounded-md py-2 px-4 shadow-none"
						/>
						<button
							onClick={() => {
								setSelectedFriends([])
								setFriendsGames([])
							}}
							className={clsx(
								"h-12 overflow-hidden whitespace-nowrap bg-red-400 p-0 hover:bg-red-500 focus:ring-red-400/50 active:bg-red-600",
								selectedFriends.length === 0 ? "w-0 focus:ring-0" : "ml-2 w-56",
							)}
						>
							Clear Friends
						</button>
					</div>
					<div className="w-1/2 px-4 pt-2">
						<input
							type="text"
							placeholder="Search Games..."
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="mb-4 block h-12 w-full rounded-md py-2 px-4 shadow-none"
						/>
					</div>
				</div>
			)}
			{!friendsLoading && (
				<>
					<div className="flex w-1/2 flex-wrap p-2">
						{friends
							.filter((friend) =>
								friend.personaName.toLowerCase().includes(filter.toLowerCase()),
							)
							.map((friend) => {
								return (
									<motion.div
										layout
										key={friend.steamId}
										transition={{ duration: 0.2 }}
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 20, opacity: 0 }}
										className="relative flex w-1/2 items-center space-x-2 p-1 lg:w-1/3"
									>
										<div
											className={clsx(
												"flex items-center space-x-2",
												hasInvalidGames(friend.steamId) ? "opacity-50" : "",
											)}
										>
											<Switch
												checked={selectedFriends.includes(friend)}
												onChange={() => handleFriendSelection(friend)}
												className={`${
													selectedFriends.includes(friend)
														? "bg-violet-400"
														: "bg-gray-400"
												} relative m-0 inline-flex h-4 w-8 items-center rounded p-0`}
											>
												<span className="sr-only">Enable notifications</span>
												<span
													className={`${
														selectedFriends.includes(friend)
															? "translate-x-4"
															: "translate-x-1"
													} inline-block h-2 w-3 transform rounded-sm bg-white transition dark:bg-gray-900`}
												/>
											</Switch>
											<img
												alt={`User avatar for ${friend.personaName}`}
												width={32}
												height={32}
												style={{
													maxWidth: 32,
													maxHeight: 32,
												}}
												src={friend.avatar}
												className="m-0 overflow-hidden rounded-lg"
											/>
											<div className="space-y-1">
												<p className="m-0 font-semibold">{friend.personaName}</p>
												<i className="text-sm">{friend.steamId}</i>
											</div>
										</div>
										{hasInvalidGames(friend.steamId) && (
											<button
												onClick={() =>
													alert("Could not load games due to a private profile...")
												}
												className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent hover:scale-105 hover:bg-transparent focus:ring-0 active:scale-95 active:bg-transparent"
											>
												<XCircleIcon className="h-10 w-10 text-red-400" />
											</button>
										)}
									</motion.div>
								)
							})}
					</div>
					<div className="relative flex w-1/2 flex-wrap p-2">
						{selectedFriends.length === 0 && (
							<p className="absolute top-1/2 left-1/2 mx-0 -translate-x-1/2 -translate-y-1/2 text-center text-xl font-semibold italic opacity-50">
								No Friends Selected...
							</p>
						)}
						{selectedFriends.length > 0 &&
							friendsGames.length > 0 &&
							!friendsGames.every((friend) => friend.games.length === 0) &&
							commonGames.map((game: ISteamGame) => {
								return (
									<motion.div
										layout
										key={game.appid}
										transition={{ duration: 0.2 }}
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 20, opacity: 0 }}
										className="flex w-1/2 items-center space-x-2 p-1"
									>
										<img
											alt={`Game logo for ${game.name}`}
											width={32}
											height={32}
											style={{
												minWidth: 32,
												minHeight: 32,
												maxWidth: 32,
												maxHeight: 32,
											}}
											src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
											className="m-0 overflow-hidden rounded"
										/>
										<div className="ml-2 space-y-1 overflow-hidden overflow-ellipsis">
											<p className="m-0 whitespace-nowrap font-semibold">{game.name}</p>
										</div>
									</motion.div>
								)
							})}
					</div>
				</>
			)}
		</div>
	)
}
