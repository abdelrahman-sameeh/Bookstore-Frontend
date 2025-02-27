const mainPath = '/api/v1'

export const ApiEndpoints = {
  register: `${mainPath}/register`,
  login: `${mainPath}/login`,
  sendResetCode: `${mainPath}/resetCode`,
  forgetPassword: `${mainPath}/forgetPassword`,
  getUpdateLoggedUser: `${mainPath}/auth`,
  onboarding: `${mainPath}/stripe/onboard`,
  getCategories: `${mainPath}/category`,
  getBooks: (queryString: string = '') => `${mainPath}/books${queryString}`,
  getOwnerBooks: (queryString: string = '') => `${mainPath}/owner/books${queryString}`,
  getAdminBooks: (queryString: string = '') => `${mainPath}/admin/books${queryString}`,
  updateDeleteBook: (bookId: string) => `${mainPath}/books/${bookId}`,
  createBook: `${mainPath}/books`,
  getUpdateDeleteBook: (bookId: string) => `${mainPath}/books/${bookId}`,
  changePassword: `${mainPath}/changePassword`,
  listCreateCategory: `${mainPath}/category`,
  getUpdateDeleteCategory: (id: string) => `${mainPath}/category/${id}`,
  reviewBook: (id: string) => `${mainPath}/books/${id}/reviewBook`,
  listCreateCoupon: (queryString: string = '') => `${mainPath}/coupons${queryString}`,
  retrieveUpdateDeleteCoupon: (couponId: string) => `${mainPath}/coupon/${couponId}`,
  listCreateAddresses: `${mainPath}/addresses`,
  retrieveUpdateDeleteAddress: (addressId: string) => `${mainPath}/address/${addressId}`,
  listCreateCart: `${mainPath}/cart`,
  deleteBookFromCart: (bookId: string) => `${mainPath}/cart/book/${bookId}`,
  deleteCart: `${mainPath}/cart`,
  completeOrder: `${mainPath}/purchase`,
  getDeleteUserOrders: `${mainPath}/user/orders`,
  cancelOrder: (id: string) => `${mainPath}/orders/${id}`,
  getDeleteAdminOrders: (queryString: string = '') => `${mainPath}/admin/orders${queryString}`,
  getDeliveries: `${mainPath}/deliveries`,
  makeOrdersInDelivery: `${mainPath}/updateOrderStatus`,
  makeOrdersCompleted: `${mainPath}/makeOrdersCompleted`,
  getDeliveryOrders: (queryString: string = '') =>`${mainPath}/delivery/orders${queryString}`,
  getUserOnlineBooks: `${mainPath}/user/books`,
  getOnlineBookStream: (id: any)=> `${mainPath}/user/book/${id}`,
  updateUserProfile: `${mainPath}/user/profile`,
  // archive chat
  archive: (id: string) => `${mainPath}/chats/${id}/archive`,
  unarchive: (id: string) =>`${mainPath}/chats/${id}/unarchive`,
  
  // support
  chatWithSupport: `${mainPath}/chat/get-support`,
  // sockets
  isExistUser: (id: any)=> `${mainPath}/users/${id}`,
  getChatMessage: (receiverId: string) => `${mainPath}/chat/messages/${receiverId}`,
  getUserChats: (archived: string) => `${mainPath}/chats${archived}`

}
