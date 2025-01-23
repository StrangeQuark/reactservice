// Integration file: Auth

import React from "react";
import "./css/UserLoginForm.css";

export default class UserLoginForm extends React.Component {
    async componentDidMount() {
        //Since we are using a button outside of the form to handle the login attempt
        //let's listen to the username and password input fields for if the user
        //presses the enter key, and if so we can simulate a button click
        var usernameInput = document.getElementById('username')
        var passwordInput = document.getElementById('password')

        usernameInput.addEventListener('keyup', function onEvent(e) {
            if(e.code === "Enter") {
                document.getElementById('submit-button').click()
            }
        })
        passwordInput.addEventListener('keyup', function onEvent(e) {
            if(e.code === "Enter") {
                document.getElementById('submit-button').click()
            }
        })

        //Change the size of the login-form
        var loginForm = document.getElementById('login-form')

        loginForm.style.width = (window.innerWidth / 8) + "px";
        loginForm.style.height = (window.innerHeight / 4) + "px";

        //Move the login-div to the center of the screen once the width and height have been rendered
        var loginDiv = document.getElementById('login-div')

        loginDiv.style.marginTop = "-" + loginDiv.offsetHeight / 2 + "px"
        loginDiv.style.marginLeft = "-" + loginDiv.offsetWidth / 2 + "px"
    }

    render() {
        function loginHandler(username, password) {
            //JWT 
            var loginJSON = {"username": username, "password": password}

            //Error message
            var errorMessage = document.getElementById('error-message')
            var errorMessageText = ''

            //Reset all the login error messages when the user attempts a login
            errorMessage.hidden = true

            //Check if the username and password are empty. If they are, display error message
            if(username === "") {
                errorMessageText = 'You must enter a username'
                errorMessage.hidden = false
                return
            }
            if(password === "") {
                errorMessageText = 'You must enter a password'
                errorMessage.hidden = false
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
                            errorMessageText = 'Incorrect username or password'
                            errorMessage.hidden = false
                            //error out
                            return
                        }

                        var requestSuccessDiv = document.getElementById('request-success-div')
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
            <div id="login-div" className="login-div">
                <h1 style={{color: "white"}}>Login</h1>
                <div style={{height: "50px"}} >
                    <b id="error-message" hidden={true} style={{color: "red"}}>{errorMessage}</b>
                </div>
                <form id="login-form" className="login-form">
                    <label htmlFor="username">Username:</label><br />
                    <div style={{height: "20px"}} />
                    <input type="text" id="username" name="username" placeholder="Type your username"/><hr />
                    <div style={{height: "20px"}} />
                    <label htmlFor="password">Password:</label><br />
                    <div style={{height: "20px"}} />
                    <input type="password" id="password" name="password" placeholder="Type your password"/><hr />
                    <div id="remember-me-div" className="remember-me-div">
                        <input type="checkbox" id="remember-me-checkbox" className="remember-me-checkbox"></input>
                        <label className="remember-me-label" for="remember-me-checkbox">Remember me</label>
                        <a className="forgot-password" href="/password-reset">Forgot password?</a><br />
                    </div>
                </form>
                <div style={{height: "50px"}} />
                <button className="submit-button" id='submit-button' onClick={() => loginHandler(window.document.getElementById('username').value, window.document.getElementById('password').value)}>LOGIN</button>
                <div style={{height: "100px"}} />
                <h4 style={{color: "white"}}>Need an account?</h4>
                <a className="register" href="/register">Sign up</a>
            </div>
        )
    }
}