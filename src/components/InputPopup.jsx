import { useState, useEffect } from "react"
import "./css/InputPopup.css"

const InputPopup = ({ label, inputs, onSubmit, onClose }) => {
    const [formValues, setFormValues] = useState({})

    useEffect(() => {
        setFormValues(
            inputs.reduce((acc, input) => {
                acc[input.name] = input.defaultValue || ""
                return acc
            }, {})
        )
    }, [inputs])

    const handleChange = (name, value) => {
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        onSubmit(formValues)
        onClose()
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>{label}</h3>
                {inputs.map((input, index) => (
                    <div key={index}>
                        {input.labelValue && <label>{input.labelValue}</label>}
                        <input
                            type={input.type || "text"}
                            placeholder={input.placeholder || ""}
                            value={formValues[input.name] || ""}
                            onChange={(e) => handleChange(input.name, e.target.value)}
                        />
                    </div>
                ))}
                <button className="submit-button" onClick={handleSubmit}>
                    Save
                </button>
                <button className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default InputPopup
