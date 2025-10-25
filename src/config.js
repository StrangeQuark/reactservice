const {
  VITE_AUTH_API_BASE_URL, // Integration line: Auth
  VITE_EMAIL_API_BASE_URL, // Integration line: Email
  VITE_FILE_API_BASE_URL, // Integration line: File
  VITE_VAULT_API_BASE_URL, // Integration line: Vault
  VITE_GATEWAY_BASE_URL, // Integration line: Gateway
} = import.meta.env;

const isLocalBrowser = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

function adaptBaseUrl(url) {
  if (!isLocalBrowser)
    return url

  return url
            .replace(/auth-service(:\d+)?/, "localhost$1") // Integratin line: Auth
            .replace(/email-service(:\d+)?/, "localhost$1") // Integratin line: Email
            .replace(/file-service(:\d+)?/, "localhost$1") // Integratin line: File
            .replace(/vault-service(:\d+)?/, "localhost$1") // Integratin line: Vault
            .replace(/gateway-service(:\d+)?/, "localhost$1") // Integratin line: Gateway
}

export const AUTH_API_BASE_URL = adaptBaseUrl(VITE_AUTH_API_BASE_URL) // Integratin line: Auth
export const EMAIL_API_BASE_URL = adaptBaseUrl(VITE_EMAIL_API_BASE_URL) // Integratin line: Email
export const FILE_API_BASE_URL = adaptBaseUrl(VITE_FILE_API_BASE_URL) // Integratin line: File
export const VAULT_API_BASE_URL = adaptBaseUrl(VITE_VAULT_API_BASE_URL) // Integratin line: Vault
export const GATEWAY_BASE_URL = adaptBaseUrl(VITE_GATEWAY_BASE_URL) // Integratin line: Gateway
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
  GET_USER_ID: `${AUTH_API_BASE_URL}/api/auth/user/get-user-id`,
  GET_USER_DETAILS_BY_IDS: `${AUTH_API_BASE_URL}/api/auth/user/get-user-details-by-ids`,
  AUTHENTICATE_SERVICE_ACCOUNT: `${AUTH_API_BASE_URL}/api/auth/service-account/authenticate`
}
// Integration function end: Auth
// Integration function start: Email
let EMAIL_ENDPOINTS = {
  CONFIRM_TOKEN: `${EMAIL_API_BASE_URL}/api/email/confirm-token?token=`,
  ENABLE_USER: `${EMAIL_API_BASE_URL}/api/email/enable-user?token=`,
  RESET_USER_PASSWORD: `${EMAIL_API_BASE_URL}/api/email/reset-user-password?token=`,
  SEND_REGISTER_EMAIL: `${EMAIL_API_BASE_URL}/api/email/send-register-email`
}
// Integration function end: Email
// Integration function start: File
let FILE_ENDPOINTS = {
  GET_ALL: `${FILE_API_BASE_URL}/api/file/get-all`,
  GET_ALL_COLLECTIONS: `${FILE_API_BASE_URL}/api/file/get-all-collections`,
  NEW_COLLECTION: `${FILE_API_BASE_URL}/api/file/new-collection`,
  DOWNLOAD: `${FILE_API_BASE_URL}/api/file/download`,
  UPLOAD: `${FILE_API_BASE_URL}/api/file/upload`,
  STREAM: `${FILE_API_BASE_URL}/api/file/stream`,
  DELETE: `${FILE_API_BASE_URL}/api/file/delete`,
  DELETE_COLLECTION: `${FILE_API_BASE_URL}/api/file/delete-collection`,
  GET_CURRENT_USER_ROLE: `${FILE_API_BASE_URL}/api/file/get-current-user-role`,
  GET_USERS_BY_COLLECTION: `${FILE_API_BASE_URL}/api/file/get-users-by-collection`,
  GET_ALL_ROLES: `${FILE_API_BASE_URL}/api/file/get-all-roles`,
  UPDATE_USER_ROLE: `${FILE_API_BASE_URL}/api/file/update-user-role`,
  ADD_USER_TO_COLLECTION: `${FILE_API_BASE_URL}/api/file/add-user-to-collection`,
  DELETE_USER_FROM_COLLECTION: `${FILE_API_BASE_URL}/api/file/delete-user-from-collection`
}
// Integration function end: File
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
  DELETE_ENVIRONMENT: `${VAULT_API_BASE_URL}/api/vault/delete-environment`,
  DELETE_SERVICE: `${VAULT_API_BASE_URL}/api/vault/delete-service`,
  ADD_ENV_FILE: `${VAULT_API_BASE_URL}/api/vault/add-env-file`,
  DOWNLOAD_ENV_FILE: `${VAULT_API_BASE_URL}/api/vault/download-env-file`,
  GET_USERS_BY_SERVICE: `${VAULT_API_BASE_URL}/api/vault/get-users-by-service`,
  ADD_USER_TO_SERVICE: `${VAULT_API_BASE_URL}/api/vault/add-user-to-service`,
  DELETE_USER_FROM_SERVICE: `${VAULT_API_BASE_URL}/api/vault/delete-user-from-service`,
  GET_CURRENT_USER_ROLE: `${VAULT_API_BASE_URL}/api/vault/get-current-user-role`,
  GET_ALL_ROLES: `${VAULT_API_BASE_URL}/api/vault/get-all-roles`,
  UPDATE_USER_ROLE: `${VAULT_API_BASE_URL}/api/vault/update-user-role`
}
// Integration function end: Vault

const replaceBaseUrl = (endpoints, newBase) => {
  return Object.fromEntries(
    Object.entries(endpoints).map(([key, url]) => {
      const path = url.replace(/https?:\/\/[^/]+/, "")
      return [key, `${newBase}${path}`]
    })
  )
}
// Integration function start: Gateway
AUTH_ENDPOINTS = replaceBaseUrl(AUTH_ENDPOINTS, GATEWAY_BASE_URL) // Integration line: Auth
EMAIL_ENDPOINTS = replaceBaseUrl(EMAIL_ENDPOINTS, GATEWAY_BASE_URL) // Integration line: Email
FILE_ENDPOINTS = replaceBaseUrl(FILE_ENDPOINTS, GATEWAY_BASE_URL) // Integration line: File
VAULT_ENDPOINTS = replaceBaseUrl(VAULT_ENDPOINTS, GATEWAY_BASE_URL) // Integration line: Vault
// Integration function end: Gateway

export {
  AUTH_ENDPOINTS,// Integration line: Auth
  EMAIL_ENDPOINTS,// Integration line: Email
  FILE_ENDPOINTS,// Integration line: File
  VAULT_ENDPOINTS// Integration line: Vault
}
