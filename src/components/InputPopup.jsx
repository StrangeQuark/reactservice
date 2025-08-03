import { useState } from "react"
import "./css/InputPopup.css"

const InputPopup = ({ label, defaultValue, onSubmit, onClose }) => {
    const [inputValue, setInputValue] = useState(defaultValue)

    const handleSubmit = () => {
        onSubmit(inputValue)
        onClose()
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Edit {label}</h3>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="submit-button" onClick={handleSubmit}>Save</button>
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default InputPopup
