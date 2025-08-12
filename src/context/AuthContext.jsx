// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react"
import { AUTH_ENDPOINTS } from "../config"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const valid = await verifyRefreshToken()
            if (valid) {
                setIsLoggedIn(true)
                setUsername(getUsernameFromJWT())
            }
            setLoading(false)
        }
        initAuth()
    }, [])

    const getCookie = (name) =>
        document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1]

    const verifyRefreshToken = async () => {
        const jwtToken = getCookie("refresh_token")
        if (!jwtToken) return false

        try {
            const response = await fetch(AUTH_ENDPOINTS.ACCESS, {
                headers: {
                    Authorization: "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            })
            if (!response.ok) return false

            const data = await response.json()
            document.cookie = "access_token=" + data.jwtToken
            return true
        } catch {
            return false
        }
    }

    const getUsernameFromJWT = () => {
        try {
            const jwtToken = getCookie("refresh_token")
            const payloadBase64 = jwtToken.split(".")[1]
            const payloadJson = atob(payloadBase64)
            return JSON.parse(payloadJson).sub
        } catch {
            return null
        }
    }

    const logout = () => {
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        setIsLoggedIn(false)
        setUsername(null)
        window.location.href = "/"
    }

    const getAccessToken = () => {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("access_token="))
            ?.split("=")[1] || null
    }


    return (
        <AuthContext.Provider value={{ isLoggedIn, username, loading, setUsername, logout, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
