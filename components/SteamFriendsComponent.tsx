import { XMarkIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { useAtom } from "jotai"
import Image from "next/image"
import { useState } from "react"

import { SteamPlayer } from "../lib/models/steamPlayer"
import { selectedSteamPlayersAtom } from "../lib/store"
import { LoadingBarComponent } from "./LoadingBarComponent"

interface SteamFriendsComponentProps {
	className?: string
	isCompareMaster?: boolean
	readonly?: boolean
	friends: SteamPlayer[]
	loaded: boolean
}

export const SteamFriendsComponent: React.FC<SteamFriendsComponentProps> = ({
	className,
	isCompareMaster,
	readonly,
	friends,
	loaded,
}) => {
	const [filter, setFilter] = useState<string>("")
	const [selectedFriends, setSelectedFriends] = useAtom(selectedSteamPlayersAtom)

	const selectFriend = (friend: SteamPlayer) => {
		if (selectedFriends.includes(friend)) {
			setSelectedFriends((prev) => prev.filter((f) => f !== friend))
		} else {
			setSelectedFriends((prev) => prev.concat(friend))
		}
	}

	return (
		<div className={clsx(className, "relative")}>
			{!isCompareMaster && (
				<h2>{readonly ? "Friends in Common" : "Compare by Friend"}</h2>
			)}
			{isCompareMaster && (
				<div className="flex items-center">
					<h2>Comparing by Friend</h2>
					<button
						onClick={() => setSelectedFriends([])}
						className="mt-6 ml-2 flex h-8 w-8 items-center justify-center rounded bg-red-400 p-0 outline-none duration-200 hover:bg-red-500 focus:ring-4 focus:ring-red-400/50 active:bg-red-700"
					>
						<XMarkIcon className="h-6 w-6 text-white" />
					</button>
				</div>
			)}
			<div className="flex flex-wrap">
				<input
					type="text"
					placeholder="Search Friends..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="mb-4 block w-full rounded-md py-2 px-4"
				/>
				{!loaded && <LoadingBarComponent className="m-auto mt-12 w-3/4" />}
				{loaded &&
					friends
						.filter((friend) =>
							friend.personaName.toLowerCase().includes(filter.toLowerCase()),
						)
						.sort((a, b) => a.personaName.localeCompare(b.personaName))
						.map((friend) => {
							return (
								<div className="w-1/2 p-2" key={friend.steamId}>
									<button
										disabled={!friend.games || friend.games.length === 0 || readonly}
										className={clsx(
											"shadow-ld flex w-full justify-start overflow-hidden rounded p-0 text-left text-black duration-200 hover:cursor-pointer dark:text-white",
											readonly
												? "hover:cursor-default hover:bg-white hover:dark:bg-gray-800"
												: "hover:bg-violet-400 hover:text-white active:text-white",
											selectedFriends.includes(friend)
												? "bg-violet-400 text-white"
												: "",
											!selectedFriends.includes(friend) &&
												friend.games &&
												friend.games.length > 0
												? "bg-white dark:bg-gray-800"
												: "",
											!friend.games || friend.games.length === 0
												? "bg-red-500/50 text-white opacity-50 hover:cursor-default hover:bg-red-500/50 hover:text-black hover:dark:text-white"
												: "",
										)}
										onClick={() => selectFriend(friend)}
									>
										<img
											alt={`User avatar for ${friend.personaName}`}
											width={64}
											height={64}
											src={friend.avatarMedium}
											className="m-0"
										/>
										<div className="ml-2 space-y-1">
											<p className="m-0 font-semibold">{friend.personaName}</p>
											<i className="text-sm">{friend.steamId}</i>
										</div>
									</button>
								</div>
							)
						})}
			</div>
		</div>
	)
}
