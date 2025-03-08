import { useRef } from "react"
import "./css/StreamPlayer.css"

const StreamPlayer = ({ streamUrl, onClose }) => {
    const videoRef = useRef(null)

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <div>
                <video ref={videoRef} className="video-player" controls>
                    <source src={streamUrl} type="video/mp4" />
                    Your browser does not support the video tag
                </video>
                </div>
            </div>
        </div>
    )
}

export default StreamPlayer
