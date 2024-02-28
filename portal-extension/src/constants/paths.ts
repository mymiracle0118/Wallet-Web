const PATHS = {
  API: {
    ROOT: '/api',
    AUTH: {
      ROOT: `/api/auth`,
      LOGIN: `/api/auth/login`,
      LOGOUT: `/api/auth/logout`,
      SIGNUP: `/api/auth/signup`,
    },
    PROTECT: {
      LOGIN: '/api/protect/login',
      PASSWORD_CHECK: '/api/protect/passwordCheck',
    },
  },
}

export default PATHS
