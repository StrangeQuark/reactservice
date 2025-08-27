export const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL// Integration line: Auth
export const EMAIL_API_BASE_URL = import.meta.env.VITE_EMAIL_API_BASE_URL// Integration line: Email
export const FILE_API_BASE_URL = import.meta.env.VITE_FILE_API_BASE_URL// Integration line: File
export const VAULT_API_BASE_URL = import.meta.env.VITE_VAULT_API_BASE_URL// Integration line: Vault
export const GATEWAY_BASE_URL = import.meta.env.VITE_GATEWAY_BASE_URL// Integration line: Gateway

// Integration function start: Auth
let AUTH_ENDPOINTS = {
  REGISTER: `${AUTH_API_BASE_URL}/api/auth/register`,
  AUTHENTICATE: `${AUTH_API_BASE_URL}/api/auth/authenticate`,
  ACCESS: `${AUTH_API_BASE_URL}/api/auth/access`,
  UPDATE_EMAIL: `${AUTH_API_BASE_URL}/api/auth/user/update-email`,
  DELETE_USER: `${AUTH_API_BASE_URL}/api/auth/user/delete-user`,
  PASSWORD_RESET: `${AUTH_API_BASE_URL}/api/auth/user/send-password-reset-email`,
  UPDATE_USERNAME: `${AUTH_API_BASE_URL}/api/auth/user/update-username`,
  UPDATE_PASSWORD: `${AUTH_API_BASE_URL}/api/auth/user/update-password`,
  SEARCH_USERS: `${AUTH_API_BASE_URL}/api/auth/user/search-users`,
  GET_USER_DETAILS_BY_IDS: `${AUTH_API_BASE_URL}/api/auth/user/get-user-details-by-ids`
}// Integration function end: Auth

// Integration function start: Email
let EMAIL_ENDPOINTS = {
  CONFIRM_TOKEN: `${EMAIL_API_BASE_URL}/api/email/confirm-token?token=`,
  ENABLE_USER: `${EMAIL_API_BASE_URL}/api/email/enable-user?token=`
}// Integration function end: Email

// Integration function start: File
let FILE_ENDPOINTS = {
  GET_ALL: `${FILE_API_BASE_URL}/api/file/get-all`,
  GET_ALL_COLLECTIONS: `${FILE_API_BASE_URL}/api/file/get-all-collections`,
  DOWNLOAD: `${FILE_API_BASE_URL}/api/file/download`,
  UPLOAD: `${FILE_API_BASE_URL}/api/file/upload`,
  STREAM: `${FILE_API_BASE_URL}/api/file/stream`,
  DELETE: `${FILE_API_BASE_URL}/api/file/delete`
}// Integration function end: File

// Integration function start: Vault
let VAULT_ENDPOINTS = {
  GET_ALL_SERVICES: `${VAULT_API_BASE_URL}/api/vault/get-all-services`,
  GET_SERVICE: `${VAULT_API_BASE_URL}/api/vault/get-service`,
  GET_ALL_ENVS_BY_SERVICE: `${VAULT_API_BASE_URL}/api/vault/get-environments-by-service`,
  GET_ENV: `${VAULT_API_BASE_URL}/api/vault/get-environment`,
  GET_VARS_BY_ENV: `${VAULT_API_BASE_URL}/api/vault/get-variables-by-environment`,
  CREATE_SERVICE: `${VAULT_API_BASE_URL}/api/vault/create-service`,
  CREATE_ENVIRONMENT: `${VAULT_API_BASE_URL}/api/vault/create-environment`,
  ADD_VAR: `${VAULT_API_BASE_URL}/api/vault/add-variable`,
  UPDATE_VARS: `${VAULT_API_BASE_URL}/api/vault/update-variables`,
  DELETE_VAR: `${VAULT_API_BASE_URL}/api/vault/delete-variable`,
  ADD_ENV_FILE: `${VAULT_API_BASE_URL}/api/vault/add-env-file`,
  DOWNLOAD_ENV_FILE: `${VAULT_API_BASE_URL}/api/vault/download-env-file`,
  GET_USERS_BY_SERVICE: `${VAULT_API_BASE_URL}/api/vault/get-users-by-service`,
  ADD_USER_TO_SERVICE: `${VAULT_API_BASE_URL}/api/vault/add-user-to-service`,
  DELETE_USER_FROM_SERVICE: `${VAULT_API_BASE_URL}/api/vault/delete-user-from-service`
}// Integration function end: Vault

const replaceBaseUrl = (endpoints, newBase) => {
  return Object.fromEntries(
    Object.entries(endpoints).map(([key, url]) => {
      const path = url.replace(/https?:\/\/[^/]+/, "")
      return [key, `${newBase}${path}`]
    })
  )
}

// Integration function start: Gateway
AUTH_ENDPOINTS = replaceBaseUrl(AUTH_ENDPOINTS, GATEWAY_BASE_URL)
EMAIL_ENDPOINTS = replaceBaseUrl(EMAIL_ENDPOINTS, GATEWAY_BASE_URL)
FILE_ENDPOINTS = replaceBaseUrl(FILE_ENDPOINTS, GATEWAY_BASE_URL)
VAULT_ENDPOINTS = replaceBaseUrl(VAULT_ENDPOINTS, GATEWAY_BASE_URL)
// Integration function end: Gateway

export {
  AUTH_ENDPOINTS,// Integration line: Auth
  EMAIL_ENDPOINTS,// Integration line: Email
  FILE_ENDPOINTS,// Integration line: File
  VAULT_ENDPOINTS// Integration line: Vault
}
