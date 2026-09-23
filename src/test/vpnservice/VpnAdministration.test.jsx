import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import VpnAdministration from "../../components/vpnservice/VpnAdministration"

vi.mock("../../config", () => ({
  AUTH_ENDPOINTS: { GET_USER_DETAILS_BY_IDS: "/api/auth/user/get-user-details-by-ids" },
  getAuthHeaders: () => ({ Authorization: "Bearer test-token" }),
  VPN_ENDPOINTS: {
    GET_ALL_DEVICES: "/api/vpn/get-all-devices",
    ADMIN_REVOKE_DEVICE: "/api/vpn/admin/revoke-device",
    REVOKE_USER_DEVICES: "/api/vpn/revoke-user-devices"
  }
}))

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ getAccessToken: () => "test-token" })
}))

describe("VpnAdministration component", () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    window.confirm = vi.fn(() => true)
  })

  test("resolves VPN device owners and revokes a device", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{
        id: "device-id", userId: "user-id", deviceName: "phone", vpnAddress: "10.8.0.2", createdAt: "2026-09-22T12:00:00"
      }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ userId: "user-id", username: "testuser", email: "test@example.com" }] })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })

    render(<VpnAdministration />)

    expect(await screen.findByText("testuser · test@example.com")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Revoke device" }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/vpn/admin/revoke-device", expect.objectContaining({
      method: "DELETE",
      body: JSON.stringify({ deviceId: "device-id" })
    })))
  })

  test("filters devices by owner username, email, and device name", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [
        { id: "phone-id", userId: "user-id", deviceName: "phone", vpnAddress: "10.8.0.2", createdAt: "2026-09-22T12:00:00" },
        { id: "laptop-id", userId: "other-user-id", deviceName: "laptop", vpnAddress: "10.8.0.3", createdAt: "2026-09-22T12:00:00" }
      ] })
      .mockResolvedValueOnce({ ok: true, json: async () => [
        { userId: "user-id", username: "testuser", email: "test@example.com" },
        { userId: "other-user-id", username: "otheruser", email: "other@example.com" }
      ] })

    render(<VpnAdministration />)

    expect(await screen.findByText("phone")).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText("Search VPN devices"), { target: { value: "other@example.com" } })

    expect(screen.queryByText("phone")).not.toBeInTheDocument()
    expect(screen.getByText("laptop")).toBeInTheDocument()
  })
})
