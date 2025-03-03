import "./ImageViewer.css"

const ImageViewer = ({ imageUrl, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <div>
                    <img src={imageUrl} />
                </div>
            </div>
        </div>
    )
}

export default ImageViewer
