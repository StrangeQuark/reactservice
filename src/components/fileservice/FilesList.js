import { useEffect, useState } from "react"
import "./FilesList.css"

const FilesList = () => {
    const [files, setFiles] = useState([])

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            const response = await fetch("http://localhost:6010/file/getAll")
            const data = await response.json()
            setFiles(data)
        } catch (error) {
            console.error("Error fetching files", error)
        }
    }

    const handleDownload = (fileName) => {
        window.location.href = `http://localhost:6010/download/${fileName}`
    }

    // const handleDelete = async (fileName) => {
    //     try {
    //         await fetch(`http://localhost:6010/delete/${fileName}`, { method: "DELETE" })
    //         fetchFiles()
    //     } catch (error) {
    //         console.error("Delete failed", error)
    //     }
    // }

    return (
        <div className="files-list">
            <h2>Uploaded Files</h2>
            <ul>
                {files.map((file, index) => (
                    <li key={index} className="file-item">
                        <span>{file}</span>
                        <button onClick={() => handleDownload(file)} className="download-btn">Download</button>
                        {/* <button onClick={() => handleDelete(file)} className="delete-btn">Delete</button> */}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FilesList
