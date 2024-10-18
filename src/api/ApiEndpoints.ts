const mainPath = '/api/v1'

export const ApiEndpoints = {
  register: `${mainPath}/register`,
  login: `${mainPath}/login`,
  sendResetCode: `${mainPath}/resetCode`,
  forgetPassword: `${mainPath}/forgetPassword`,
  getUpdateLoggedUser: `${mainPath}/auth`,
  onboarding: `${mainPath}/stripe/onboard`,
  getCategories: `${mainPath}/category`,
  getBooks: (queryString: string='') => `${mainPath}/books${queryString}`,
  getOwnerBooks: (queryString: string='') => `${mainPath}/owner/books${queryString}`,
  getAdminBooks: (queryString: string='') => `${mainPath}/admin/books${queryString}`,
  updateDeleteBook: (bookId: string) => `${mainPath}/books/${bookId}`,
  createBook: `${mainPath}/books`,
  getUpdateDeleteBook: (bookId: string) =>`${mainPath}/books/${bookId}`,
  changePassword: `${mainPath}/changePassword`,
  listCreateCategory: `${mainPath}/category`,
  getUpdateDeleteCategory: (id: string) => `${mainPath}/category/${id}`,
  reviewBook: (id: string) => `${mainPath}/books/${id}/reviewBook`,
  listCreateCoupon: (queryString: string='') => `${mainPath}/coupons${queryString}`,
  retrieveUpdateDeleteCoupon: (couponId: string) => `${mainPath}/coupon/${couponId}`,
  



}
