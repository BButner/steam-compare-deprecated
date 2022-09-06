import Image from "next/image"
import { useState } from "react"

import { SteamPlayer } from "../lib/models/steamPlayer"

interface SteamFriendsComponentProps {
	friends: SteamPlayer[]
}

export const SteamFriendsComponent: React.FC<SteamFriendsComponentProps> = ({
	friends,
}) => {
	const [filter, setFilter] = useState<string>("")
	return (
		<div className="m-auto flex w-1/2 flex-wrap">
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
						<button className="block w-1/2 text-left" key={friend.steamId}>
							<div className="shadow-ld m-2 flex justify-start overflow-hidden rounded bg-white duration-200 hover:cursor-pointer hover:bg-violet-400 hover:text-white dark:bg-black">
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
	)
}
