import { atom } from "jotai"

import { ISteamGame } from "./models/steamGame"
import { SteamPlayer } from "./models/steamPlayer"

export const selectedSteamPlayersAtom = atom<SteamPlayer[]>([])
export const selectedSteamGamesAtom = atom<ISteamGame[]>([])
export const friendsAtom = atom<SteamPlayer[]>([])
