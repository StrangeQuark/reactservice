import { useEffect, useState } from "react" // Integration line: Auth
import "./css/Toolbar.css"
import logo from "../res/logo.png"
import darkModeLogo from "../res/logo_dark_mode.png"
import { RiLoginCircleLine } from "react-icons/ri" // Integration line: Auth
import { MdDarkMode, MdLightMode } from "react-icons/md"
import { useAuth } from "../context/AuthContext" // Integration line: Auth
import { sendTelemetryEvent } from "../utility/TelemetryUtility" // Integration line: Telemetry

const THEME_STORAGE_KEY = "reactservice-theme"

const getStoredTheme = () => {
    if (typeof window === "undefined") {
        return "light"
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light"
}

const Toolbar = () => {
    /* Integration function start: Auth */
    const [displayPopout, setDisplayPopout] = useState(false)
    const { isLoggedIn, username, logout } = useAuth()
    const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(getStoredTheme)

    const navigateTo = (path) => {
        sendTelemetryEvent("react-toolbar-navigation", {"path": path}) // Integration line: Telemetry
        window.location.href = path
        setCenterDropdownOpen(false)
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")
    }
    /* Integration function end: Auth */

    return (
        <div className="toolbar">
            <div className="left-div">
                <img alt="Logo" src={ theme === "dark" ? darkModeLogo : logo } />
            </div>
            <div className="center-div">
                <a href="/" data-testid="home-nav-link">Home</a>
                <a href="/files" data-testid="files-nav-link">Files</a> {/* Integration line: File */}
                <a href="/vault" data-testid="vault-nav-link">Vault</a> {/* Integration line: Vault */}

                {/* Mobile dropdown start*/}
                <button className="center-dropdown-button" onClick={() => setCenterDropdownOpen(!centerDropdownOpen)}>Menu</button>

                <div className={`center-dropdown-container ${centerDropdownOpen ? "show" : ""}`}>
                    <button onClick={() => { navigateTo("/") }}>Home</button>
                    <button onClick={() => { navigateTo("/files") }}>Files</button>
                    <button onClick={() => { navigateTo("/vault") }}>Vault</button>
                </div>
                {/* Mobile dropdown end*/}
            </div>
            <div className="right-div">
                <button
                    type="button"
                    className={`theme-toggle ${theme === "dark" ? "dark" : ""}`}
                    data-testid="theme-toggle"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    aria-pressed={theme === "dark"}
                    onClick={toggleTheme}
                >
                    <span className="theme-toggle-track">
                        <MdLightMode className="theme-toggle-icon theme-toggle-sun" />
                        <MdDarkMode className="theme-toggle-icon theme-toggle-moon" />
                        <span className="theme-toggle-thumb" />
                    </span>
                </button>
                { !isLoggedIn ? <RiLoginCircleLine id="loginButton" data-testid="loginButton" size={"2em"} onClick={() => navigateTo("/login")}/> : <button id="userButton" className="user-button" onClick={() => setDisplayPopout(!displayPopout)}>{username}</button> /* Integration function start: Auth */}
                {
                    displayPopout && (<div id='center-popout-container' className="center-popout-container">
                        <button onClick={() => {
                            navigateTo(`/user/${username}`)
                            setDisplayPopout(false)
                        }}>
                            Profile
                        </button>

                        <button onClick={() => {
                            navigateTo(`/settings`)
                            setDisplayPopout(false)
                        }}>
                            Settings
                        </button>

                        <button onClick={() => {
                            logout()
                            setDisplayPopout(false)
                        }}>
                            Logout
                        </button>
                    </div>)
                /* Integration function end: Auth */}
            </div>
        </div>
    )
}

export default Toolbar
