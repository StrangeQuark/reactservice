// Integration file: Auth

import { createContext, useContext, useEffect, useState } from "react"
import { AUTH_ENDPOINTS } from "../config"
import { Navigate } from "react-router-dom"

const AuthContext = createContext(null)

export const decodeJWT = (token) => {
    const payloadBase64 = token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/")

    const payloadJson = atob(payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, "="))
    return JSON.parse(payloadJson)
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshTimer, setRefreshTimer] = useState(null)

    useEffect(() => {
        const initAuth = async () => {
            await refreshAccessToken()
            setLoading(false)
        }
        initAuth()
    }, [])

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.ACCESS, {
                method: "POST",
                credentials: "include"
            })
            if (!response.ok) 
                return false

            const data = await response.json()

            setAccessToken(data.jwtToken)
            setIsLoggedIn(true)
            setUsername(getUsernameFromJWT(data.jwtToken))
            scheduleTokenRefresh(data.jwtToken)
            return true
        } catch {
            return false
        }
    }

    const getUsernameFromJWT = (token) => {
        try {
            return decodeJWT(token).sub
        } catch {
            return null
        }
    }

    const logout = () => {
        if (refreshTimer) 
            clearTimeout(refreshTimer)

        fetch(AUTH_ENDPOINTS.LOGOUT, {
            method: "POST",
            credentials: "include"
        })
        setAccessToken(null)
        setIsLoggedIn(false)
        setUsername(null)
    }

    const getAccessToken = () => accessToken

    const scheduleTokenRefresh = (token) => {
        try {
            const { exp } = decodeJWT(token)

            const expiresAt = exp * 1000
            const timeout = expiresAt - Date.now() - 60000  

            if (timeout > 0) {
                if (refreshTimer) 
                    clearTimeout(refreshTimer)

                const timerId = setTimeout(async () => {
                    const valid = await refreshAccessToken()
                    
                    if (!valid) {
                        logout()
                    }
                }, timeout)

                setRefreshTimer(timerId)
            } else {
                refreshAccessToken().then((valid) => {
                    if (!valid) 
                        logout()
                })
            }
        } catch {
            logout()
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, loading, setUsername, logout, getAccessToken, refreshAccessToken }}>
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
