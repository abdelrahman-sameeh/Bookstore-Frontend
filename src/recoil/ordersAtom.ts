import { atom } from "recoil";
import { Order } from "../interfaces/interfaces";

export const ordersState = atom<Order[]>({
  key: "loggedUserOrders",
  default: []
})

export const targetOrderState = atom<Order>({
  key: "targetOrderState",
  default: {}
})