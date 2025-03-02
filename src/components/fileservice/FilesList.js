import { useEffect, useRef, useState } from "react"
import StreamPlayer from "./StreamPlayer"
import "./FilesList.css"

const FilesList = () => {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)

    const mediaExtensions = ["mp4", "webm", "ogg", "mp3", "wav", "flac", "aac", "m4a"]

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

    const handleDelete = async (fileName) => {
        try {
            await fetch(`http://localhost:6010/file/delete/${fileName}`)
            fetchFiles()
        } catch (error) {
            console.error("Delete failed", error)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        try {
            await fetch("http://localhost:6010/upload", {
                method: "POST",
                body: formData,
            })
            fetchFiles()
        } catch (error) {
            console.error("Upload failed", error)
        }
    }

    const openFilePicker = () => {
        fileInputRef.current.click()
    }

    const handleView = (fileName) => {
        setSelectedFile(`http://localhost:6010/stream/${fileName}`)
    }

    const closePlayer = () => {
        console.log("debug")
        setSelectedFile(null)
    }

    return (
        <div className="files-list">
            <div className="files-list-header">
                <h2>Uploaded Files</h2>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hiddenInput" />
                <button onClick={openFilePicker} className="fileButton">Upload</button>
            </div>
            <ul>
                {files.map((file, index) => {
                    const fileExtension = file.split('.').pop().toLowerCase()
                    const isMedia = mediaExtensions.includes(fileExtension)

                    return(
                        <li key={index} className="file-item">
                            <span>{file}</span>
                            <div className="file-item-button-div">
                                {isMedia && <button onClick={() => handleView(file)} className="view-btn">View</button>}
                                <button onClick={() => handleDownload(file)} className="download-btn">Download</button>
                                <button onClick={() => handleDelete(file)} className="delete-btn">Delete</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
            
            {selectedFile && <StreamPlayer streamUrl={selectedFile} onClose={closePlayer} />}
        </div>
    )
}

export default FilesList
