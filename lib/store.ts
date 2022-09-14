import { atom } from "jotai"

import { ISteamGame } from "./models/steamGame"
import { SteamPlayer } from "./models/steamPlayer"

export interface IFriendGameEntry {
	steamId: string
	games: ISteamGame[]
}

export const selectedSteamPlayersAtom = atom<SteamPlayer[]>([])
export const selectedSteamGamesAtom = atom<ISteamGame[]>([])
export const currentPlayerAtom = atom<SteamPlayer | null>(null)
export const friendsAtom = atom<SteamPlayer[]>([])
export const gamesAtom = atom<ISteamGame[]>([])
export const loadVerificationAtom = atom<boolean>(false)

export const friendsGamesAtom = atom<IFriendGameEntry[]>([])
