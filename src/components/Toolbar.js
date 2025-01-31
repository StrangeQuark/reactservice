import React, { useEffect, useState } from "react"
import "./css/Toolbar.css"
import logo from "../res/logo.png"
import { IoMdSettings } from "react-icons/io"
import { RiLoginCircleLine } from "react-icons/ri"
import { GiHamburgerMenu } from "react-icons/gi"
import { verifyRefreshToken, getUsernameFromJWT } from "../utility/AuthUtility"

const Toolbar = () => {
    const [displayPopout, setDisplayPopout] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")

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
    

    function logout() {
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href="/"
    }

    function navigateToUserProfile() {
        window.location.href="/user/" + username
    }

    function navigateToLoginPage() {
        window.location.href="login"
    }

    return (
        <div className="Toolbar">
            <div className="left-div">
                <GiHamburgerMenu size={"1em"}/>
                <img src={ logo } />
                <select>
                    <option className="option">Dropdown</option>
                    <option className="option">Very very long dropdown option</option>
                </select>
            </div>
            <div className="center-div">
                <a href="/">Home</a>
            </div>
            <div className="right-div">
                <input type="text" id="searchBar" placeholder="Search" />
                <IoMdSettings size={"2em"}/>
                { !isLoggedIn ? <RiLoginCircleLine id="loginButton" size={"2em"} onClick={() => navigateToLoginPage()}/> : <a id="userButton" onClick={() => setDisplayPopout(!displayPopout)}>{username}</a> }
                {displayPopout && (<div id='center-popout-container' className="center-popout-container">
                    <button onClick={() => {navigateToUserProfile()}}>Profile</button>
                    <button>Settings</button>
                    <button onClick={() => {logout()}}>Logout</button>
                </div>)}
            </div>
        </div>
    )
}

export default Toolbar