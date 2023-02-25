import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon"
import { AnimatePresence, motion } from "framer-motion"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { FormEvent, useState } from "react"

import { LoadingBarComponent } from "../components/LoadingBarComponent"
import { ISteamPlayer } from "../lib/models/steamPlayer"
import { LogoSvg } from "../resources/LogoSvg"

const Home: NextPage = () => {
	const [steamId, setSteamId] = useState<string>("")
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(false)
	const [playerNotFound, setPlayerNotFound] = useState<boolean>(false)

	const handleSteamId = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)

		const player: ISteamPlayer | null = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL ?? ""}/user/${steamId}`,
		)
			.then((res) => {
				if (res.status === 404) {
					return null
				}
				return res.json()
			})
			.then((data) => {
				if (data === null) {
					return null
				}
				const player = data as ISteamPlayer

				return player
			})
			.catch((err) => {
				console.log(err)
				return null
			})

		if (player === null) {
			setPlayerNotFound(true)
			setLoading(false)
			return
		}

		void router.push(`/user/${player.steamId}`)
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<NextSeo
				title="Steam Compare"
				description="Compare your Steam Library with your friends, compare by games, or instead compare by Steam ID! Easily figure out which games that you have in common with your friends to accelerate your next gaming session!"
				canonical="https://www.canonical.ie/"
				openGraph={{
					url: "https://www.url.ie/a",
					title: "Steam Compare",
					description:
						"Compare your Steam Library with your friends, compare by games, or instead compare by Steam ID! Easily figure out which games that you have in common with your friends to accelerate your next gaming session!",
					images: [
						{
							url: "/logo/0.25x.png",
							width: 256,
							height: 256,
							alt: "Steam Compare Logo",
							type: "image/jpeg",
						},
					],
					site_name: "Steam Compare",
				}}
				additionalMetaTags={[
					{
						property: "keywords",
						content:
							"steam, compare, library, games, friends, steamid, steam compare games, steam compare friends, steam compare library",
					},
				]}
			/>
			<Head>
				<title>Steam Compare</title>
			</Head>

			<main className="w-full bg-transparent text-center">
				<div className="w-full space-y-2">
					<div className="mb-32 w-full">
						<LogoSvg width={200} height={200} className="m-auto mb-6" />
						<h1 className="w-full bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-6xl font-extrabold text-transparent">
							Steam Compare
						</h1>
						<h2 className="mx-auto w-3/4 text-center italic opacity-80">
							Compare your Steam Library with your friends, compare by games, or instead
							compare by Steam ID! Easily figure out which games that you have in common
							with your friends to accelerate your next gaming session!
						</h2>
					</div>
					<div className="mx-auto w-3/4 text-left md:w-2/3 lg:w-1/2 xl:w-1/3">
						<h3>Enter your SteamID</h3>
						<div className="mx-auto flex rounded shadow-lg">
							<form onSubmit={(e) => void handleSteamId(e)} className="flex w-full">
								<input
									value={steamId}
									onChange={(e) => setSteamId(e.target.value)}
									className="w-full rounded-l rounded-r-none border-t-4 border-l-4 border-b-4 border-r-0 border-violet-400 p-4 text-2xl"
									type="text"
									id="steamId"
								/>
								<button className="h-full rounded-l-none rounded-r bg-violet-400 px-6 outline-none duration-200 hover:bg-violet-500 focus:ring-4 focus:ring-violet-500/50 active:bg-violet-600">
									<ChevronRightIcon className="h-8 w-8 text-white" />
								</button>
							</form>
						</div>

						{playerNotFound && (
							<p className="font-semibold text-red-500">Player not found, try again!</p>
						)}
					</div>
				</div>

				<AnimatePresence>
					{loading && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-gray-100/80 dark:bg-slate-900/80"
						>
							<LoadingBarComponent className="w-1/2" />
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	)
}

export default Home
