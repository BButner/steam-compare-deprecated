import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { SteamPlayer } from "../lib/models/steamPlayer"
import { ComparisonSelector, SelectionMode } from "./comparison-selector"
import { SteamFriends } from "./steam-friends"
import { SteamGames } from "./steam-games"

export const ComparisonWrapper: React.FC = () => {
	const [mode, setMode] = useState<SelectionMode>(SelectionMode.FRIENDS)

	return (
		<div className="">
			<ComparisonSelector mode={mode} setMode={setMode} />
			<AnimatePresence mode="wait">
				{mode === SelectionMode.FRIENDS && <SteamFriends key="friends" />}
				{mode === SelectionMode.GAMES && <SteamGames key="games" />}
			</AnimatePresence>
		</div>
	)
}
