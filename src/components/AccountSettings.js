// Integration file: Auth

import { useState } from "react"
import { getAccessToken } from "../utility/AuthUtility"
import "./css/AccountSettings.css"

const AccountSettings = () => {
    const [profile, setProfile] = useState({ username: 'test', email: 'test@test.com' })
    const [newUsername, setNewUsername] = useState('')
    const [newEmail, setNewEmail] = useState('')

    const updateUsername = async () => {
        const accessToken = getAccessToken()
        await fetch('http://localhost:6001/user/updateUsername', {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newUsername })
        })

        setProfile({ ...profile, username: newUsername })
    }

    const updateEmail = async () => {
        const accessToken = getAccessToken()
        await fetch('http://localhost:6001/user/updateEmail', {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newEmail })
        })

        setProfile({ ...profile, email: newEmail })
    }

    const deleteProfile = async () => {
        const accessToken = getAccessToken()

        var credentialsJson = {
            "credentials": "t",
            "password": "t"
        }

        fetch('http://localhost:6001/user/deleteUser', {
            method: "POST",
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentialsJson)
        }).then(response => response.json().then((data) => {
            document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

            window.location.href="/"
        }))
    }

    return(
        <div className="account-settings">
            <div className="profile-section">
                <h2>Profile Information</h2>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
            </div>

            <div className="update-section">
                <h3>Change Username</h3>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                <button onClick={updateUsername}>Update Username</button>
            </div>

            <div className="update-section">
                <h3>Change Email</h3>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <button onClick={updateEmail}>Update Email</button>
            </div>

            <div className="delete-section">
                <h3>Delete Account</h3>
                <button onClick={deleteProfile}>Delete Account</button>
            </div>
        </div>
    )
}

export default AccountSettings