import { useState } from "react"
import { SlPencil } from "react-icons/sl"
import { AUTH_ENDPOINTS } from "../../config"
import "./css/AccountSettings.css"
import InputPopup from "../InputPopup"
import { useAuth } from "../../context/AuthContext"

const AccountSettings = () => {
    const { username, email, setUsername, setEmail, getAccessToken, logout } = useAuth()
    const [popupType, setPopupType] = useState(null)

    const updateUsername = async (newUsername) => {
        await fetch(AUTH_ENDPOINTS.UPDATE_USERNAME, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + getAccessToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUsername }),
        })

        setUsername(newUsername)
    }

    const updateEmail = async (newEmail) => {
        await fetch(AUTH_ENDPOINTS.UPDATE_EMAIL, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newEmail }),
        })

        setEmail(newEmail)
    }

    const deleteProfile = async () => {
        const credentialsJson = {
            credentials: "t", // TODO: replace with real input
            password: "t",
        }

        await fetch(AUTH_ENDPOINTS.DELETE_USER, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentialsJson),
        })

        logout()
    }

    return (
        <div className="account-settings">
            <div className="account-section">
                <h2>Account Information</h2>
                <div className="account-info">
                    <p>
                        <strong>Username:</strong> {username}
                    </p>
                    <SlPencil onClick={() => setPopupType("username")} />
                </div>
                <div className="account-info">
                    <p>
                        <strong>Email:</strong> {email}
                    </p>
                    <SlPencil onClick={() => setPopupType("email")} />
                </div>
            </div>

            <div className="delete-section">
                <h3>Delete Account</h3>
                <button onClick={deleteProfile}>Delete Account</button>
            </div>

            {popupType === "username" && (
                <InputPopup
                    label="Username"
                    defaultValue={username}
                    onSubmit={updateUsername}
                    onClose={() => setPopupType(null)}
                />
            )}

            {popupType === "email" && (
                <InputPopup
                    label="Email"
                    defaultValue={email}
                    onSubmit={updateEmail}
                    onClose={() => setPopupType(null)}
                />
            )}
        </div>
    )
}

export default AccountSettings
