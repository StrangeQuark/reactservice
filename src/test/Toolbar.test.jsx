// Toolbar.test.jsx
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import Toolbar from "../components/Toolbar"
import * as Telemetry from "../utility/TelemetryUtility" // Integration line: Telemetry
import logo from "../res/logo.png"
import darkModeLogo from "../res/logo_dark_mode.png"

// Mock AuthContext since Toolbar depends on it - Integration function start: Auth
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from "../context/AuthContext"
// Integration function end: Auth
describe("Toolbar component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    document.documentElement.removeAttribute("data-theme")
    vi.spyOn(Telemetry, "sendTelemetryEvent").mockImplementation(async () => {}) // Integration line: Telemetry
  })

  test("renders logo and navigation links", () => {
    useAuth.mockReturnValue({ isLoggedIn: false }) // Integration line: Auth

    render(<Toolbar />)

    expect(screen.getByAltText("Logo")).toBeInTheDocument()
    expect(screen.getByAltText("Logo")).toHaveAttribute("src", logo)
    expect(screen.getByTestId("home-nav-link")).toBeInTheDocument()
    expect(screen.getByTestId("files-nav-link")).toBeInTheDocument() // Integration line: File
    expect(screen.getByTestId("vault-nav-link")).toBeInTheDocument() // Integration line: Vault
  })
  // Integration function start: Auth
  test("shows login button when not logged in", () => {
    useAuth.mockReturnValue({ isLoggedIn: false })

    render(<Toolbar />)

    expect(screen.getByTestId("loginButton")).toBeInTheDocument()
  })

  test("shows username when logged in", () => {
    useAuth.mockReturnValue({
      isLoggedIn: true,
      username: "testuser",
      logout: vi.fn(),
    })

    render(<Toolbar />)

    expect(screen.getByText("testuser")).toBeInTheDocument()
  })

  test("toggles popout menu on username click", () => {
    const mockLogout = vi.fn()
    useAuth.mockReturnValue({
      isLoggedIn: true,
      username: "testuser",
      logout: mockLogout,
    })

    render(<Toolbar />)

    const userButton = screen.getByText("testuser")
    fireEvent.click(userButton)

    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Logout"))
    expect(mockLogout).toHaveBeenCalled()
  }) // Integration function end: Auth

  test("uses the stored theme on load", () => {
    window.localStorage.setItem("reactservice-theme", "dark")
    useAuth.mockReturnValue({ isLoggedIn: false })

    render(<Toolbar />)

    expect(document.documentElement).toHaveAttribute("data-theme", "dark")
    expect(screen.getByTestId("theme-toggle")).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByAltText("Logo")).toHaveAttribute("src", darkModeLogo)
  })

  test("toggles theme and persists it", () => {
    useAuth.mockReturnValue({ isLoggedIn: false })

    render(<Toolbar />)

    const toggle = screen.getByTestId("theme-toggle")

    fireEvent.click(toggle)

    expect(document.documentElement).toHaveAttribute("data-theme", "dark")
    expect(window.localStorage.getItem("reactservice-theme")).toBe("dark")
    expect(toggle).toHaveAttribute("aria-label", "Switch to light mode")
    expect(screen.getByAltText("Logo")).toHaveAttribute("src", darkModeLogo)
  })
})
