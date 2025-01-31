// Integration file: Auth

import React, { useEffect, useState } from "react";
import { verifyRefreshToken } from "../utility/AuthUtility";
import Toolbar from './../components/Toolbar';

const UserProfile = () => {
    
    return(
        <>
            <Toolbar />

            {verifyRefreshToken ? <p>Token good</p> : <p>Token bad</p>}
        </>
    )
}

export default UserProfile;