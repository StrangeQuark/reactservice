// Integration file: Vault

import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import VaultList from "../../components/vaultservice/VaultList"

// Mock useAuth
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    getAccessToken: vi.fn(() => "mock-token"),
  }),
}))

// Mock window APIs
global.confirm = vi.fn(() => true)
global.URL.createObjectURL = vi.fn(() => "blob:mock-url")
global.URL.revokeObjectURL = vi.fn()

// Mock fetch globally
global.fetch = vi.fn()

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn() },
})

describe("VaultList component", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test("renders basic UI", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<VaultList />)
    expect(screen.getByText(/Create service/i)).toBeInTheDocument()
    expect(screen.getByText(/Select Service/i)).toBeInTheDocument()
    expect(screen.getByText(/Select Environment/i)).toBeInTheDocument()
  })

  test("fetches services on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ["ServiceA", "ServiceB"],
    })

    render(<VaultList />)

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("get-all-services"),
        expect.any(Object)
      )
    )
    expect(await screen.findByText("ServiceA")).toBeInTheDocument()
    expect(await screen.findByText("ServiceB")).toBeInTheDocument()
  })

  test("fetches environments when selecting service", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] }) // services
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} }) // getCurrentUserRole
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev", "prod"] }) // envs

    render(<VaultList />)

    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")
    await screen.findByText("prod")

    expect(await screen.findByText("dev")).toBeInTheDocument()
    expect(await screen.findByText("prod")).toBeInTheDocument()
  })

  test("fetches variables when selecting environment", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ key: "DB_PASSWORD", value: "secret" }],
      })

    render(<VaultList />)
    
    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    expect(await screen.findByDisplayValue("DB_PASSWORD")).toBeInTheDocument()
  })

  test("filters variables by search term", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { key: "DB_PASSWORD", value: "secret" },
          { key: "API_KEY", value: "123" },
        ],
      })

    render(<VaultList />)
    
    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    fireEvent.change(screen.getByPlaceholderText(/Search variables/i), {
      target: { value: "API" },
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue("API_KEY")).toBeInTheDocument()
      expect(screen.queryByDisplayValue("DB_PASSWORD")).not.toBeInTheDocument()
    })
  })

  test("paginates variables correctly", async () => {
    const vars = Array.from({ length: 15 }, (_, i) => ({ key: `KEY${i}`, value: `val${i}` }))

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({ ok: true, json: async () => vars })

    render(<VaultList />)

    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    // Page 1
    expect(await screen.findByDisplayValue("KEY0")).toBeInTheDocument()
    expect(screen.queryByDisplayValue("KEY11")).not.toBeInTheDocument()

    // Page 2
    fireEvent.click(await screen.findByText("2"))
    expect(await screen.findByDisplayValue("KEY11")).toBeInTheDocument()
  })

  test("toggles mask/unmask all", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ key: "DB_PASSWORD", value: "secret" }] })

    render(<VaultList />)

    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    const btn = await screen.findByText(/Unmask All/i)
    fireEvent.click(btn)
    expect(screen.getByPlaceholderText("value")).not.toHaveClass("masked-input")
  })

  test("copies variable to clipboard", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ key: "DB_PASSWORD", value: "secret" }] })

    render(<VaultList />)

    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    await screen.findByDisplayValue("DB_PASSWORD")

    const copyBtn = screen.getByTestId("clipboard-icon")
    fireEvent.click(copyBtn)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("secret")
  })

  test("deletes variable after confirm", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ key: "DELETE_ME", value: "123" }] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    render(<VaultList />)
    
    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    await screen.findByDisplayValue("DELETE_ME")

    const deleteBtn = screen.getByTestId("trash-icon")
    fireEvent.click(deleteBtn)
    await waitFor(() => expect(global.confirm).toHaveBeenCalled())
  })

  test("opens create service popup", () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
    
    render(<VaultList />)

    fireEvent.click(screen.getByText(/Create service/i))
    expect(screen.getByText(/Create new service/i)).toBeInTheDocument()
  })

  test("uploads env file", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // vars
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // upload

    render(<VaultList />)

    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    const fileInput = screen.getByRole("textbox", { hidden: true })
    const file = new File(["KEY=VAL"], "test.env", { type: "text/plain" })
    fireEvent.change(fileInput, { target: { files: [file] } })
    await waitFor(() => expect(fetch).toHaveBeenCalled())
  })

  test("downloads env file", async () => {
    const blob = new Blob(["test content"], { type: "text/plain" })
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ["ServiceA"] })
      .mockResolvedValueOnce({ ok: true, json: async () => {"MANAGER"} })
      .mockResolvedValueOnce({ ok: true, json: async () => ["dev"] })
      .mockResolvedValueOnce({ ok: true, blob: async () => blob })

    render(<VaultList />)

    await screen.findByText("ServiceA")

    fireEvent.change(screen.getByDisplayValue("Select Service"), {
        target: { value: "ServiceA" },
    })

    await screen.findByText("dev")

    fireEvent.change(screen.getByDisplayValue("Select Environment"), {
        target: { value: "dev" },
    })

    await waitFor(() => VaultList.downloadEnvFile && expect(fetch).toHaveBeenCalled())
  })
})
