import { motion } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { loadFriends } from "../lib/friends"
import { loadGames } from "../lib/games"
import { currentPlayerAtom, gamesAtom } from "../lib/store"

export const SteamGames: React.FC = () => {
	const player = useAtomValue(currentPlayerAtom)
	const [games, setGames] = useAtom(gamesAtom)
	const [gamesLoaded, setGamesLoaded] = useState(false)

	useEffect(() => {
		if (!player) return

		void loadGames(player.steamId).then((games) => {
			setGames(games)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [player])

	return (
		<motion.div layout className="flex flex-wrap items-center justify-center">
			{games.map((game) => {
				return (
					<motion.div
						layout
						key={game.appid}
						transition={{ duration: 0.2 }}
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="flex w-80 items-center overflow-hidden p-1"
					>
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
						<div className="ml-2 space-y-1 overflow-hidden overflow-ellipsis">
							<p className="m-0 whitespace-nowrap font-semibold">{game.name}</p>
						</div>
					</motion.div>
				)
			})}
		</motion.div>
	)
}
