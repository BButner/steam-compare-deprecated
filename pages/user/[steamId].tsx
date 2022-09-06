import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { NextSeo } from "next-seo"
import { useEffect } from "react"
import { useState } from "react"

import { SteamFriendsComponent } from "../../components/SteamFriendsComponent"
import { SteamGamesComponent } from "../../components/SteamGamesComponent"
import { SteamPlayerComponent } from "../../components/SteamPlayerComponent"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"

interface UserPageProps {
	player: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ player }) => {
	const [friends, setFriends] = useState<SteamPlayer[]>([])

	console.log(player.games.filter((game) => game.img_logo_url))

	useEffect(() => {
		fetch(`/api/user/${player.steamId}/friends`)
			.then((res) => res.json())
			.then((data: ISteamPlayer[]) => {
				console.log(data)
				setFriends(data.map((p) => new SteamPlayer(p)))
			})
			.catch((err) => {
				console.error(err)
				return null
			})
	}, [player])

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
			<SteamPlayerComponent player={new SteamPlayer(player)} />
			<div className="flex items-start p-4">
				<SteamFriendsComponent
					friends={friends.map((friend) => new SteamPlayer(friend))}
				/>
				<SteamGamesComponent games={player.games} />
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { steamId } = context.params as { steamId: string }

	const player: ISteamPlayer | null = await fetch(
		`http://localhost:3001/user/${steamId}`,
	)
		.then((res) => res.json())
		.then((data) => data as ISteamPlayer)
		.catch((err) => {
			console.log(err)
			return null
		})

	return {
		props: {
			player: player as ISteamPlayer,
		},
	}
}

export default User
