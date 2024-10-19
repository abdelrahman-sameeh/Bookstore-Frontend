import { atom } from "recoil";
import { Address } from "../interfaces/interfaces";

export const addressesState = atom<Address[]>({
  key: 'addresses',
  default: [],
});

export const targetAddressState = atom<Address>({
  key: 'targetAddress',
  default: {},
});