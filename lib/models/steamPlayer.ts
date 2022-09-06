import { ISteamGame } from "./steamGame"

export interface ISteamPlayer {
	steamId: string
	personaName: string
	profileUrl: string
	avatar: string
	avatarMedium: string
	avatarFull: string
	personaState: IPersonaState
	games: ISteamGame[]
}

export class SteamPlayer implements ISteamPlayer {
	public steamId: string
	public personaName: string
	public profileUrl: string
	public avatar: string
	public avatarMedium: string
	public avatarFull: string
	public personaState: IPersonaState
	public games: ISteamGame[]

	public constructor(player: ISteamPlayer) {
		this.steamId = player.steamId
		this.personaName = player.personaName
		this.profileUrl = player.profileUrl
		this.avatar = player.avatar
		this.avatarMedium = player.avatarMedium
		this.avatarFull = player.avatarFull
		this.personaState = player.personaState
		this.games = player.games
	}

	// Parse the persona state from enum to a string
	public getPersonaState(): string {
		switch (this.personaState) {
			case IPersonaState.Offline:
				return "Offline"
			case IPersonaState.Online:
				return "Online"
			case IPersonaState.Busy:
				return "Busy"
			case IPersonaState.Away:
				return "Away"
			case IPersonaState.Snooze:
				return "Snooze"
			case IPersonaState.LookingToTrade:
				return "Looking to Trade"
			case IPersonaState.LookingToPlay:
				return "Looking to Play"
			default:
				return "Unknown"
		}
	}
}

export enum IPersonaState {
	Offline = 0,
	Online = 1,
	Busy = 2,
	Away = 3,
	Snooze = 4,
	LookingToTrade = 5,
	LookingToPlay = 6,
}
