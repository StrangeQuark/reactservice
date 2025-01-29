// Integration file: Email
// Integration file: Auth

import React, { useEffect, useState } from "react";
import "./css/ConfirmEmailMessage.css";

const ConfirmEmailMessage = () => {
    const [message, setMessage] = useState()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        fetch('http://localhost:6005/email/enableUser?token=' + token, {
            method: 'GET',
            }).then(response => response.json().then(
                (data) => {
                    setMessage(data.message)
                }
            ))
    }, []);

    return(
        <>
            {message && (
            <div id="message-div" className="auth-div">
                <p id="message-text-field">{message}</p>
            </div>
            )}
        </>
    )
}

export default ConfirmEmailMessage;
