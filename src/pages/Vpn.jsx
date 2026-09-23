import Toolbar from "../components/Toolbar"
import VpnDeviceManagement from "../components/vpnservice/VpnDeviceManagement"
import { RequireAuth } from "../context/AuthContext"

const Vpn = () => {
    return (
        <RequireAuth>
            <Toolbar />

            <VpnDeviceManagement />
        </RequireAuth>
    )
}

export default Vpn
