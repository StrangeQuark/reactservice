import { useState } from "react"
import "./css/Toolbar.css"
import logo from "../res/logo.png"
import { RiLoginCircleLine } from "react-icons/ri"
import { GiHamburgerMenu } from "react-icons/gi"
import { useAuth } from "../context/AuthContext" // Integration line: Auth

const Toolbar = () => {
    /* Integration function start: Auth */
    const [displayPopout, setDisplayPopout] = useState(false)
    const { isLoggedIn, username, logout } = useAuth()

    const navigateTo = (path) => {
        window.location.href = path
    }
    /* Integration function end: Auth */
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault()
            // Insert search logic here
        }
    }

    return (
        <div className="toolbar">
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
                <a href="/files">Files</a> {/* Integration line: File */}
                <a href="/vault">Vault</a> {/* Integration line: Vault */}
            </div>
            <div className="right-div">
                <input type="text" id="searchBar" placeholder="Search" onKeyDown={handleKeyDown} onSubmit={(e) => e.preventDefault()}/>
                { !isLoggedIn ? <RiLoginCircleLine id="loginButton" data-testid="loginButton" size={"2em"} onClick={() => navigateTo("/login")}/> : <button id="userButton" className="user-button" onClick={() => setDisplayPopout(!displayPopout)}>{username}</button> /* Integration line: Auth */}
                {/* Integration function start: Auth */
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