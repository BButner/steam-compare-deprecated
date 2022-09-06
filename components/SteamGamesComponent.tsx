import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"

import { ISteamGame } from "../lib/models/steamGame"

interface SteamGamesComponentProps {
	games: ISteamGame[]
}

export const SteamGamesComponent: React.FC<SteamGamesComponentProps> = ({ games }) => {
	const [filter, setFilter] = useState<string>("")
	return (
		<div className="mx-auto w-1/2 p-2">
			<h2>Compare by Game</h2>
			<div className="flex flex-wrap">
				<input
					type="text"
					placeholder="Search Games..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="mb-4 block w-full rounded-md py-2 px-4"
				/>
				{games &&
					games
						.filter((game) => game.name.toLowerCase().includes(filter.toLowerCase()))
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((game) => {
							return (
								<button className="block w-1/2 text-left" key={game.appid}>
									<div
										className={clsx(
											"shadow-ld m-2 flex justify-start overflow-hidden rounded bg-white duration-200 hover:cursor-pointer hover:bg-violet-400 hover:text-white dark:bg-black",
										)}
									>
										<Image
											alt={`Game logo for ${game.name}`}
											width={32}
											height={32}
											src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
										/>
										<p className="m-0 overflow-hidden overflow-ellipsis whitespace-nowrap px-2 font-semibold">
											{game.name}
										</p>
									</div>
								</button>
							)
						})}
			</div>
		</div>
	)
}
