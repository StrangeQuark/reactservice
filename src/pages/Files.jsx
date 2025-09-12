// Integration file: File

import Toolbar from '../components/Toolbar'
import FilesList from '../components/fileservice/FilesList'
import { RequireAuth } from '../context/AuthContext' // Integration line: Auth

const Files = () => {
    return(
        <RequireAuth> {/* Integration line: Auth */}
            <Toolbar />

            <FilesList />
        </RequireAuth> // Integration line: Auth
    )
}

export default Files
