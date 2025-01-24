import { atom } from "recoil";
import { ChatInterface } from "../interfaces/interfaces";

export const chatsAtom = atom<ChatInterface[]>({
  key: "chatsAtom",
  default: []
})

export const currentChatAtom = atom<ChatInterface>({
  key: "currentChatAtom",
  default: {}
})

export const archivedAtom = atom<boolean>({
  key: "archivedAtom",
  default: false
})

export const blockedAtom = atom<boolean>({
  key: "blockedAtom",
  default: false
})