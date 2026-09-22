import { useEffect, useState } from "react"
import { AUTH_ENDPOINTS, getAuthHeaders, VPN_ENDPOINTS } from "../../config"
import { useAuth } from "../../context/AuthContext"

const VpnAdministration = () => {
    const { getAccessToken } = useAuth()
    const [devices, setDevices] = useState([])
    const [users, setUsers] = useState({})
    const [message, setMessage] = useState("")
    const [search, setSearch] = useState("")

    useEffect(() => {
        getDevices()
    }, [])

    const request = (url, method, body) => fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders(getAccessToken()) },
        body: body ? JSON.stringify(body) : undefined
    })

    const getDevices = async () => {
        const response = await request(VPN_ENDPOINTS.GET_ALL_DEVICES, "GET")

        if(!response.ok) {
            setMessage(await response.text())
            return
        }

        const values = await response.json()
        const userIds = [...new Set(values.map(device => device.userId).filter(Boolean))]

        setDevices(values)
        getUsers(userIds)
    }

    const getUsers = async (userIds) => {
        if(userIds.length === 0) {
            setUsers({})
            return
        }

        const response = await request(AUTH_ENDPOINTS.GET_USER_DETAILS_BY_IDS, "POST", userIds)

        if(!response.ok)
            return

        const values = await response.json()
        setUsers(Object.fromEntries(values.map(user => [user.userId, user])))
    }

    const revokeDevice = async (deviceId) => {
        if(!confirm("Revoke this VPN device? Its configuration will stop working immediately."))
            return

        const response = await request(VPN_ENDPOINTS.ADMIN_REVOKE_DEVICE, "DELETE", { deviceId })

        if(response.ok) {
            setMessage("VPN device revoked")
            getDevices()
            return
        }

        setMessage(await response.text())
    }

    const revokeUserDevices = async (userId, username) => {
        if(!confirm("Revoke all VPN devices owned by " + username + "?"))
            return

        const response = await request(VPN_ENDPOINTS.REVOKE_USER_DEVICES, "POST", { userId })

        if(response.ok) {
            setMessage("User VPN devices revoked")
            getDevices()
            return
        }

        setMessage(await response.text())
    }

    const filteredDevices = devices.filter(device => {
        const user = users[device.userId]
        const value = search.toLowerCase()

        return device.deviceName.toLowerCase().includes(value)
            || user?.username?.toLowerCase().includes(value)
            || user?.email?.toLowerCase().includes(value)
    })

    return (
        <div className="admin-management">
            <div className="admin-section-header">
                <div>
                    <h2>VPN devices</h2>
                    <p>Review and revoke VPN devices across all users.</p>
                </div>
            </div>

            {message && <p className="admin-message">{message}</p>}

            {devices.length > 0 && <label className="admin-search-label">
                Search VPN devices
                <input value={search} onChange={event => setSearch(event.target.value)}
                       placeholder="Username, email, or device name" />
            </label>}

            {filteredDevices.length > 0 ? <div className="admin-list">
                {filteredDevices.map(device => {
                    const user = users[device.userId]
                    const username = user ? user.username : device.userId

                    return (
                        <div className="admin-list-item" key={device.id}>
                            <div>
                                <strong>{device.deviceName}</strong>
                                <span>{device.vpnAddress}</span>
                                <span>{username}{user && " · " + user.email}</span>
                                <span>Created {new Date(device.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="admin-list-actions">
                                {device.userId && <button className="admin-danger-button"
                                        onClick={() => revokeUserDevices(device.userId, username)}>
                                    Revoke user devices
                                </button>}
                                <button className="admin-danger-button" onClick={() => revokeDevice(device.id)}>
                                    Revoke device
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div> : <p className="admin-empty-state">
                {devices.length === 0 ? "No VPN devices have been created." : "No VPN devices match your search."}
            </p>}
        </div>
    )
}

export default VpnAdministration
