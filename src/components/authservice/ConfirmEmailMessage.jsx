// Integration file: Email
// Integration file: Auth

import { useEffect, useState } from "react"
import { EMAIL_ENDPOINTS } from "../../config"
import { authenticateServiceAccount } from "../../utility/AuthUtility"
import { sendTelemetryEvent } from "../../utility/TelemetryUtility" // Integration line: Telemetry

const ConfirmEmailMessage = () => {
    const [message, setMessage] = useState()
    const [expiredTokenMessage, setExpiredTokenMessage] = useState(false)
    const [expiredTokenEmail, setExpiredTokenEmail] = useState("")

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        sendTelemetryEvent("react-confirm-email-message-visited") // Integration line: Telemetry
        fetch(EMAIL_ENDPOINTS.ENABLE_USER + token, {
            method: 'GET',
            }).then(response => response.json().then(
                (data) => {
                    if(data.message === "The token has expired") {
                        setExpiredTokenEmail(data.email)
                        setExpiredTokenMessage(true)
                    }
                    else
                        setMessage(data.message)
                }
            ))
    }, [])

    const resendEmailToken = async () => {
        sendTelemetryEvent("react-resend-email-token-attempt") // Integration line: Telemetry
        var requestBody = {"recipient": expiredTokenEmail, "sender": "donotreply@reactservice.com", "subject": "Account registration"}

        fetch(EMAIL_ENDPOINTS.SEND_REGISTER_EMAIL, {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + await authenticateServiceAccount(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(response => response.json().then(
            (data) => {
                setExpiredTokenMessage(false)
                setMessage(data.message)
            }
        ))
    }

    return(
        <>
            {message && (
                <div id="message-div" className="auth-div">
                    <p id="message-text-field">{message}</p>
                </div>
            )}

            {expiredTokenMessage && (
                <div id="message-div" className="auth-div">
                    <p id="message-text-field">
                        This token has expired - Click the link below to request a new token
                    </p>
                    <a onClick={() => resendEmailToken()} style={{ textDecoration: "underline" }}>Click here</a>
                </div>
            )}
        </>
    )
}

export default ConfirmEmailMessage
