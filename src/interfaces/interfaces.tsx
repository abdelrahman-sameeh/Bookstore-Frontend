export interface Owner {
  _id?: string;
  name: string;
  email?:string;
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

export type UserRolesType = "owner" | "user" | "admin" | "delivery";

export interface UserInterface {
  _id?: any;
  name?: any;
  email?: any;
  role?: UserRolesType;
  picture?: any;
  stripeAccountId?: any;
  completedBoarding?: any;
}

export interface Coupon {
  _id?: string;
  code?: string;
  discount?: string;
  expiryDate?: string;
}

export interface Address {
  _id?: string;
  country?: string;
  city?: string;
  address?: string;
  phone?: string;
}

export interface BookItem {
  book: Book;
  count: number;
  _id?: string;
}

export interface Cart {
  _id?: string;
  user?: string;
  books?: BookItem[];
  totalItems?: number;
  totalPrice?: number;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id?: string;
  user?: string;
  address?: Address;
  books?: BookItem[];
  totalItems?: number;
  totalPrice?: number;
  discount?: number;
  finalPrice?: number;
  status?: string;
  paymentType?: string;
  paymentStatus?: string;
  qrcode?: string;
}

export interface Delivery {
  _id?: string;
  user?: UserInterface;
  pendingOrders?: Order[];
  deliveredOrders?: Order[];
}

export interface Message {
  _id?: string;
  sender?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdAtFormatted?: string;
}

export interface ChatInterface {
  _id?: string;
  users?: UserInterface[];
  archivedBy?: UserInterface[];
  blockedBy?: UserInterface[];
  chat?: {
    _id?: string;
    title?: string;
    picture?: string;
    lastMessage?: Message;
  };
}
