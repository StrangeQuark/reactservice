export const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_API_BASE_URL
export const EMAIL_API_BASE_URL = process.env.REACT_APP_EMAIL_API_BASE_URL
export const FILE_API_BASE_URL = process.env.REACT_APP_FILE_API_BASE_URL
export const GATEWAY_BASE_URL = process.env.REACT_APP_GATEWAY_BASE_URL

export const AUTH_ENDPOINTS = {
  REGISTER: `${AUTH_API_BASE_URL}/api/auth/register`,
  AUTHENTICATE: `${AUTH_API_BASE_URL}/api/auth/authenticate`,
  ACCESS: `${AUTH_API_BASE_URL}/api/auth/access`,
  UPDATE_EMAIL: `${AUTH_API_BASE_URL}/api/auth/user/update-email`,
  DELETE_USER: `${AUTH_API_BASE_URL}/api/auth/user/delete-user`,
  PASSWORD_RESET: `${AUTH_API_BASE_URL}/api/auth/user/send-password-reset-email`,
  UPDATE_USERNAME: `${AUTH_API_BASE_URL}/api/auth/user/update-username`
}

export const EMAIL_ENDPOINTS = {
  CONFIRM_TOKEN: `${EMAIL_API_BASE_URL}/api/email/confirm-token?token=`,
  ENABLE_USER: `${EMAIL_API_BASE_URL}/api/email/enable-user?token=`
}

export const FILE_ENDPOINTS = {
  GET_ALL: `${FILE_API_BASE_URL}/api/file/get-all`,
  DOWNLOAD: `${FILE_API_BASE_URL}/api/file/download`,
  UPLOAD: `${FILE_API_BASE_URL}/api/file/upload`,
  STREAM: `${FILE_API_BASE_URL}/api/file/stream`,
  DELETE: `${FILE_API_BASE_URL}/api/file/delete`
}

const replaceBaseUrl = (endpoints, newBase) => {
  return Object.fromEntries(
    Object.entries(endpoints).map(([key, url]) => {
      const path = url.replace(/https?:\/\/[^/]+/, "")
      return [key, `${newBase}${path}`]
    })
  )
}

export const GATEWAY_ENDPOINTS = {
  ...replaceBaseUrl(AUTH_ENDPOINTS, GATEWAY_BASE_URL),
  ...replaceBaseUrl(EMAIL_ENDPOINTS, GATEWAY_BASE_URL),
  ...replaceBaseUrl(FILE_ENDPOINTS, GATEWAY_BASE_URL)
}
