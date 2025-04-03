// Integration file: Auth

import { useState } from "react"
import { getAccessToken } from "../../utility/AuthUtility"
import { SlPencil } from "react-icons/sl"
import "./css/AccountSettings.css"
import InputPopup from "../InputPopup"

const AccountSettings = () => {
    const [username, setUsername] = useState("test")
    const [email, setEmail] = useState("test@test.com")
    const [popupType, setPopupType] = useState(null)

    const updateUsername = async (newUsername) => {
        const accessToken = getAccessToken()
        await fetch("http://localhost:6001/user/updateUsername", {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUsername }),
        })

        setUsername(newUsername)
    }

    const updateEmail = async (newEmail) => {
        const accessToken = getAccessToken()
        await fetch("http://localhost:6001/user/updateEmail", {
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
        const accessToken = getAccessToken()

        const credentialsJson = {
            credentials: "t",
            password: "t",
        }

        fetch("http://localhost:6001/user/deleteUser", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentialsJson),
        }).then((response) =>
            response.json().then(() => {
                document.cookie =
                    "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                document.cookie =
                    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

                window.location.href = "/"
            })
        )
    }

    const closePopup = () => {
        setPopupType(null)
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
                    onClose={closePopup}
                />
            )}

            {popupType === "email" && (
                <InputPopup
                    label="Email"
                    defaultValue={email}
                    onSubmit={updateEmail}
                    onClose={closePopup}
                />
            )}
        </div>
    )
}

export default AccountSettings
