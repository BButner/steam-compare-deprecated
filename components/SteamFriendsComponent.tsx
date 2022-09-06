import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import Image from "next/image"
import { useEffect } from "react"
import { useState } from "react"

import { SteamPlayer } from "../lib/models/steamPlayer"
import { friendsAtom, selectedSteamPlayersAtom } from "../lib/store"

interface SteamFriendsComponentProps {
	className?: string
}

export const SteamFriendsComponent: React.FC<SteamFriendsComponentProps> = ({
	className,
}) => {
	const friends = useAtomValue(friendsAtom)
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
		<div className={className}>
			<h2>Compare by Friend</h2>
			<div className="flex flex-wrap">
				<input
					type="text"
					placeholder="Search Friends..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="mb-4 block w-full rounded-md py-2 px-4"
				/>
				{friends
					.filter((friend) =>
						friend.personaName.toLowerCase().includes(filter.toLowerCase()),
					)
					.sort((a, b) => a.personaName.localeCompare(b.personaName))
					.map((friend) => {
						return (
							<button
								disabled={friend.games.length === 0}
								className="block w-1/2 text-left"
								key={friend.steamId}
								onClick={() => selectFriend(friend)}
							>
								<div
									className={clsx(
										"shadow-ld m-2 flex justify-start overflow-hidden rounded duration-200 hover:cursor-pointer hover:bg-violet-400 hover:text-white",
										friend.games.length === 0
											? "bg-red-500 text-white opacity-50 hover:cursor-default hover:bg-red-500"
											: "",
										selectedFriends.includes(friend)
											? "bg-violet-400 text-white"
											: "bg-white dark:bg-black",
									)}
								>
									<Image
										alt={`User avatar for ${friend.personaName}`}
										width={64}
										height={64}
										src={friend.avatarMedium}
									/>
									<div className="ml-2 space-y-1">
										<p className="m-0 font-semibold">{friend.personaName}</p>
										<i className="text-sm">{friend.steamId}</i>
									</div>
								</div>
							</button>
						)
					})}
			</div>
		</div>
	)
}
