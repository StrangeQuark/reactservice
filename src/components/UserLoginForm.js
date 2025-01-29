// Integration file: Auth

import React, { useState } from "react"
import "./css/UserLoginForm.css"

const UserLoginForm = () => {
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const[errorMessage, setErrorMessage] = useState("")

    function loginHandler() {
        //JWT 
        var loginJSON = {"username": username, "password": password}

        //Check if the username and password are empty. If they are, display error message
        if(username === "") {
            setErrorMessage('Username is empty')
            return
        }
        if(password === "") {
            setErrorMessage('Password is empty')
            return
        }

        fetch('http://localhost:6001/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginJSON)
            }).then(response => response.json().then(
                (data) => {
                    if(response.status === 401) {
                        setErrorMessage('Incorrect credentials')
                        return
                    }

                    //Save the JWT token to the cookies
                    document.cookie = "refresh_token=" + data.jwtToken

                    //Navigate back, or go to homepage if coming from the registration page
                    if(!document.referrer.endsWith('/register'))
                        window.history.back()
                    else
                        window.location.href="/"
                }
            ))
    }

    return(
        <div id="login-div" className="auth-div">
            <h1>Login</h1>
            <div style={{height: "50px"}} >
                {errorMessage && (<b id="error-message">{errorMessage}</b>)}
            </div>
            <form id="login-form">
                <label htmlFor="username">Username:</label>
                <br />
                <input type="text" id="username" name="username" placeholder="Type your username" spellCheck="false" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <hr />
                <label htmlFor="password">Password:</label>
                <br />
                <input type="password" id="password" name="password" placeholder="Type your password" spellCheck="false" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <hr />
            </form>
            <button id='submit-button' onClick={() => loginHandler()}>LOGIN</button>
            <div className="auth-help-div">
                <a href="/password-reset">Forgot password?</a>
                <a href="/register">Sign up</a>
            </div>
        </div>
    )
}

export default UserLoginForm
