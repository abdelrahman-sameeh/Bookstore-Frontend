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
  geOwnerBooks: (queryString: string='') => `${mainPath}/owner/books${queryString}`,
  updateDeleteBook: (bookId: string) => `${mainPath}/books/${bookId}`,
  createBook: `${mainPath}/books`,
}
