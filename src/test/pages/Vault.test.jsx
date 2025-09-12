// Integration file: Vault

import { render, screen } from "@testing-library/react"
import Vault from "../../pages/Vault"

vi.mock("../../components/Toolbar", () => ({
  default: () => <div data-testid="toolbar" />,
}))

vi.mock("../../components/vaultservice/VaultList", () => ({
  default: () => <div data-testid="vault-list" />,
}))

// Integration function start: Auth
vi.mock("../../context/AuthContext", () => ({
  RequireAuth: ({ children }) => <div>{children}</div>,
})) // Integration function end: Auth

test("renders Vault page with Toolbar and VaultList inside RequireAuth (If Auth integrated)", () => {
  render(<Vault />)

  expect(screen.getByTestId("toolbar")).toBeInTheDocument()
  expect(screen.getByTestId("vault-list")).toBeInTheDocument()
})
