// Integration file: File

import "./css/ImageViewer.css"

const ImageViewer = ({ imageUrl, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <div>
                    <img data-testid="image" src={imageUrl} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default ImageViewer
