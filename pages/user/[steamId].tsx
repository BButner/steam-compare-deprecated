import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { NextSeo } from "next-seo"
import { useState } from "react"

import { ComparisonSelector } from "../../components/comparison-selector"
import { SteamPlayerComponent } from "../../components/steam-player"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"
import { ComparisonWrapper } from "../../components/comparison-wrapper"

interface UserPageProps {
	player: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ player }) => {
	// const [friends, setFriends] = useAtom(friendsAtom)
	const [user, setUser] = useState<SteamPlayer>(new SteamPlayer(player))
	// const [friendsLoaded, setFriendsLoaded] = useState(false)
	// const [gamesLoaded, setGamesLoaded] = useState(false)

	// useEffect(() => {
	// 	if (!friendsLoaded) {
	// 		fetch(`/api/user/${player.steamId}/friends`)
	// 			.then((res) => res.json())
	// 			.then((data: ISteamPlayer[]) => {
	// 				console.log(data)
	// 				setFriends(data.map((p) => new SteamPlayer(p)))
	// 				setFriendsLoaded(true)
	// 			})
	// 			.catch((err) => {
	// 				console.error(err)
	// 				setFriendsLoaded(true)
	// 				return null
	// 			})
	// 	}

	// 	if (!gamesLoaded) {
	// 		fetch(`/api/user/${player.steamId}/games`)
	// 			.then((res) => res.json())
	// 			.then((data: ISteamGame[]) => {
	// 				// set the users games
	// 				setUser((prev) => {
	// 					console.log(prev)
	// 					prev.games = data
	// 					return prev
	// 				})
	// 				setGamesLoaded(true)
	// 			})
	// 			.catch((err) => {
	// 				setGamesLoaded(true)
	// 				console.log(err)
	// 			})
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [user])

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
			<ComparisonWrapper user={user} />
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
						games={user.games}
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

	return {
		props: {
			player: player as ISteamPlayer,
		},
	}
}

export default User
