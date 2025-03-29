// Integration file: Files

import { useEffect, useRef, useState } from "react"
import VideoPlayer from "./VideoPlayer"
import ImageViewer from "./ImageViewer"
import MusicPlayer from "./MusicPlayer"
import "./css/FilesList.css"

const FilesList = () => {
    const [files, setFiles] = useState([])
    const [selectedVideoFile, setSelectedVideoFile] = useState(null)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [selectedAudioFile, setSelectedAudioFile] = useState(null)
    const fileInputRef = useRef(null)

    const videoExtensions = ["mp4", "webm", "ogg"];
    const audioExtensions = ["mp3", "wav", "flac", "aac", "m4a", "ogg"];
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

    const handleVideo = (fileName) => {
        setSelectedVideoFile(`http://localhost:6010/stream/${fileName}`)
    }

    const closeVideo = () => {
        setSelectedVideoFile(null)
    }

    const handleImage = (fileName) => {
        setSelectedImageFile(`http://localhost:6010/stream/${fileName}`)
    }

    const closeImage = () => {
        setSelectedImageFile(null)
    }

    const handleAudio = (fileName) => {
        setSelectedAudioFile(`http://localhost:6010/stream/${fileName}`)
    }

    const closeAudio = () => {
        setSelectedAudioFile(null)
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
                    const isVideo = videoExtensions.includes(fileExtension)
                    const isImage = imageExtensions.includes(fileExtension)
                    const isAudio = audioExtensions.includes(fileExtension)

                    return(
                        <li key={index} className="file-item">
                            <span>{file}</span>
                            <div className="file-item-button-div">
                                {isVideo && <button onClick={() => handleVideo(file)} className="stream-btn">Stream</button>}
                                {isImage && <button onClick={() => handleImage(file)} className="view-btn">View</button>}
                                {isAudio && <button onClick={() => handleAudio(file)} className="listen-btn">Listen</button>}
                                <button onClick={() => handleDownload(file)} className="download-btn">Download</button>
                                <button onClick={() => handleDelete(file)} className="delete-btn">Delete</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
            
            {selectedVideoFile && <VideoPlayer videoUrl={selectedVideoFile} onClose={closeVideo} />}
            {selectedImageFile && <ImageViewer imageUrl={selectedImageFile} onClose={closeImage} />}
            {selectedAudioFile && <MusicPlayer audioUrl={selectedAudioFile} onClose={closeAudio} />}
        </div>
    )
}

export default FilesList
