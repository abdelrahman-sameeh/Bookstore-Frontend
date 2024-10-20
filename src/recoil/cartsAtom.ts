import { atom } from "recoil";
import { Cart } from "../interfaces/interfaces";

export const cartsState = atom<Cart[]>({
  key: "loggedUserCarts",
  default: []
})

export const targetCartState = atom<Cart>({
  key: "targetCartState",
  default: {}
})