import { render, screen } from "@testing-library/react"
import Vpn from "../../pages/Vpn"

vi.mock("../../components/Toolbar", () => ({
  default: () => <div data-testid="toolbar" />,
}))

vi.mock("../../components/vpnservice/VpnDeviceManagement", () => ({
  default: () => <div data-testid="vpn-device-management" />,
}))

vi.mock("../../context/AuthContext", () => ({
  RequireAuth: ({ children }) => <div>{children}</div>,
}))

test("renders VPN page with Toolbar and VpnDeviceManagement inside RequireAuth", () => {
  render(<Vpn />)

  expect(screen.getByTestId("toolbar")).toBeInTheDocument()
  expect(screen.getByTestId("vpn-device-management")).toBeInTheDocument()
})
