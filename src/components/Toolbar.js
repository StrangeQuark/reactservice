import React from "react";
import "./css/Toolbar.css";
import logo from "../res/logo.png"
import { IoMdSettings } from "react-icons/io";
import { RiLoginCircleLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";

const Toolbar = () => {
    var username = null
    var localUsername = localStorage.getItem('username')
    var sessionUsername = sessionStorage.getItem('username')

    if(localUsername != null) {
        username = localUsername
    }
    if(sessionUsername != null) {
        username = sessionUsername
    }

    function displayPopout() {
        document.getElementById('user-popout-container').hidden = !document.getElementById('user-popout-container').hidden
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
                <GiHamburgerMenu size={"3%"}/>
                <img src={ logo } />
                <select>
                    <option className="option">Project 1</option>
                    <option className="option">Super long Project 2</option>
                    <option className="option">Project 3</option>
                    <option className="option">Project 4</option>
                </select>
            </div>
            <div className="center-div">
                <a href="/">Home</a>
                <a href="/backlog">Backlog</a>
                <a href="/reports">Reports</a>
            </div>
            <div className="right-div">
                <input type="text" id="searchBar" placeholder="Search" />
                <IoMdSettings size={"2em"}/>
                { (username === null) ? <RiLoginCircleLine id="loginButton" size={"2em"} onClick={() => navigateToLoginPage()}/> : <a id="userButton" onClick={displayPopout}>{username}</a> }
                <div id='center-popout-container' className="center-popout-container" hidden={true}>
                    <button onClick={() => {navigateToUserProfile()}}>Profile</button>
                    <button>Settings</button>
                    <button onClick={() => {logout()}}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;