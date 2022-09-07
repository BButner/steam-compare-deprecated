import { useAtomValue } from "jotai"
import { useAtom } from "jotai"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { NextSeo } from "next-seo"
import { useEffect } from "react"
import { useState } from "react"

import { CompareByFriendsComponent } from "../../components/CompareByFriendsComponent"
import { CompareByGamesComponent } from "../../components/CompareByGamesComponent"
import { SteamFriendsComponent } from "../../components/SteamFriendsComponent"
import { SteamGamesComponent } from "../../components/SteamGamesComponent"
import { SteamPlayerComponent } from "../../components/SteamPlayerComponent"
import { ISteamGame } from "../../lib/models/steamGame"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"
import {
	friendsAtom,
	selectedSteamGamesAtom,
	selectedSteamPlayersAtom,
} from "../../lib/store"

interface UserPageProps {
	player: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ player }) => {
	const [friends, setFriends] = useAtom(friendsAtom)
	const [user, setUser] = useState<SteamPlayer>(new SteamPlayer(player))
	const [friendsLoaded, setFriendsLoaded] = useState(false)
	const [gamesLoaded, setGamesLoaded] = useState(false)

	const selectedPlayers = useAtomValue(selectedSteamPlayersAtom)
	const selectedGames = useAtomValue(selectedSteamGamesAtom)

	useEffect(() => {
		if (!friendsLoaded) {
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

			setFriendsLoaded(true)
		}

		if (!gamesLoaded) {
			fetch(`/api/user/${player.steamId}/games`)
				.then((res) => res.json())
				.then((data: ISteamGame[]) => {
					// set the users games
					setUser((prev) => {
						console.log(prev)
						prev.games = data
						return prev
					})
				})
				.catch((err) => {
					console.log(err)
				})

			setGamesLoaded(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return (
		<div className="w-full">
			<NextSeo
				title={`${user.personaName} | Steam Compare Profile`}
				description="Select Friends or Games to compare against."
				canonical="https://www.canonical.ie/"
				openGraph={{
					url: "https://www.url.ie/a",
					title: `${user.personaName} | Steam Compare Profile`,
					description: "Select Friends or Games to compare against.",
					images: [
						{
							url: user.avatarFull,
							width: 184,
							height: 184,
							alt: `${user.personaName} avatar`,
							type: "image/jpeg",
						},
					],
					site_name: "Steam Compare",
				}}
			/>
			<Head>
				<title>{`${user.personaName} | Steam Compare Profile`}</title>
			</Head>
			<SteamPlayerComponent player={user} />
			{selectedGames.length === 0 && selectedPlayers.length === 0 && (
				<div className="flex items-start p-4">
					<SteamFriendsComponent friends={friends} className="mx-auto w-1/2 p-2" />
					<SteamGamesComponent className="mx-auto w-1/2 p-2" games={user.games} />
				</div>
			)}
			{selectedPlayers.length > 0 && <CompareByFriendsComponent player={user} />}
			{selectedGames.length > 0 && <CompareByGamesComponent player={user} />}
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

	return {
		props: {
			player: player as ISteamPlayer,
		},
	}
}

export default User
