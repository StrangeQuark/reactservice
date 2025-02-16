import React, { useEffect, useState } from "react"
import "./css/Toolbar.css"
import logo from "../res/logo.png"
import { RiLoginCircleLine } from "react-icons/ri"
import { GiHamburgerMenu } from "react-icons/gi"
import { verifyRefreshToken, getUsernameFromJWT } from "../utility/AuthUtility" /* Integration line: Auth */

const Toolbar = () => {
    const [displayPopout, setDisplayPopout] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")

    /* Integration function start: Auth */
    useEffect(() => {
        const checkAuth = async () => {
            const isValid = await verifyRefreshToken()
            if (isValid) {
                setIsLoggedIn(true)
                setUsername(getUsernameFromJWT())
            }
        }
    
        checkAuth()
    }, [])
    /* Integration function end: Auth */

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault()
            // Insert search logic here
        }
    }

    /* Integration function start: Auth */
    const logout = () => {
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.href = "/"
    }
    /* Integration function end: Auth */

    const navigateToUserProfile = () => {
        window.location.href = "/user/" + username
    }

    const navigateToLoginPage = () => {
        window.location.href = "/login"
    }

    const navigateToSettings = () => {
        window.location.href = "/settings"
    }

    return (
        <div className="Toolbar">
            <div className="left-div">
                <GiHamburgerMenu size={"1em"}/>
                <img alt="Logo" src={ logo } />
                <select>
                    <option className="option">Dropdown</option>
                    <option className="option">Very very long dropdown option</option>
                </select>
            </div>
            <div className="center-div">
                <a href="/">Home</a>
            </div>
            <div className="right-div">
                <input type="text" id="searchBar" placeholder="Search" onKeyDown={handleKeyDown} onSubmit={(e) => e.preventDefault()}/>
                { !isLoggedIn ? <RiLoginCircleLine id="loginButton" size={"2em"} onClick={() => navigateToLoginPage()}/> : <button id="userButton" className="user-button" onClick={() => setDisplayPopout(!displayPopout)}>{username}</button> }
                {/* Integration function start: Auth */
                displayPopout && (<div id='center-popout-container' className="center-popout-container">
                    <button onClick={() => {navigateToUserProfile()}}>Profile</button>
                    <button onClick={() => {navigateToSettings()}}>Settings</button>
                    <button onClick={() => {logout()}}>Logout</button>
                </div>)
                /* Integration function end: Auth */}
            </div>
        </div>
    )
}

export default Toolbar