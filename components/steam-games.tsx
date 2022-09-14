import { Switch } from "@headlessui/react"
import clsx from "clsx"
import { motion } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { loadFriends } from "../lib/friends"
import { loadGames, loadGamesWithSteamId } from "../lib/games"
import { ISteamGame } from "../lib/models/steamGame"
import {
	currentPlayerAtom,
	friendsAtom,
	friendsGamesAtom,
	gamesAtom,
	IFriendGameEntry,
	loadVerificationAtom,
	selectedSteamGamesAtom,
} from "../lib/store"
import { LoadingBarComponent } from "./LoadingBarComponent"

export const SteamGames: React.FC = () => {
	const player = useAtomValue(currentPlayerAtom)
	const [games, setGames] = useAtom(gamesAtom)
	const [gamesLoading, setGamesLoading] = useState(false)
	const [loadVerification, setLoadVerification] = useAtom(loadVerificationAtom)
	const [friends, setFriends] = useAtom(friendsAtom)
	const [friendsGames, setFriendsGames] = useAtom(friendsGamesAtom)
	const [filter, setFilter] = useState("")
	const [selectedGames, setSelectedGames] = useAtom(selectedSteamGamesAtom)
	const [friendFilter, setFriendFilter] = useState("")

	useEffect(() => {
		if (!player) return
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player])

	const verifyAndLoadAllGames = () => {
		if (!player) return
		setLoadVerification(true)
		setGamesLoading(true)

		void loadGames(player.steamId).then((games) => {
			setGames(games)

			void loadFriends(player.steamId).then((fs) => {
				setFriends(fs)
				setFriendsGames([])

				const loadingPromises = fs.map((friend) => {
					if (!friendsGames.find((fg) => fg.steamId === friend.steamId)) {
						return loadGamesWithSteamId(friend.steamId)
					}
				})

				console.log(loadingPromises)

				void Promise.all(loadingPromises).then(
					(data: Array<IFriendGameEntry | undefined>) => {
						setFriendsGames(data.filter((d) => d !== undefined) as IFriendGameEntry[])
						setGamesLoading(false)
					},
				)
			})
		})
	}

	// find all the friends that have every selected game
	const commonFriends = friends.filter((friend) => {
		const friendGames = friendsGames.find((fg) => fg.steamId === friend.steamId)
		if (!friendGames) return false

		return selectedGames.every((game) =>
			friendGames.games.some((friendGame) => friendGame.appid === game.appid),
		)
	})

	const handleGamesSelection = (game: ISteamGame) => {
		if (selectedGames.some((g) => g.appid === game.appid)) {
			setSelectedGames(selectedGames.filter((g) => g.appid !== game.appid))
		} else {
			setSelectedGames([...selectedGames, game])
		}
	}

	if (!loadVerification)
		return (
			<div className="flex items-center justify-center space-x-2 text-center">
				<div>
					<p>
						Comparing by Games requires all the game data of each friend to be loaded,
						and as such may require more time to load. Would you like to proceed?
					</p>
					<button onClick={verifyAndLoadAllGames} className="mx-auto">
						Load Games
					</button>
				</div>
			</div>
		)

	return (
		<motion.div layout className="flex flex-wrap items-center justify-center">
			{gamesLoading && <LoadingBarComponent className="mt-20 w-1/2" />}
			{!gamesLoading && (
				<div className="flex items-start justify-center">
					<div className="flex w-1/2 flex-wrap p-2">
						<div className="flex w-full px-2">
							<input
								type="text"
								placeholder="Search Games..."
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="mb-4 block h-12 w-full rounded-md py-2 px-4 shadow-none"
							/>
							<button
								onClick={() => {
									setSelectedGames([])
									setFriendsGames([])
								}}
								className={clsx(
									"h-12 overflow-hidden whitespace-nowrap bg-red-400 p-0 hover:bg-red-500 focus:ring-red-400/50 active:bg-red-600",
									selectedGames.length === 0 ? "w-0 focus:ring-0" : "ml-2 w-56",
								)}
							>
								Clear Games
							</button>
						</div>
						{games.map((game) => {
							return (
								<motion.div
									layout
									key={game.appid}
									transition={{ duration: 0.2 }}
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: 20, opacity: 0 }}
									className="relative flex w-full items-center space-x-2 overflow-hidden p-1 md:w-1/2"
								>
									<Switch
										checked={selectedGames.includes(game)}
										onChange={() => handleGamesSelection(game)}
										className={`${
											selectedGames.includes(game) ? "bg-violet-400" : "bg-gray-400"
										} relative m-0 inline-flex h-4 w-8 min-w-[32px] items-center rounded p-0`}
									>
										<span className="sr-only">Enable notifications</span>
										<span
											className={`${
												selectedGames.includes(game) ? "translate-x-4" : "translate-x-1"
											} inline-block h-2 w-3 transform rounded-sm bg-white transition dark:bg-gray-900`}
										/>
									</Switch>
									<img
										alt={`Game logo for ${game.name}`}
										width={32}
										height={32}
										style={{
											minHeight: 32,
											minWidth: 32,
											maxWidth: "32px",
											maxHeight: "32px",
										}}
										src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
										className="m-0 overflow-hidden rounded"
									/>
									<div className="ml-2 space-y-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
										<p className="m-0 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold">
											{game.name}
										</p>
									</div>
								</motion.div>
							)
						})}
					</div>
					<div className="relative flex w-1/2 flex-wrap p-2">
						{selectedGames.length === 0 && (
							<p className="absolute top-1/2 left-1/2 mx-0 mt-16 -translate-x-1/2 -translate-y-1/2 text-center text-xl font-semibold italic opacity-50">
								No Games Selected...
							</p>
						)}
						<div className="flex w-full px-2">
							<input
								type="text"
								placeholder="Search Friends..."
								value={friendFilter}
								onChange={(e) => setFriendFilter(e.target.value)}
								className="mb-4 block h-12 w-full rounded-md py-2 px-4 shadow-none"
							/>
						</div>
						{selectedGames.length > 0 &&
							commonFriends.map((friend) => {
								return (
									<motion.div
										layout
										key={friend.steamId}
										transition={{ duration: 0.2 }}
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 20, opacity: 0 }}
										className="relative flex w-full items-center space-x-2 p-1 md:w-1/2 xl:w-1/3"
									>
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
									</motion.div>
								)
							})}
					</div>
				</div>
			)}
		</motion.div>
	)
}
