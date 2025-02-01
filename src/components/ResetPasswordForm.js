// Integration file: Email

import React, { useState } from "react"
import "./css/ResetPasswordForm.css"

const ResetPasswordForm = () => {
    const[isSuccess, setIsSuccess] = useState(false)
    const[isError, setIsError] = useState(false)
    const[errorMessage, setErrorMessage] = useState("")
    const[password, setPassword] = useState("")
    const[confirmationPassword, setConfirmationPassword] = useState("")

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            requestHandler()
        }
    }

    const requestHandler = () => {
        //Get the search params
        const query = window.location.search
        const urlParameters = new URLSearchParams(query)
        const token = urlParameters.get('token')

        //If the user enters nothing, do nothing
        if(password === "") {
            return
        }

        //If the passwords do not match, show the error message
        if(password !== confirmationPassword) {
            setIsError(true)
            setErrorMessage("Passwords do not match")
            return
        }

        fetch('http://localhost:6005/email/confirmToken?token=' + token, {
            method: 'GET',
            }).then(response => response.json().then(
                (data) => {
                    if(!response.ok) {
                        setErrorMessage(data.message)
                        setIsError(true)
                        return
                    }
                    
                    setIsSuccess(true)
                }
            ))
    }

    return(
        <>
        {!isSuccess && (<div id="request-div" className="auth-div">
            <h1>New password</h1>
            <div className="error-div">
                {isError && (<b id="nonmatching-password-message">{errorMessage}</b>)}
            </div>
            <form id="request-form" onKeyDown={handleKeyDown} onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="password">New password:</label>
                <br />
                <input type="password" id="password" name="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <hr />

                <label htmlFor="confirm-password">Confirm password:</label>
                <br />
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)}/>
                <hr />
            </form>
            <button id='submit-button' onClick={() => requestHandler()}>SUBMIT</button>
        </div>)}
        {isSuccess && (<div id="request-success-div" className="auth-div">
            <p id="request-success-text-field">Your password has been successfully reset</p>
        </div>)}
        </>
    )
}

export default ResetPasswordForm
