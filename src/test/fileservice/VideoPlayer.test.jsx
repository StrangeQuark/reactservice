// Integration file: File

import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import VideoPlayer from "../../components/fileservice/VideoPlayer"

// Mock useAuth - Integration function start: Auth
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    getAccessToken: vi.fn(() => "mock-token"),
  }),
}))
// Integration function end: Auth
describe("VideoPlayer", () => {
  let mockBlobUrl

  beforeEach(() => {
    vi.clearAllMocks()

    mockBlobUrl = "blob:http://localhost/mock"
    global.URL.createObjectURL = vi.fn(() => mockBlobUrl)
    global.URL.revokeObjectURL = vi.fn()

    global.fetch = vi.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(["test"], { type: "video/mp4" })),
      })
    )
  })

  afterEach(() => {
    cleanup()
  })
  // Integration function start: Auth
  test("fetches video with Authorization header", async () => {
    render(<VideoPlayer videoUrl="/video/test" onClose={() => {}} token="t" />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/video/test"
        , {headers: { Authorization: "Bearer mock-token" },}
      )
    })
  })// Integration function end: Auth

  test("creates blob URL and sets video src", async () => {
    render(<VideoPlayer videoUrl="/video/test" onClose={() => {}} token="t" />)

    const video = await screen.findByTestId("video-player")
    expect(video).toHaveAttribute("src", mockBlobUrl)
  })

  test("calls onClose when close button clicked", async () => {
    const onCloseMock = vi.fn()
    render(<VideoPlayer videoUrl="/video/test" onClose={onCloseMock} token="t" />)

    const button = screen.getByRole("button", { name: /x/i })
    fireEvent.click(button)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test("applies correct CSS classes", async () => {
    render(<VideoPlayer videoUrl="/video/test" onClose={() => {}} token="t" />)

    expect(document.querySelector(".popup-overlay")).toBeInTheDocument()
    expect(document.querySelector(".popup-content")).toBeInTheDocument()
    expect(await screen.findByTestId("video-player")).toHaveClass("video-player")
  })
})
