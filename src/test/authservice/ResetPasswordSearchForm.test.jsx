// Integration file: Email
// Integration file: Auth

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import ResetPasswordSearchForm from "../../components/authservice/ResetPasswordSearchForm"
import { AUTH_ENDPOINTS } from "../../config"
import * as Telemetry from "../../utility/TelemetryUtility" // Integration line: Telemetry

describe("ResetPasswordSearchForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Telemetry, "sendTelemetryEvent").mockImplementation(async () => {}) // Integration line: Telemetry
    global.fetch = vi.fn()
  })

  test("does nothing when input is empty", () => {
    render(<ResetPasswordSearchForm />)

    fireEvent.click(screen.getByText("SUBMIT"))

    expect(fetch).not.toHaveBeenCalled()
  })

  test("shows error if server returns 404", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    })

    global.fetch.mockResolvedValueOnce({
      status: 404,
      json: async () => ({ message: "ok" }),
    })

    render(<ResetPasswordSearchForm />)

    fireEvent.change(screen.getByLabelText("Username or email:"), {
      target: { value: "wronguser@example.com" },
    })
    fireEvent.click(screen.getByText("SUBMIT"))

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, we could not find your account")
      ).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      AUTH_ENDPOINTS.PASSWORD_RESET,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.stringMatching(/^Bearer /),
        }),
        body: JSON.stringify({ email: "wronguser@example.com" }),
      })
    )
  })

  test("shows success if server returns 200", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    })

    render(<ResetPasswordSearchForm />)

    fireEvent.change(screen.getByLabelText("Username or email:"), {
      target: { value: "test@example.com" },
    })
    fireEvent.click(screen.getByText("SUBMIT"))

    await waitFor(() => {
      expect(
        screen.getByText("Please check your email for a password reset link")
      ).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      AUTH_ENDPOINTS.PASSWORD_RESET,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.stringMatching(/^Bearer /),
        }),
        body: JSON.stringify({ email: "test@example.com" }),
      })
    )
  })

  test("handles Enter key press to submit", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    })

    render(<ResetPasswordSearchForm />)

    const input = screen.getByLabelText("Username or email:")
    fireEvent.change(input, { target: { value: "keyboard@example.com" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(
        screen.getByText("Please check your email for a password reset link")
      ).toBeInTheDocument()
    })
  })
})
