// Integration file: Auth

import { useState } from "react"
import { SlPencil } from "react-icons/sl"
import { AUTH_ENDPOINTS } from "../../config"
import "./css/AccountSettings.css"
import InputPopup from "../InputPopup"
import { useAuth } from "../../context/AuthContext"

const AccountSettings = () => {
    const { username, email, setUsername, setEmail, getAccessToken, logout } = useAuth()
    const [popupType, setPopupType] = useState(null)

    const updateUsername = async (newUsername, password) => {
        await fetch(AUTH_ENDPOINTS.UPDATE_USERNAME, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getAccessToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUsername, password }),
        })

        setUsername(newUsername)
    }

    const updateEmail = async (newEmail) => {
        await fetch(AUTH_ENDPOINTS.UPDATE_EMAIL, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getAccessToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newEmail }),
        })

        setEmail(newEmail)
    }

    const updatePassword = async (password, newPassword) => {
        await fetch(AUTH_ENDPOINTS.UPDATE_PASSWORD, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getAccessToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password, newPassword }),
        })

        logout()
    }

    const deleteProfile = async (username, password) => {
        await fetch(AUTH_ENDPOINTS.DELETE_USER, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getAccessToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
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
                <button onClick={() => setPopupType("password")}>Change password</button>
            </div>

            <div className="delete-section">
                <h3>Delete Account</h3>
                <button onClick={() => setPopupType("delete")}>Delete Account</button>
            </div>

            {popupType === "username" && (
                <InputPopup
                    label="Edit username"
                    inputs={[
                        { name: "newUsername", labelValue: "New username", defaultValue: username },
                        { name: "password", labelValue: "Password" }
                    ]}
                    onSubmit={(values) => updateUsername(values.newUsername, values.password)}
                    onClose={() => setPopupType(null)}
                />
            )}

            {popupType === "email" && (
                <InputPopup
                    label="Edit email"
                    inputs={[
                        { name: "newEmail", labelValue: "New email", defaultValue: email },
                        { name: "password", labelValue: "Password" }
                    ]}
                    onSubmit={(values) => updateEmail(values.newEmail, values.password)}
                    onClose={() => setPopupType(null)}
                />
            )}

            {popupType === "password" && (
                <InputPopup
                    label="Edit password"
                    inputs={[
                        { name: "password", labelValue: "Current password"},
                        { name: "newPassword", labelValue: "New Password" }
                    ]}
                    onSubmit={(values) => updatePassword(values.password, values.newPassword)}
                    onClose={() => setPopupType(null)}
                />
            )}

            {popupType === "delete" && (
                <InputPopup
                    label="Delete account"
                    inputs={[
                        { name: "username", labelValue: "Username"},
                        { name: "password", labelValue: "Password" }
                    ]}
                    onSubmit={(values) => deleteProfile(values.username, values.password)}
                    onClose={() => setPopupType(null)}
                />
            )}
        </div>
    )
}

export default AccountSettings
