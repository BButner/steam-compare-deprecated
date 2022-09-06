import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"
import { useState } from "react"

import { SteamFriendsComponent } from "../../components/SteamFriendsComponent"
import { SteamPlayerComponent } from "../../components/SteamPlayerComponent"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"

interface UserPageProps {
	player: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ player }) => {
	const [friends, setFriends] = useState<SteamPlayer[]>([])

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
			<SteamPlayerComponent player={new SteamPlayer(player)} />
			<SteamFriendsComponent
				friends={friends.map((friend) => new SteamPlayer(friend))}
			/>
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
