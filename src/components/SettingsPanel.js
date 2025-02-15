import { getRefreshToken } from "../utility/AuthUtility" /* Integration line: Auth */

const SettingsPanel = () => {

    const deleteProfile = () => {
        console.log(getRefreshToken())
    }

    return(
        <button onClick={() => {deleteProfile()}}>Delete profile</button>
    )
}

export default SettingsPanel