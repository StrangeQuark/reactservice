import { useEffect, useState } from "react"
import { getAuthHeaders, VPN_ENDPOINTS } from "../../config"
import { useAuth } from "../../context/AuthContext"
import "./css/VpnDeviceManagement.css"

const VpnDeviceManagement = () => {
    const { getAccessToken } = useAuth()
    const [devices, setDevices] = useState([])
    const [deviceName, setDeviceName] = useState("")
    const [configuration, setConfiguration] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        getDevices()
    }, [])

    const request = (url, method, body) => fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders(getAccessToken()) },
        body: body ? JSON.stringify(body) : undefined
    })

    const getDevices = async () => {
        const response = await request(VPN_ENDPOINTS.GET_DEVICES, "GET")

        if(response.ok)
            setDevices(await response.json())
    }

    const createDevice = async (event) => {
        event.preventDefault()

        const response = await request(VPN_ENDPOINTS.CREATE_DEVICE, "POST", { deviceName })
        const data = await response.json()

        if(!response.ok) {
            setMessage(data.errorMessage || data)
            return
        }

        setConfiguration(data)
        setDeviceName("")
        setMessage("")
        getDevices()
    }

    const rotateDevice = async (deviceId) => {
        const response = await request(VPN_ENDPOINTS.ROTATE_DEVICE, "POST", { deviceId })
        const data = await response.json()

        if(!response.ok) {
            setMessage(data.errorMessage || data)
            return
        }

        setConfiguration(data)
        setMessage("")
        getDevices()
    }

    const revokeDevice = async (deviceId) => {
        if(!confirm("Revoke this VPN device? Its configuration will stop working immediately."))
            return

        const response = await request(VPN_ENDPOINTS.REVOKE_DEVICE, "DELETE", { deviceId })

        if(response.ok) {
            setMessage("VPN device revoked")
            getDevices()
            return
        }

        setMessage(await response.text())
    }

    const copyConfiguration = async () => {
        await navigator.clipboard.writeText(configuration.configuration)
        setMessage("VPN configuration copied")
    }

    const downloadConfiguration = () => {
        const file = new Blob([configuration.configuration], { type: "text/plain" })
        const url = URL.createObjectURL(file)
        const link = document.createElement("a")

        link.href = url
        link.download = configuration.deviceName + ".conf"
        link.click()

        URL.revokeObjectURL(url)
    }

    return (
        <div className="vpn-device-management">
            <div className="vpn-device-header">
                <div>
                    <h1>VPN devices</h1>
                    <p>Create a WireGuard configuration for each device you use.</p>
                </div>
            </div>

            <form className="vpn-device-form" onSubmit={createDevice}>
                <label>
                    Device name
                    <input value={deviceName} onChange={event => setDeviceName(event.target.value)}
                           placeholder="Phone, laptop, tablet..." required />
                </label>
                <button type="submit">Create device</button>
            </form>

            {message && <p className="vpn-device-message">{message}</p>}

            {devices.length > 0 ? <div className="vpn-device-list">
                {devices.map(device =>
                    <div className="vpn-device-list-item" key={device.id}>
                        <div>
                            <strong>{device.deviceName}</strong>
                            <span>{device.vpnAddress}</span>
                            <span>Created {new Date(device.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="vpn-device-actions">
                            <button onClick={() => rotateDevice(device.id)}>Rotate</button>
                            <button className="vpn-danger-button" onClick={() => revokeDevice(device.id)}>Revoke</button>
                        </div>
                    </div>
                )}
            </div> : <p className="vpn-device-empty-state">No VPN devices have been created.</p>}

            {configuration && <div className="vpn-device-modal-overlay">
                <div className="vpn-device-modal">
                    <div className="vpn-device-modal-header">
                        <div>
                            <h2>{configuration.deviceName} configuration</h2>
                            <p>Scan this QR code in WireGuard, or download the configuration file.</p>
                        </div>
                        <button className="vpn-close-button" onClick={() => setConfiguration(null)}>×</button>
                    </div>

                    <img className="vpn-qr-code" src={configuration.qrCode} alt="WireGuard configuration QR code" />

                    <label className="vpn-configuration-label">
                        WireGuard configuration
                        <textarea value={configuration.configuration} readOnly />
                    </label>

                    <div className="vpn-device-modal-actions">
                        <button className="vpn-secondary-button" onClick={() => setConfiguration(null)}>Close</button>
                        <button className="vpn-secondary-button" onClick={copyConfiguration}>Copy configuration</button>
                        <button onClick={downloadConfiguration}>Download .conf</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default VpnDeviceManagement
