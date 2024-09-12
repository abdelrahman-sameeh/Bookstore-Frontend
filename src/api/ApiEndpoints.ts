const mainPath = '/api/v1'

export const ApiEndpoints = {
  register: `${mainPath}/register`,
  login: `${mainPath}/login`,
  sendResetCode: `${mainPath}/resetCode`,
  forgetPassword: `${mainPath}/forgetPassword`,
  getUpdateLoggedUser: `${mainPath}/auth`,
}
