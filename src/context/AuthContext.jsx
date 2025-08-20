// Integration file: Auth

import { createContext, useContext, useEffect, useState } from "react"
import { AUTH_ENDPOINTS } from "../config"
import { Navigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshTimer, setRefreshTimer] = useState(null)

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = getCookie("access_token")

            if (accessToken && !isTokenExpired(accessToken)) {
                setIsLoggedIn(true)
                setUsername(getUsernameFromJWT(accessToken))
                scheduleTokenRefresh(accessToken)
                setLoading(false)
                return
            }

            const valid = await verifyRefreshToken()
            if (valid) {
                const newAccessToken = getCookie("access_token")
                setIsLoggedIn(true)
                setUsername(getUsernameFromJWT(newAccessToken))
                scheduleTokenRefresh(accessToken)
            }
            setLoading(false)
        }
        initAuth()
    }, [])

    const getCookie = (name) =>
        document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1] || null

    const isTokenExpired = (token) => {
        try {
            const payloadBase64 = token.split(".")[1]
            const payloadJson = atob(payloadBase64)
            const { exp } = JSON.parse(payloadJson)
            return Date.now() >= exp * 1000
        } catch {
            return true // Treat invalid tokens as expired
        }
    }

    const verifyRefreshToken = async () => {
        const refreshToken = getCookie("refresh_token")
        if (!refreshToken) return false

        try {
            const response = await fetch(AUTH_ENDPOINTS.ACCESS, {
                headers: {
                    Authorization: "Bearer " + refreshToken,
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

    const getUsernameFromJWT = (token) => {
        try {
            const payloadBase64 = token.split(".")[1]
            const payloadJson = atob(payloadBase64)
            return JSON.parse(payloadJson).sub
        } catch {
            return null
        }
    }

    const logout = () => {
        if (refreshTimer) 
            clearTimeout(refreshTimer)

        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        setIsLoggedIn(false)
        setUsername(null)
        window.location.href = "/"
    }

    const getAccessToken = () => getCookie("access_token")

    const scheduleTokenRefresh = (token) => {
        try {
            console.log("Start")
            const payloadBase64 = token.split(".")[1]
            const payloadJson = atob(payloadBase64)
            const { exp } = JSON.parse(payloadJson)

            const expiresAt = exp * 1000
            const timeout = expiresAt - Date.now() - 60000  

            console.log("Mid")

            if (timeout > 0) {
                if (refreshTimer) 
                    clearTimeout(refreshTimer)

                const timerId = setTimeout(async () => {
                    const valid = await verifyRefreshToken()
                    
                    if (!valid) {
                        logout()
                    } else {
                        const newAccessToken = getCookie("access_token")
                        scheduleTokenRefresh(newAccessToken)
                    }
                }, timeout)

                setRefreshTimer(timerId)
            } else {
                verifyRefreshToken().then((valid) => {
                    if (!valid) 
                        logout()
                })
            }
        } catch {
            console.log("Break")
            // logout()
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, loading, setUsername, logout, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export const RequireAuth = ({ children }) => {
    const { loading, isLoggedIn } = useAuth()

    if (loading) return null // or <Spinner /> for nicer UX
    if (!isLoggedIn) return <Navigate to="/login" replace />

    return children
}
