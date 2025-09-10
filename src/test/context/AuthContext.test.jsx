// Integration file: AuthContext.test.jsx

import "@testing-library/jest-dom"
import { renderHook, act, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { AuthProvider, useAuth } from "../../context/AuthContext"

describe("AuthContext context", () => {
  beforeEach(() => {
    document.cookie = ""
    global.fetch = vi.fn()
  })

  test("initial state is correct", () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.username).toBe(null)
  })

  test("getAccessToken returns cookie value", () => {
    document.cookie = "access_token=mytoken"
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.getAccessToken()).toBe("mytoken")
  })

  test("logout clears cookies and state", () => {
    document.cookie = "access_token=abc; refresh_token=xyz"
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => result.current.logout())

    expect(result.current.getAccessToken()).toBe(null)
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.username).toBe(null)
  })

  test("initializes with valid access token", async () => {
    const payload = btoa(JSON.stringify({ exp: Date.now() / 1000 + 100, sub: "john_doe" }))
    document.cookie = `access_token=header.${payload}.sig`

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.username).toBe("john_doe")
    })
  })
})
