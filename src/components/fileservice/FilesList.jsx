// Integration file: File

import { useEffect, useRef, useState } from "react"
import VideoPlayer from "./VideoPlayer"
import ImageViewer from "./ImageViewer"
import MusicPlayer from "./MusicPlayer"
import "./css/FilesList.css"
import { FILE_ENDPOINTS } from "../../config"
import { useAuth } from "../../context/AuthContext"
import InputPopup from "../InputPopup"
import { FaCog } from "react-icons/fa"
import UserManagementPopup from "../authservice/UserManagementPopup"

const FilesList = () => {
    const [collections, setCollections] = useState([])
    const [filteredCollections, setFilteredCollections] = useState([])
    const [files, setFiles] = useState([])
    const [selectedCollection, setSelectedCollection] = useState(null)
    const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedVideoFile, setSelectedVideoFile] = useState(null)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [selectedAudioFile, setSelectedAudioFile] = useState(null)
    const [popupType, setPopupType] = useState("")
    const [displayPopout, setDisplayPopout] = useState(false)
    const [currentUserRole, setCurrentUserRole] = useState(null)
    const fileInputRef = useRef(null)
    const { getAccessToken } = useAuth()

    const videoExtensions = ["mp4", "webm", "ogg"]
    const audioExtensions = ["mp3", "wav", "flac", "aac", "m4a", "ogg"]
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "avif"]

    useEffect(() => {
        fetchCollections()
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCollections(collections)
        } else {
            setFilteredCollections(
                collections.filter(c =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }
    }, [searchTerm, collections])

    const fetchCollections = async () => {
        const response = await fetch(FILE_ENDPOINTS.GET_ALL_COLLECTIONS, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + getAccessToken()
            }
        })
        const data = await response.json()
        setCollections(data)
        setFilteredCollections(data)
    }

    const createCollection = async (collectionName) => {
        const response = await fetch(`${FILE_ENDPOINTS.NEW_COLLECTION}/${collectionName}`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getAccessToken()
            }
        })

        if(!response.ok) {
            const message = await response.json()
            alert(message.errorMessage)
            return
        }

        const data = await response.text()
        if(data !== "New collection successfully created") {
            alert(data)
        }

        fetchCollections()
    }

    const getCurrentUserRole = async (collectionName) => {
        const response = await fetch(`${FILE_ENDPOINTS.GET_CURRENT_USER_ROLE}/${collectionName}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })

        const data = await response.json()

        setCurrentUserRole(data)
    }

    const fetchFiles = async (collectionName) => {
        try {
            const response = await fetch(`${FILE_ENDPOINTS.GET_ALL}/${collectionName}`, {
                headers: { Authorization: "Bearer " + getAccessToken() }
            })
            const data = await response.json()
            setFiles(data)
        } catch (error) {
            console.error("Error fetching files", error)
        }
    }

    const handleCollectionSelect = (collection) => {
        setSelectedCollection(collection)
        fetchFiles(collection.name)
        getCurrentUserRole(collection.name)
    }

    const handleDownload = async (fileName) => {
        try {
            const res = await fetch(`${FILE_ENDPOINTS.DOWNLOAD}/${selectedCollection.name}/${fileName}`, {
                    method: "GET",
                    headers: { Authorization: "Bearer " + getAccessToken() }
                })

            if (!res.ok) 
                throw new Error("Failed to download file")

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error(err)
        }
    }


    const handleDelete = async (fileName) => {
        try {
            await fetch(`${FILE_ENDPOINTS.DELETE}/${selectedCollection.name}/${fileName}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + getAccessToken() }
            })
            fetchFiles(selectedCollection.name)
        } catch (error) {
            console.error("Delete failed", error)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) 
            return

        const formData = new FormData()
        formData.append("file", file)

        try {
            await fetch(`${FILE_ENDPOINTS.UPLOAD}/${selectedCollection.name}`, {
                method: "POST",
                body: formData,
                headers: { Authorization: "Bearer " + getAccessToken() }
            })

            fetchFiles(selectedCollection.name)
        } catch (error) {
            console.error("Upload failed", error)
        }
    }

    const openFilePicker = () => {
        fileInputRef.current.click()
    }

    const handleVideo = (fileName) => setSelectedVideoFile(FILE_ENDPOINTS.STREAM + `/${selectedCollection.name}/${fileName}`)
    const handleImage = (fileName) => setSelectedImageFile(FILE_ENDPOINTS.STREAM + `/${selectedCollection.name}/${fileName}`)
    const handleAudio = (fileName) => setSelectedAudioFile(FILE_ENDPOINTS.STREAM + `/${selectedCollection.name}/${fileName}`)
    const closeVideo = () => setSelectedVideoFile(null)
    const closeImage = () => setSelectedImageFile(null)
    const closeAudio = () => setSelectedAudioFile(null)

    return (
        <div className="files-page">
            {!selectedCollection && (
                <>
                    <div className="collections-header">
                        <h2>Select a Collection</h2>
                        <input
                            type="text"
                            placeholder="Search collections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="collection-search"
                        />
                        <div className="view-toggle">
                            <button onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "active" : ""}>Grid</button>
                            <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "active" : ""}>List</button>
                        </div>
                        <button className="collection-add-btn" onClick={() => setPopupType("create-collection")}>Create collection</button>
                    </div>

                    {viewMode === "grid" ? (
                        <div className="collection-grid">
                            {filteredCollections.map((collection, index) => (
                                <div
                                    key={index}
                                    className="collection-card"
                                    onClick={() => handleCollectionSelect(collection)}
                                >
                                    <div className="collection-icon">📁</div>
                                    <div className="collection-name">{collection.name}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ul className="collection-list">
                            {filteredCollections.map((collection, index) => (
                                <li key={index} onClick={() => handleCollectionSelect(collection)}>
                                    📁 {collection.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {selectedCollection && (
                <div className="files-list">
                    <div className="files-list-header">
                        <button onClick={() => setSelectedCollection(null)} className="back-button">← Back</button>
                        <h2>{selectedCollection.name}</h2>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden-input" />
                        <div className="files-list-right-div">
                            <button onClick={openFilePicker} className="file-button">Upload</button>
                            {(currentUserRole === "OWNER") && (
                                <div className="cog-wrapper">
                                    {selectedCollection && (
                                        <FaCog onClick={() => setDisplayPopout(!displayPopout)}/>
                                    )}

                                    {displayPopout && (
                                        <div id="file-popout-container" className="file-popout-container">
                                            <button onClick={() => { 
                                                    setPopupType("user-management") 
                                                    setDisplayPopout(false) 
                                                }}>
                                                Manage Users
                                            </button>
                                            <button onClick={() => {
                                                deleteCollection()
                                                setDisplayPopout(false)
                                            }}>
                                            Delete Collection
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
                                        <button onClick={() => handleDelete(file)} className="file-delete-btn">Delete</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    
                    {selectedVideoFile && <VideoPlayer videoUrl={selectedVideoFile} onClose={closeVideo} />}
                    {selectedImageFile && <ImageViewer imageUrl={selectedImageFile} onClose={closeImage} />}
                    {selectedAudioFile && <MusicPlayer audioUrl={selectedAudioFile} onClose={closeAudio} />}
                </div>
            )}

            {/* Create collection popup */}
            {popupType === "create-collection" && (
                <InputPopup
                    label={"Create a new collection"}
                    inputs={[
                        { name: "collectionName", labelValue: "Collection name" }
                    ]}
                    onSubmit={(values) => createCollection(values.collectionName)}
                    onClose={() => setPopupType(null)}
                />
            )}

            {/* User management popup */}
            {popupType === "user-management" && (
                <UserManagementPopup
                    onClose={() => setPopupType(null)}
                    loadUsers={() => loadUsers()}
                    addUser={(user) => addUser(user)}
                    deleteUser={(user) => deleteUser(user)}
                    getAllRoles={() => getAllRoles()}
                    updateUserRole={(username, newRole) => updateUserRole(username, newRole)}
                />
            )}
        </div>
    )
}

export default FilesList
