import { useEffect, useRef, useState } from "react"
import StreamPlayer from "./StreamPlayer"
import ImageViewer from "./ImageViewer"
import "./css/FilesList.css"

const FilesList = () => {
    const [files, setFiles] = useState([])
    const [selectedStreamFile, setSelectedStreamFile] = useState(null)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const fileInputRef = useRef(null)

    const mediaExtensions = ["mp4", "webm", "ogg", "mp3", "wav", "flac", "aac", "m4a"]
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "avif"];

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

    const handleStream = (fileName) => {
        setSelectedStreamFile(`http://localhost:6010/stream/${fileName}`)
    }

    const closePlayer = () => {
        setSelectedStreamFile(null)
    }

    const handleImage = (fileName) => {
        setSelectedImageFile(`http://localhost:6010/stream/${fileName}`)
    }

    const closeViewer = () => {
        setSelectedImageFile(null)
    }

    return (
        <div className="files-list">
            <div className="files-list-header">
                <h2>Uploaded Files</h2>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden-input" />
                <button onClick={openFilePicker} className="file-button">Upload</button>
            </div>
            <ul>
                {files.map((file, index) => {
                    const fileExtension = file.split('.').pop().toLowerCase()
                    const isMedia = mediaExtensions.includes(fileExtension)
                    const isImage = imageExtensions.includes(fileExtension)

                    return(
                        <li key={index} className="file-item">
                            <span>{file}</span>
                            <div className="file-item-button-div">
                                {isMedia && <button onClick={() => handleStream(file)} className="stream-btn">Stream</button>}
                                {isImage && <button onClick={() => handleImage(file)} className="view-btn">View</button>}
                                <button onClick={() => handleDownload(file)} className="download-btn">Download</button>
                                <button onClick={() => handleDelete(file)} className="delete-btn">Delete</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
            
            {selectedStreamFile && <StreamPlayer streamUrl={selectedStreamFile} onClose={closePlayer} />}
            {selectedImageFile && <ImageViewer imageUrl={selectedImageFile} onClose={closeViewer} />}
        </div>
    )
}

export default FilesList
