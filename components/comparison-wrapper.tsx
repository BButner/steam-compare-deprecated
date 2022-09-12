import { useState } from "react"

import { SteamPlayer } from "../lib/models/steamPlayer"
import { ComparisonSelector, SelectionMode } from "./comparison-selector"

interface ComparisonWrapperProps {
	user: SteamPlayer
}

export const ComparisonWrapper: React.FC<ComparisonWrapperProps> = ({ user }) => {
	const [mode, setMode] = useState<SelectionMode>(SelectionMode.FRIENDS)

	return (
		<div className="">
			<ComparisonSelector mode={mode} setMode={setMode} />
			<div className=""></div>
		</div>
	)
}
