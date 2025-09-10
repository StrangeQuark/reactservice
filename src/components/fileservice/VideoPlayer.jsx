// Integration file: File

import "./css/VideoPlayer.css"
import { useRef, useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"

const VideoPlayer = ({ videoUrl, onClose, token }) => {
    const videoRef = useRef(null)
    const [blobUrl, setBlobUrl] = useState(null)
    const { getAccessToken } = useAuth()

    useEffect(() => {
        const loadVideo = async () => {
            const response = await fetch(videoUrl, {
                headers: {
                    Authorization: "Bearer " + getAccessToken()
                }
            })
            const blob = await response.blob()
            setBlobUrl(URL.createObjectURL(blob))
        }

        loadVideo()

        return () => {
            if (blobUrl) 
                URL.revokeObjectURL(blobUrl)
        }
    }, [videoUrl, token])

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="video-close-btn" onClick={onClose}>X</button>
                <div>
                    <video data-testid="video-player" ref={videoRef} className="video-player" controls src={blobUrl}>
                        Your browser does not support the video tag
                    </video>
                </div>
            </div>
        </div>
    )
}


export default VideoPlayer
