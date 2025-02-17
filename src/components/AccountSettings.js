// Integration file: Auth

import { getAccessToken } from "../utility/AuthUtility"

const AccountSettings = () => {

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
        <button onClick={() => {deleteProfile()}}>Delete profile</button>
    )
}

export default AccountSettings