import { afterEach, describe, expect, test, vi } from "vitest"

const loadConfig = async (gatewayBaseUrl) => {
  vi.resetModules()
  vi.stubEnv("VITE_AUTH_API_BASE_URL", "http://auth-service:6001")
  vi.stubEnv("VITE_EMAIL_API_BASE_URL", "http://email-service:6005")
  vi.stubEnv("VITE_FILE_API_BASE_URL", "http://file-service:6010")
  vi.stubEnv("VITE_VAULT_API_BASE_URL", "http://vault-service:6020")
  vi.stubEnv("VITE_GATEWAY_BASE_URL", gatewayBaseUrl)

  return await import("../config")
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("config", () => {
  test("uses service URLs when gateway URL is missing", async () => {
    const { AUTH_ENDPOINTS, FILE_ENDPOINTS } = await loadConfig("")

    expect(AUTH_ENDPOINTS.AUTHENTICATE).toBe("http://auth-service:6001/api/auth/authenticate")
    expect(FILE_ENDPOINTS.GET_ALL).toBe("http://file-service:6010/api/file/get-all")
  })

  test("uses gateway URL when gateway URL is present", async () => {
    const { AUTH_ENDPOINTS, FILE_ENDPOINTS } = await loadConfig("http://gateway-service:8080")

    expect(AUTH_ENDPOINTS.AUTHENTICATE).toBe("http://gateway-service:8080/api/auth/authenticate")
    expect(FILE_ENDPOINTS.GET_ALL).toBe("http://gateway-service:8080/api/file/get-all")
  })
})
