import { AnimatePresence, motion } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { loadFriends } from "../lib/friends"
import { currentPlayerAtom, friendsAtom } from "../lib/store"

export const SteamFriends: React.FC = () => {
	const player = useAtomValue(currentPlayerAtom)
	const [friends, setFriends] = useAtom(friendsAtom)
	const [friendsLoading, setFriendsLoading] = useState(false)

	useEffect(() => {
		if (!player) return

		void loadFriends(player.steamId).then((friends) => {
			setFriends(friends)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player])

	return (
		<motion.div layout className="flex flex-wrap items-center justify-center">
			{friends.map((friend) => {
				return (
					<motion.div
						layout
						key={friend.steamId}
						transition={{ duration: 0.2 }}
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="flex w-80 items-center p-1"
					>
						<img
							alt={`User avatar for ${friend.personaName}`}
							width={64}
							height={64}
							src={friend.avatarMedium}
							className="m-0 rounded-lg"
						/>
						<div className="ml-2 space-y-1">
							<p className="m-0 font-semibold">{friend.personaName}</p>
							<i className="text-sm">{friend.steamId}</i>
						</div>
					</motion.div>
				)
			})}
		</motion.div>
	)
}
