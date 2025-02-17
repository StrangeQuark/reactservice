// Integration file: Auth

import React from 'react'
import "./css/SettingsNavigation.css"

const SettingsNavigation = ({ setSelectedSection }) => {
    return (
        <div className="settings-navigation">
            <button onClick={() => setSelectedSection('account')}>Account Settings</button>
            <button onClick={() => setSelectedSection('security')}>Security Settings</button>
        </div>
    )
}

export default SettingsNavigation
