
export interface Owner {
  name: string;
}

export interface Book {
  author?: string;
  owner?: Owner;
  category?: any;
  count?: number;
  // make sure its file
  imageCover?: string;
  // its book pdf
  book?: string;
  price?: number;
  reviewStatus?: "pending" | "approved" | "denied";
  sales?: number;
  status?: "online" | "offline";
  title?: string;
  _id?: string;
}

export interface Category {
  _id?: string;
  name?: string;
}

export interface PaginationData {
  count?: number;
  page?: number;
  pages?: number;
  total?: number;
}

export type UserRolesType  = 'owner' | 'user' | 'admin' | 'delivery'

export interface UserInterface {
  _id?: any;
  name?: any;
  email?: any;
  role?: UserRolesType;
  picture?: any;
  stripeAccountId?: any;
  completedBoarding?: any;
}

export interface Coupon{
  _id?: string;
  code?: string;
  discount?: string;
  expiryDate?: string;
}
