import React, { useState } from "react"
import "./css/Toolbar.css"
import logo from "../res/logo.png"
import { IoMdSettings } from "react-icons/io"
import { RiLoginCircleLine } from "react-icons/ri"
import { GiHamburgerMenu } from "react-icons/gi"

const Toolbar = () => {
    const [displayPopout, setDisplayPopout] = useState(false)

    var username = null
    var localUsername = localStorage.getItem('username')

    if(localUsername != null) {
        username = localUsername
    }

    function logout() {
        localStorage.clear()
        sessionStorage.clear()
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
                { (username === null) ? <RiLoginCircleLine id="loginButton" size={"2em"} onClick={() => navigateToLoginPage()}/> : <a id="userButton" onClick={() => setDisplayPopout(!displayPopout)}>{username}</a> }
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