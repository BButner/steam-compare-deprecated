import clsx from "clsx"
import Image from "next/image"

import { IPersonaState, SteamPlayer } from "../lib/models/steamPlayer"

interface SteamPlayerComponentProps {
	player: SteamPlayer
}

export const SteamPlayerComponent: React.FC<SteamPlayerComponentProps> = ({
	player,
}) => {
	return (
		<div className="w-full">
			<div className="flex items-center justify-center space-x-6 py-4">
				<div className="relative">
					<Image
						alt={`Player avatar for ${player.personaName}`}
						src={player.avatarFull}
						width={184}
						height={184}
						className="relative rounded-xl"
					/>
					<div
						className={clsx(
							"absolute top-0 right-0 h-5 w-5 translate-x-1/4 -translate-y-1/4 rounded-full",
							player.personaState === IPersonaState.Online ? "bg-green-500" : "",
							player.personaState === IPersonaState.Busy ? "bg-red-500" : "",
							player.personaState === IPersonaState.Away ? "bg-yellow-500" : "",
							player.personaState === IPersonaState.Snooze ? "bg-yellow-500" : "",
							player.personaState === IPersonaState.Offline ? "bg-gray-500" : "",
							player.personaState === IPersonaState.LookingToTrade ? "bg-blue-500" : "",
							player.personaState === IPersonaState.LookingToPlay
								? "bg-orange-500"
								: "",
						)}
					/>
				</div>
				<div className="">
					<h2 className="m-0 p-0">{player.personaName}</h2>
					<p className="m-0 p-0">
						<i>{player.steamId}</i>
					</p>
					<p className="m-0 p-0">
						<i>{player.getPersonaState()}</i>
					</p>
				</div>
			</div>
		</div>
	)
}
