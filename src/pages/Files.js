// Integration file: Email

import React from 'react'
import Toolbar from '../components/Toolbar'
import UploadForm from '../components/fileservice/UploadForm'
import FilesList from '../components/fileservice/FilesList'

const Upload = () => {
    return(
        <>
            <Toolbar />

            <UploadForm />

            <FilesList />
        </>
    )
}

export default Upload