// Integration file: Email
// Integration file: Auth

import React, { useState } from "react";
import "./css/ResetPasswordSearchForm.css";

const ResetPasswordSearchForm = () => {
    const[credentials, setCredentials] = useState("")
    const[isError, setIsError] = useState(false)
    const[isSuccess, setIsSuccess] = useState(false)

    function requestHandler() {
        var credentialsJson = {"credentials": credentials}

        //If the user enters nothing, do nothing
        if(credentials === "") {
            return
        }

        fetch('http://localhost:6001/user/verify-user-and-send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentialsJson)
            }).then(response => {
                    if(response.status === 404) {
                        setIsError(true)
                        return
                    }
                    setIsSuccess(true)
                }
            )
    }

    return(
        <>
        {!isSuccess && (<div id="request-div" className="req-div">
            <h1 style={{color: "white"}}>Reset password</h1>
            <div id="no-credentials-message-div" className="no-credentials-message-div" >
                {isError && (<b id="no-credentials-message">Sorry, we could not find your account</b>)}
            </div>
            <form id="request-form" className="req-form">
                <label htmlFor="credentials">Username or email:</label><br />
                <input type="text" id="credentials" name="credentials" placeholder="Type your username or email" value={credentials} onChange={(e) => setCredentials(e.target.value)}/>
                <hr />
            </form>
            <button className="submit-button" id='submit-button' onClick={() => requestHandler()}>SUBMIT</button>
        </div>)}
        {isSuccess && (<div id="request-success-div" className="req-div">
            <p id="request-success-text-field">Please check your email for a password reset link</p>
        </div>)}
        </>
    )
}

export default ResetPasswordSearchForm;