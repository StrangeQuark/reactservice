// Integration file: File

import Toolbar from '../components/Toolbar'
import FilesList from '../components/fileservice/FilesList'
import { RequireAuth } from '../context/AuthContext'

const Upload = () => {
    return(
        <RequireAuth>
            <Toolbar />

            <FilesList />
        </RequireAuth>
    )
}

export default Upload