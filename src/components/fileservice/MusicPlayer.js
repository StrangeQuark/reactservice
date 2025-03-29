// Integration file: Files

import { useRef } from "react"
import "./css/MusicPlayer.css"

const MusicPlayer = ({ audioUrl, onClose }) => {
    const audioRef = useRef(null)

    const getMimeType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        const mimeTypes = {
            mp3: "audio/mpeg",
            wav: "audio/wav",
            flac: "audio/flac",
            aac: "audio/aac",
            m4a: "audio/mp4",
            ogg: "audio/ogg",
        };
        return mimeTypes[extension] || "audio/mpeg"
    };    

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <div>
                    <audio controls>
                        <source src={audioUrl} type={getMimeType(audioUrl)} />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            </div>
        </div>
    )
}

export default MusicPlayer
