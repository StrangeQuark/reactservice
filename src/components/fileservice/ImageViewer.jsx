// Integration file: File

import "./css/ImageViewer.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext" // Integration line: Auth

const ImageViewer = ({ imageUrl, onClose, token }) => {
    const [blobUrl, setBlobUrl] = useState(null)
    const { getAccessToken } = useAuth() // Integration line: Auth

    useEffect(() => {
        const loadImage = async () => {
            const response = await fetch(imageUrl, {
                headers: {
                    Authorization: "Bearer " + getAccessToken() // Integration line: Auth
                }
            })
            const blob = await response.blob()
            setBlobUrl(URL.createObjectURL(blob))
        }

        loadImage()

        return () => {
            if (blobUrl) 
                URL.revokeObjectURL(blobUrl)
        }
    }, [imageUrl, token])

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <div>
                    <img data-testid="image" src={blobUrl} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default ImageViewer
