// Toolbar.test.jsx
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import Toolbar from "../components/Toolbar"

// Mock AuthContext since Toolbar depends on it - Integration function start: Auth
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from "../context/AuthContext" // Integration function end: Auth

describe("Toolbar component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders logo and navigation links", () => {
    useAuth.mockReturnValue({ isLoggedIn: false }) // Integration line: Auth

    render(<Toolbar />)

    expect(screen.getByAltText("Logo")).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Files")).toBeInTheDocument()
    expect(screen.getByText("Vault")).toBeInTheDocument()
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

    const userButton = screen.getByText("testuser") // Integration line: Auth
    fireEvent.click(userButton) // Integration line: Auth

    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Logout"))
    expect(mockLogout).toHaveBeenCalled()
  }) // Integration function end: Auth

  test("handles search bar Enter key", () => {
    useAuth.mockReturnValue({ isLoggedIn: false }) // Integration line: Auth

    render(<Toolbar />)

    const searchBar = screen.getByPlaceholderText("Search")
    fireEvent.keyDown(searchBar, { key: "Enter", code: "Enter" })

    expect(searchBar).toBeInTheDocument()
  })
})
