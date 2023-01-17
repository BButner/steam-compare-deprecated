import { useAtom } from "jotai"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"

import { ComparisonWrapper } from "../../components/comparison-wrapper"
import { SteamPlayerComponent } from "../../components/steam-player"
import { savePlayerToLocalCache } from "../../lib/localCache"
import { ISteamGame } from "../../lib/models/steamGame"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"
import { currentPlayerAtom } from "../../lib/store"

interface UserPageProps {
	playerRaw: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ playerRaw }) => {
	const [player, setPlayer] = useAtom(currentPlayerAtom)

	useEffect(() => {
		console.log("playerRaw:", playerRaw)

		setPlayer(new SteamPlayer(playerRaw))

		savePlayerToLocalCache(playerRaw)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="w-full">
			<NextSeo
				title={`${playerRaw.personaName} | Steam Compare Profile`}
				description="Select Friends or Games to compare against."
				canonical="https://www.canonical.ie/"
				openGraph={{
					url: "https://www.url.ie/a",
					title: `${playerRaw.personaName} | Steam Compare Profile`,
					description: "Select Friends or Games to compare against.",
					images: [
						{
							url: playerRaw.avatarFull,
							width: 184,
							height: 184,
							alt: `${playerRaw.personaName} avatar`,
							type: "image/jpeg",
						},
					],
					site_name: "Steam Compare",
				}}
			/>
			<Head>
				<title>{`${playerRaw.personaName} | Steam Compare Profile`}</title>
			</Head>
			<SteamPlayerComponent />
			<ComparisonWrapper />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { steamId } = context.params as { steamId: string }

	const player: ISteamPlayer | null = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL ?? ""}/user/${steamId}`,
	)
		.then((res) => {
			if (res.status === 404) {
				return null
			}
			return res.json()
		})
		.then((data) => data as ISteamPlayer)
		.catch((err) => {
			console.log(err)
			return null
		})

	if (player === null) {
		return {
			notFound: true,
		}
	}

	if (player) {
		// load the games
		await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/user/${player.steamId}/games`)
			.then((res) => res.json())
			.then((data: ISteamGame[]) => {
				player.games = data
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return {
		props: {
			playerRaw: player,
		},
	}
}

export default User
