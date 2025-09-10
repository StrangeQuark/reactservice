// Integration file: File

import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import ImageViewer from "../../components/fileservice/ImageViewer"

describe("ImageViewer", () => {
  test("renders the image with given URL", () => {
    const testUrl = "http://example.com/test.png"
    render(<ImageViewer imageUrl={testUrl} onClose={() => {}} />)

    const img = screen.getByTestId("image")
    expect(img).toHaveAttribute("src", testUrl)
  })

  test("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn()
    render(<ImageViewer imageUrl="http://example.com/test.png" onClose={onCloseMock} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test("applies correct CSS classes", () => {
    render(<ImageViewer imageUrl="test.png" onClose={() => {}} />)

    expect(screen.getByRole("button").className).toContain("close-btn")
    expect(document.querySelector(".popup-overlay")).toBeInTheDocument()
    expect(document.querySelector(".popup-content")).toBeInTheDocument()
  })
})
