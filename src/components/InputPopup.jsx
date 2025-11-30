import { useState, useEffect } from "react"
import "./css/InputPopup.css"
import { sendTelemetryEvent } from "../utility/TelemetryUtility" // Integration line: Telemetry

const InputPopup = ({ label, inputs, onSubmit, onClose }) => {
    const [formValues, setFormValues] = useState({})

    useEffect(() => {
        sendTelemetryEvent("react-input-popup-opened", {"label": label}) // Integration line: Telemetry
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
        sendTelemetryEvent("react-input-popup-submitted", {"label": label}) // Integration line: Telemetry
        onSubmit(formValues)
        onClose()
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h1>{label}</h1>
                <div className="input-div">
                    {inputs.map((input, index) => {
                        const inputId = `input-${input.name}-${index}`

                        return (
                            <div key={index} className="input-row">
                                {input.labelValue && <label htmlFor={inputId}>{input.labelValue}</label>}
                                <input
                                    id={inputId}
                                    type={input.type || "text"}
                                    placeholder={input.placeholder || ""}
                                    value={formValues[input.name] || ""}
                                    onChange={(e) => handleChange(input.name, e.target.value)}
                                    className={input.className}
                                />
                            </div>
                        )
                    })}
                    </div>
                <div>
                    <button className="submit-button" onClick={handleSubmit}>
                        Save
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InputPopup
