import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { useAtomValue } from "jotai"

import { IPersonaState } from "../lib/models/steamPlayer"
import { currentPlayerAtom } from "../lib/store"

export const SteamPlayerComponent: React.FC = () => {
	const player = useAtomValue(currentPlayerAtom)

	if (!player) return <></>

	return (
		<div className="w-full">
			<div className="items-center justify-center space-y-2 pt-6 text-center md:flex md:space-y-0 md:space-x-6 md:text-left">
				<div
					style={{
						width: "184px",
						height: "184px",
					}}
					className="relative mx-auto md:mx-0"
				>
					<img
						alt={`Player avatar for ${player.personaName}`}
						src={player.avatarFull}
						style={{
							width: "184px",
							height: "184px",
						}}
						width={184}
						height={184}
						className="mx-auto my-0 rounded-xl md:m-0"
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
					<a
						href={`https://steamcommunity.com/profiles/${player.steamId}/`}
						target="_blank"
						className="mx-auto mt-4 flex w-56 items-center justify-between rounded-lg bg-violet-400 px-2 py-1 text-white no-underline shadow-lg outline-none focus:ring-4 focus:ring-violet-400/50 md:mx-0"
						rel="noreferrer"
					>
						Open Profile on Steam
						<ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5" />
					</a>
				</div>
			</div>
		</div>
	)
}
