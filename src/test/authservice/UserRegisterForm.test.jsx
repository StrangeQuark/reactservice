// Integration file: Auth

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import UserRegisterForm from "../../components/authservice/UserRegisterForm"
import * as EmailUtility from "../../utility/EmailUtility" // Integration line: Email

describe("UserRegisterForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    vi.spyOn(EmailUtility, "verifyEmailRegex").mockImplementation(() => true) // default valid - Integration line: Email
  })

  test("renders form fields and button", () => {
    render(<UserRegisterForm />)

    expect(screen.getByText("Create account")).toBeInTheDocument()
    expect(screen.getByLabelText("Username:")).toBeInTheDocument()
    expect(screen.getByLabelText("Email:")).toBeInTheDocument()
    expect(screen.getByLabelText("Password:")).toBeInTheDocument()
    expect(screen.getByLabelText("Confirm password:")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "SIGN UP" })).toBeInTheDocument()
  })

  test("shows validation errors when fields are empty", async () => {
    render(<UserRegisterForm />)

    fireEvent.click(screen.getByRole("button", { name: "SIGN UP" }))

    await waitFor(() => {
      expect(screen.getByTitle("Username must not be blank")).toBeInTheDocument()
      expect(screen.getByTitle("Email must not be blank")).toBeInTheDocument()
      expect(screen.getByTitle("Password must not be blank")).toBeInTheDocument()
      expect(screen.getByTitle("Confirmation password must not be blank")).toBeInTheDocument()
    })
  })

  test("shows error when email is invalid", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })
    EmailUtility.verifyEmailRegex.mockReturnValueOnce(false) // Integration line: Email

    render(<UserRegisterForm />)

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "bademail" } })
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "secret" } })
    fireEvent.change(screen.getByLabelText("Confirm password:"), { target: { value: "secret" } })

    fireEvent.click(screen.getByRole("button", { name: "SIGN UP" }))

    await waitFor(() => {
      expect(screen.getByTitle("Not a valid email")).toBeInTheDocument()
    })
  })

  test("shows error when passwords do not match", async () => {
    render(<UserRegisterForm />)

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "secret" } })
    fireEvent.change(screen.getByLabelText("Confirm password:"), { target: { value: "different" } })

    fireEvent.click(screen.getByRole("button", { name: "SIGN UP" }))

    await waitFor(() => {
      expect(screen.getByTitle("Passwords must match")).toBeInTheDocument()
    })
  })

  test("handles successful registration", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })

    render(<UserRegisterForm />)

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "secret" } })
    fireEvent.change(screen.getByLabelText("Confirm password:"), { target: { value: "secret" } })

    fireEvent.click(screen.getByRole("button", { name: "SIGN UP" }))

    await waitFor(() => {
      expect(screen.getByText(/Thank you for signing up!/i)).toBeInTheDocument()
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument()
    })
  })

  test("handles 400 conflict: username already taken", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ errorMessage: "Username already registered" })
    })

    render(<UserRegisterForm />)

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "takenuser" } })
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "secret" } })
    fireEvent.change(screen.getByLabelText("Confirm password:"), { target: { value: "secret" } })

    fireEvent.click(screen.getByRole("button", { name: "SIGN UP" }))

    await waitFor(() => {
      expect(screen.getByTitle("Username is already taken")).toBeInTheDocument()
    })
  })

  test("handles 400 conflict: email already taken", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ errorMessage: "Email already registered" })
    })

    render(<UserRegisterForm />)

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "used@example.com" } })
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "secret" } })
    fireEvent.change(screen.getByLabelText("Confirm password:"), { target: { value: "secret" } })

    fireEvent.click(screen.getByRole("button", { name: "SIGN UP" }))

    await waitFor(() => {
      expect(screen.getByTitle("Email is already taken")).toBeInTheDocument()
    })
  })
})
