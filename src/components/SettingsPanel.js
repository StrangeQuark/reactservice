import { getAccessToken } from "../utility/AuthUtility" /* Integration line: Auth */

const SettingsPanel = () => {

    const deleteProfile = () => {
        const accessToken = getAccessToken()

        var credentialsJson = { "credentials": "t", "password": "t" }

        fetch('http://localhost:6001/deleteUser', {
            method: "POST",
            headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentialsJson)
        }).then(response => response.json().then((data) => {
            console.log(data)
        }))
    }

    return(
        <button onClick={() => {deleteProfile()}}>Delete profile</button>
    )
}

export default SettingsPanel