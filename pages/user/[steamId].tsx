import { useAtom } from "jotai"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"

import { ComparisonWrapper } from "../../components/comparison-wrapper"
import { SteamPlayerComponent } from "../../components/steam-player"
import { ISteamGame } from "../../lib/models/steamGame"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"
import { currentPlayerAtom } from "../../lib/store"

interface UserPageProps {
	playerRaw: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ playerRaw }) => {
	const [player, setPlayer] = useAtom(currentPlayerAtom)

	useEffect(() => {
		setPlayer(new SteamPlayer(playerRaw))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!player) return <></>

	return (
		<div className="w-full">
			<NextSeo
				title={`${player.personaName} | Steam Compare Profile`}
				description="Select Friends or Games to compare against."
				canonical="https://www.canonical.ie/"
				openGraph={{
					url: "https://www.url.ie/a",
					title: `${player.personaName} | Steam Compare Profile`,
					description: "Select Friends or Games to compare against.",
					images: [
						{
							url: player.avatarFull,
							width: 184,
							height: 184,
							alt: `${player.personaName} avatar`,
							type: "image/jpeg",
						},
					],
					site_name: "Steam Compare",
				}}
			/>
			<Head>
				<title>{`${player.personaName} | Steam Compare Profile`}</title>
			</Head>
			<SteamPlayerComponent />
			<ComparisonWrapper />
			{/* {selectedGames.length === 0 && selectedPlayers.length === 0 && (
				<div className="flex items-start p-4">
					<SteamFriendsComponent
						loaded={friendsLoaded}
						friends={friends}
						className="mx-auto w-1/2 p-2"
					/>
					<SteamGamesComponent
						loaded={gamesLoaded}
						className="mx-auto w-1/2 p-2"
						games={player.games}
					/>
				</div>
			)}
			{selectedPlayers.length > 0 && <CompareByFriendsComponent player={user} />}
			{selectedGames.length > 0 && <CompareByGamesComponent player={user} />} */}
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { steamId } = context.params as { steamId: string }

	const player: ISteamPlayer | null = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL ?? ""}/user/${steamId}`,
	)
		.then((res) => res.json())
		.then((data) => data as ISteamPlayer)
		.catch((err) => {
			console.log(err)
			return null
		})

	if (player) {
		// load the games
		await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/user/${steamId}/games`)
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
			playerRaw: player as ISteamPlayer,
		},
	}
}

export default User
