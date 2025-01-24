import { atom } from "recoil";
import { UserInterface } from "../interfaces/interfaces";

export const receiverAtom = atom<UserInterface>({
  key: "receiverAtom",
  default: {}
})