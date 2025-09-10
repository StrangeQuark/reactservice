// Integration file: File

import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import MusicPlayer from "../../components/fileservice/MusicPlayer"

describe("MusicPlayer", () => {
  test("renders audio element with given URL", () => {
    const testUrl = "http://example.com/test.mp3"
    render(<MusicPlayer audioUrl={testUrl} onClose={() => {}} />)

    const source = screen.getByTestId("audio-player").querySelector("source")
    expect(source).toHaveAttribute("src", testUrl)
  })

  test("sets correct MIME type for mp3", () => {
    render(<MusicPlayer audioUrl="http://example.com/test.mp3" onClose={() => {}} />)

    const source = screen.getByTestId("audio-player").querySelector("source")
    expect(source).toHaveAttribute("type", "audio/mpeg")
  })

  test("sets correct MIME type for wav", () => {
    render(<MusicPlayer audioUrl="http://example.com/test.wav" onClose={() => {}} />)

    const source = screen.getByTestId("audio-player").querySelector("source")
    expect(source).toHaveAttribute("type", "audio/wav")
  })

  test("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn()
    render(<MusicPlayer audioUrl="http://example.com/test.mp3" onClose={onCloseMock} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test("applies correct CSS classes", () => {
    render(<MusicPlayer audioUrl="http://example.com/test.mp3" onClose={() => {}} />)

    expect(screen.getByRole("button").className).toContain("close-btn")
    expect(document.querySelector(".popup-overlay")).toBeInTheDocument()
    expect(document.querySelector(".popup-content")).toBeInTheDocument()
  })
})
