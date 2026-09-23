import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import VpnDeviceManagement from "../../components/vpnservice/VpnDeviceManagement"

vi.mock("../../config", () => ({
  getAuthHeaders: () => ({ Authorization: "Bearer test-token" }),
  VPN_ENDPOINTS: {
    CREATE_DEVICE: "/api/vpn/create-device",
    GET_DEVICES: "/api/vpn/get-devices",
    REVOKE_DEVICE: "/api/vpn/revoke-device",
    ROTATE_DEVICE: "/api/vpn/rotate-device"
  }
}))

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ getAccessToken: () => "test-token" })
}))

describe("VpnDeviceManagement component", () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    window.confirm = vi.fn(() => true)
  })

  test("shows the empty state without rendering a device list", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })

    const { container } = render(<VpnDeviceManagement />)

    expect(await screen.findByText("No VPN devices have been created.")).toBeInTheDocument()
    expect(container.querySelector(".vpn-device-list")).not.toBeInTheDocument()
  })

  test("creates a device and displays its configuration", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({
        id: "device-id",
        deviceName: "phone",
        configuration: "[Interface]",
        qrCode: "data:image/png;base64,test"
      }) })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })

    render(<VpnDeviceManagement />)

    fireEvent.change(screen.getByLabelText("Device name"), { target: { value: "phone" } })
    fireEvent.click(screen.getByRole("button", { name: "Create device" }))

    expect(await screen.findByAltText("WireGuard configuration QR code")).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith("/api/vpn/create-device", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ deviceName: "phone" })
    }))
  })

  test("revokes a device", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{
        id: "device-id", deviceName: "phone", vpnAddress: "10.8.0.2", createdAt: "2026-09-22T12:00:00"
      }] })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })

    render(<VpnDeviceManagement />)

    fireEvent.click(await screen.findByRole("button", { name: "Revoke" }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/vpn/revoke-device", expect.objectContaining({
      method: "DELETE",
      body: JSON.stringify({ deviceId: "device-id" })
    })))
  })
})
