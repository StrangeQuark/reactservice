// Integration file: Auth

import { AUTH_ENDPOINTS } from "../config"

const VITE_SERVICE_SECRET_REACT = import.meta.env.VITE_SERVICE_SECRET_REACT

export const authenticateServiceAccount = async () => {

    const requestBody = {
        "clientId": "react",
        "clientPassword": VITE_SERVICE_SECRET_REACT
    }

    const response = await fetch(AUTH_ENDPOINTS.AUTHENTICATE_SERVICE_ACCOUNT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if(!response.ok) {
        alert(data.errorMessage)
        return
    }

    return data.jwtToken
}