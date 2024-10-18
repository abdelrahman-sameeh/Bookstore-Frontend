import { atom } from 'recoil';
import { Coupon } from '../interfaces/interfaces';

export const couponsState = atom<Coupon[]>({
  key: 'coupons',
  default: [],
});

export const targetCouponState = atom<Coupon>({
  key: 'targetCoupon',
  default: {},
});
