import { AnimateSharedLayout, motion } from "framer-motion"
import colors from "tailwindcss/colors"

export enum SelectionMode {
	FRIENDS,
	GAMES,
	STEAMIDS,
}

interface ComparisonSelectorProps {
	mode: SelectionMode
	setMode: (mode: SelectionMode) => void
}

interface SelectionModeArray {
	mode: SelectionMode
	name: string
}

export const ComparisonSelector: React.FC<ComparisonSelectorProps> = ({
	mode,
	setMode,
}) => {
	const modes: SelectionModeArray[] = [
		{ mode: SelectionMode.FRIENDS, name: "Friends" },
		{ mode: SelectionMode.GAMES, name: "Games" },
		{ mode: SelectionMode.STEAMIDS, name: "SteamIDs" },
	]

	return (
		<div className="mx-0 py-4 text-center">
			<h3>
				<i>Compare By</i>
			</h3>
			<div className="space-x-12">
				<AnimateSharedLayout>
					{modes.map((m) => {
						return (
							<button
								className="relative w-36 rounded-none bg-transparent text-center text-lg font-bold text-black shadow-none hover:bg-transparent focus:ring-0 active:bg-transparent dark:text-white"
								onClick={() => setMode(m.mode)}
								key={m.mode}
							>
								{m.name}
								{mode === m.mode && (
									<motion.div
										initial={false}
										layoutId="underline"
										className="absolute left-0 bottom-0 h-[3px] w-full bg-violet-400"
									/>
								)}
							</button>
						)
					})}
				</AnimateSharedLayout>
			</div>
		</div>
	)
}
