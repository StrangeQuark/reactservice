// Integration file: Auth
// Integration file: Email

import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import ConfirmEmailMessage from "../../components/authservice/ConfirmEmailMessage"
import * as Telemetry from "../../utility/TelemetryUtility" // Integration line: Telemetry

describe("ConfirmEmailMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Telemetry, "sendTelemetryEvent").mockImplementation(async () => {}) // Integration line: Telemetry
    global.fetch = vi.fn()
  })

  test("fetches message and displays it", async () => {
    const mockMessage = "Email confirmed successfully"

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ message: mockMessage }),
    })

    render(<ConfirmEmailMessage />)

    await waitFor(() => {
      expect(screen.getByText(mockMessage)).toBeInTheDocument()
    })
  })
})
