import { GetServerSideProps, NextPage } from "next"

import { SteamPlayerComponent } from "../../components/SteamPlayerComponent"
import { ISteamPlayer, SteamPlayer } from "../../lib/models/steamPlayer"

interface UserPageProps {
	player: ISteamPlayer
}

const User: NextPage<UserPageProps> = ({ player }) => {
	return (
		<div className="w-screen">
			<SteamPlayerComponent player={new SteamPlayer(player)} />
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
