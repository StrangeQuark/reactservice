/* Integration file: Auth */

export const verifyRefreshToken = async () => {
    const jwtToken = document.cookie.split("; ").find((row) => row.startsWith("refresh_token="))?.split("=")[1]

    if (!jwtToken) {
        return false
    }

    try {
        const response = await fetch('http://localhost:6001/auth/access', {
            headers: {
                'Authorization': "Bearer " + jwtToken,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        document.cookie = "access_token=" + data.jwtToken
        return true
    } catch (err) {
        return false
    }
}


export const getUsernameFromJWT = () => {
    try {
        const jwtToken = document.cookie.split("; ").find((row) => row.startsWith("refresh_token="))?.split("=")[1]

        const payloadBase64 = jwtToken.split('.')[1]
        const payloadJson = atob(payloadBase64)
        const payload = JSON.parse(payloadJson)

        return payload.sub
    } catch (error) {
        return null
    }
}

export const getRefreshToken = () => {
    return document.cookie.split("; ").find((row) => row.startsWith("refresh_token="))?.split("=")[1]
}

export const getAccessToken = () => {
    return document.cookie.split("; ").find((row) => row.startsWith("access_token="))?.split("=")[1]
}