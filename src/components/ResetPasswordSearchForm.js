// Integration file: Email
// Integration file: Auth

import React from "react";
import "./css/ResetPasswordSearchForm.css";

export default class ResetPasswordSearchForm extends React.Component {
    async componentDidMount() {
        //Since we are using a button outside of the form to handle the login attempt
        //let's listen to the credentials input field for if the user
        //presses the enter key, and if so we can simulate a button click
        var credentialsInput = document.getElementById('credentials')

        credentialsInput.addEventListener('keyup', function onEvent(e) {
            if(e.code === "Enter") {
                document.getElementById('submit-button').click()
            }
        })

        //Change the size of some elements to be proportional to the screen
        var requestForm = document.getElementById('request-form')
        var noCredentialsMessageDiv = document.getElementById('no-credentials-message-div')
        var requestSuccessTextField = document.getElementById('request-success-text-field')

        requestForm.style.width = (window.innerWidth / 8) + "px";
        requestForm.style.height = (window.innerHeight / 4) + "px";
        noCredentialsMessageDiv.style.width = (window.innerWidth / 8) + "px";
        requestSuccessTextField.style.width = (window.innerWidth / 6) + "px";

        //Move the request-div to the center of the screen once the width and height have been rendered
        var requestDiv = document.getElementById('request-div')

        requestDiv.style.marginTop = "-" + requestDiv.offsetHeight / 2 + "px"
        requestDiv.style.marginLeft = "-" + requestDiv.offsetWidth / 2 + "px"
    }

    render() {
        function requestHandler(credentials) {
            var credentials = {"credentials": credentials}

            //Error messages
            var noCredentialsMessage = document.getElementById('no-credentials-message')

            //Reset all the login error messages when the user attempts a login
            noCredentialsMessage.hidden = true

            //If the user enters nothing, do nothing
            if(credentials === "") {
                noCredentialsMessage.hidden = false
                return
            }

            fetch('http://localhost:6001/user/verify-user-and-send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
                }).then(response => response.json().then(
                    (data) => {
                        if(response.status === 404) {
                            noCredentialsMessage.hidden = false
                            return
                        }

                        var requestSuccessDiv = document.getElementById('request-success-div')
                        document.getElementById('request-div').hidden = true
                        requestSuccessDiv.hidden = false

                        //Move the request-success-div to the center of the screen once the width and height have been rendered
                        requestSuccessDiv.style.marginTop = "-" + requestSuccessDiv.offsetHeight / 2 + "px"
                        requestSuccessDiv.style.marginLeft = "-" + requestSuccessDiv.offsetWidth / 2 + "px"
                    }
                ))
        }

        return(
            <>
            <div id="request-div" className="request-div">
                <h1 style={{color: "white"}}>Reset password</h1>
                <div id="no-credentials-message-div" style={{height: "100px"}} >
                    <b id="no-credentials-message" hidden={true} style={{color: "red"}}>Sorry, we could not find your account</b>
                </div>
                <form id="request-form" className="request-form">
                    <label htmlFor="credentials">Username or email:</label><br />
                    <div style={{height: "20px"}} />
                    <input type="text" id="credentials" name="credentials" placeholder="Type your username or email"/><hr />
                </form>
                <button className="submit-button" id='submit-button' onClick={() => requestHandler(window.document.getElementById('credentials').value)}>SUBMIT</button>
            </div>
            <div id="request-success-div" className="request-div" hidden={true}>
                <p id="request-success-text-field">Please check your email for a password reset link</p>
            </div>
            </>
        )
    }
}