// Integration file: Auth

import React, { useEffect, useState } from "react";
import Toolbar from './../components/Toolbar';

const UserProfile = () => {
    // const params = useParams()

    const jwtToken = document.cookie.split("; ").find((row) => row.startsWith("refresh_token="))?.split("=")[1]

    fetch('http://localhost:6001/access', {
        headers: {
            'Authorization': "Bearer " + jwtToken,
            'Content-Type': 'application/json'
        },
        }).then(response => {
            if(response.status === 401) {
                window.location.href="/login"
            }
            else {
                response.json().then(
                    (data) => {
                        document.cookie = "access_token=" + data.jwtToken
                    }
                )
            }
        }
        ).catch(err => console.log(err))
    
    return(
        <>
            <Toolbar />

            "Hello"
        </>
    )
}

export default UserProfile;