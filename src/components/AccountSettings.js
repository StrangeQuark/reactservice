// Integration file: Auth

import { useState } from "react"
import { getAccessToken } from "../utility/AuthUtility"
import { SlPencil } from "react-icons/sl";
import "./css/AccountSettings.css"

const AccountSettings = () => {
    const[username, setUsername] = useState('test')
    const[email, setEmail] = useState('test@test.com')
    const[newUsername, setNewUsername] = useState('')
    const[newEmail, setNewEmail] = useState('')

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

        setUsername(newUsername)
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

        setEmail(newEmail)
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
            <div className="account-section">
                <h2>Account Information</h2>
                <div className="account-info">
                    <p><strong>Username:</strong> {username}</p>
                    <SlPencil onClick={() => {}}/>
                </div>
                <div className="account-info">
                    <p><strong>Email:</strong> {email}</p>
                    <SlPencil onClick={() => {}}/>
                </div>
            </div>

            <div className="delete-section">
                <h3>Delete Account</h3>
                <button onClick={deleteProfile}>Delete Account</button>
            </div>
        </div>
    )
}

export default AccountSettings