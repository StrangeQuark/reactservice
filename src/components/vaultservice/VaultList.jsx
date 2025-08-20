// Integration file: Vault

import { useEffect, useState } from "react"
import "./css/VaultList.css"
import { VAULT_ENDPOINTS } from "../../config"
import { useAuth } from "../../context/AuthContext"
import InputPopup from "../InputPopup"
import { FaEye, FaTrash, FaRegClipboard } from "react-icons/fa";

const VaultList = () => {
    const { getAccessToken } = useAuth()

    const [services, setServices] = useState([])
    const [environments, setEnvironments] = useState([])
    const [variables, setVariables] = useState([]) // all variables from vaultservice
    const [filteredVariables, setFilteredVariables] = useState([]) // filtered via search
    const [selectedService, setSelectedService] = useState("")
    const [selectedEnvironment, setSelectedEnvironment] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [maskAll, setMaskAll] = useState(true)
    const [changesMade, setChangesMade] = useState(false)
    const [popupType, setPopupType] = useState(null)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const varsPerPage = 10

    useEffect(() => {
        fetchServices()
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredVariables(variables)
        } else {
            const regex = new RegExp(searchTerm, "i")
            setFilteredVariables(variables.filter(v => regex.test(v.key)))
        }
        setCurrentPage(1)
    }, [searchTerm, variables])

    const fetchServices = async () => {
        const response = await fetch(`${VAULT_ENDPOINTS.GET_ALL_SERVICES}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        const data = await response.json()
        setServices(data)
    }

    const fetchEnvironments = async (service) => {
        const response = await fetch(`${VAULT_ENDPOINTS.GET_ALL_ENVS_BY_SERVICE}/${service}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        const data = await response.json()
        setEnvironments(data)
    }

    const fetchVariables = async (service, environment) => {
        const response = await fetch(`${VAULT_ENDPOINTS.GET_VARS_BY_ENV}/${service}/${environment}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        const data = await response.json()
        // mask all initially
        const masked = data.map(v => ({ ...v, masked: true }))
        setVariables(masked)
        setFilteredVariables(masked)
        setMaskAll(true)
    }

    const createService = async (serviceName) => {
        const response = await fetch(`${VAULT_ENDPOINTS.CREATE_SERVICE}/${serviceName}`, {
            method: "POST",
            headers: { Authorization: "Bearer " + getAccessToken() }
        })

        if(!response.ok) {
            const message = await response.json()
            alert(message.errorMessage)
            return
        }

        fetchServices()
    }

    const createEnvironment = async (environmentName) => {
        const response = await fetch(`${VAULT_ENDPOINTS.CREATE_ENVIRONMENT}/${selectedService}/${environmentName}`, {
            method: "POST",
            headers: { Authorization: "Bearer " + getAccessToken() }
        })

        if(!response.ok) {
            const message = await response.json()
            alert(message.errorMessage)
            return
        }

        fetchEnvironments(selectedService)
    }

     const addVariable = async (key, value) => {
        let v = {key, value}

        const response = await fetch(`${VAULT_ENDPOINTS.ADD_VAR}/${selectedService}/${selectedEnvironment}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + getAccessToken() 
            },
            body: JSON.stringify(v)
        })

        if(!response.ok) {
            const message = await response.json()
            alert(message.errorMessage)
            return
        }

        fetchVariables(selectedService, selectedEnvironment)
    }

    const deleteVariable = async (variable) => {
        if(!confirm("Are you sure you want to delete variable: " + variable))
            return

        const response = await fetch(`${VAULT_ENDPOINTS.DELETE_VAR}/${selectedService}/${selectedEnvironment}/${variable}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + getAccessToken() }
        })

        if(!response.ok) {
            const message = await response.json()
            alert(message.errorMessage)
            return
        }
        
        fetchVariables(selectedService, selectedEnvironment)
    }

    const handleSave = async () => {
        const response = await fetch(`${VAULT_ENDPOINTS.UPDATE_VARS}/${selectedService}/${selectedEnvironment}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getAccessToken()
            },
            body: JSON.stringify(variables)
        })

        if(!response.ok) {
            const message = await response.json()
            alert(message.errorMessage)
            return
        }

        const data = await response.text()
        if(data !== "All variables updated successfully") {
            alert(data)
        }

        setChangesMade(false)
    }

    const toggleMaskAll = () => {
        const newMaskState = !maskAll
        setVariables(vars => vars.map(v => ({ ...v, masked: newMaskState })))
        setMaskAll(newMaskState)
    }

    const toggleMaskOne = (index) => {
        setVariables(vars => vars.map((v, i) => i === index ? { ...v, masked: !v.masked } : v))
    }

    const copyValue = (value) => {
        navigator.clipboard.writeText(value)
    }

    const handleChangeVar = (index, field, value) => {
        setVariables(vars => vars.map((v, i) => i === index ? { ...v, [field]: value } : v))
        setChangesMade(true)
    }

    // Pagination logic
    const indexOfLastVar = currentPage * varsPerPage
    const indexOfFirstVar = indexOfLastVar - varsPerPage
    const currentVars = filteredVariables.slice(indexOfFirstVar, indexOfLastVar)
    const totalPages = Math.ceil(filteredVariables.length / varsPerPage)

    return (
        <div className="vault-page">
            <div className="vault-header">
                <button className="add-btn" onClick={() => setPopupType("create-service")}>Create service</button>
                <select
                    value={selectedService}
                    onChange={(e) => {
                        if(e.target.value === "")
                            return

                        setSelectedService(e.target.value)
                        setSelectedEnvironment("")
                        fetchEnvironments(e.target.value)
                    }}
                >
                    <option value="">Select Service</option>
                    {services.map((svc, idx) => (
                        <option key={idx} value={svc}>{svc}</option>
                    ))}
                </select>

                <select
                    value={selectedEnvironment}
                    onChange={(e) => {
                        if(e.target.value === "")
                            return

                        setSelectedEnvironment(e.target.value)
                        fetchVariables(selectedService, e.target.value)
                    }}
                >
                    <option value="">Select Environment</option>
                    {environments.map((env, idx) => (
                        <option key={idx} value={env}>{env}</option>
                    ))}
                </select>

                {selectedService && (
                    <button className="add-btn" onClick={() => setPopupType("create-environment")}>Create environment</button>
                )}

                {selectedService && selectedEnvironment && (
                    <button className="add-btn" onClick={() => setPopupType("add-variable")}>Add Var</button>
                )}

                {changesMade && (
                    <button className="save-btn" onClick={handleSave}>Save</button>
                )}
            </div>

            {selectedService && selectedEnvironment && (
                <>
                    <div className="vault-controls">
                        <button onClick={toggleMaskAll}>{maskAll ? "Unmask All" : "Mask All"}</button>
                        <input
                            type="text"
                            placeholder="Search variables..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoComplete="off"
                            name="search-input"
                        />
                    </div>

                    <div className="vault-table">
                        {currentVars.map((v, index) => (
                            <div key={index} className="vault-row">
                                <input
                                    type="text"
                                    value={v.key}
                                    disabled
                                />
                                <input
                                    type="text"
                                    value={v.value}
                                    onChange={(e) =>
                                        handleChangeVar(indexOfFirstVar + index, "value", e.target.value)
                                    }
                                    className={v.masked ? "masked-input" : ""}
                                    placeholder="value"
                                    autoComplete="off"
                                    name={`vault-var-${indexOfFirstVar + index}`}
                                />
                                <FaEye className="row-icon" onClick={() => toggleMaskOne(indexOfFirstVar + index)} />
                                <FaRegClipboard className="row-icon" onClick={() => copyValue(v.value)} />
                                <FaTrash className="row-icon" onClick={() => deleteVariable(v.key)} />
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >←</button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                className={currentPage === idx + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >→</button>
                    </div>
                </>
            )}

            {/* Create service popup */}
            {popupType === "create-service" && (
                <InputPopup
                    label="Create new service"
                    inputs={[
                        { name: "serviceName", labelValue: "Service name" }
                    ]}
                    onSubmit={(values) => createService(values.serviceName)}
                    onClose={() => setPopupType(null)}
                />
            )}

            {/* Create environment popup */}
            {popupType === "create-environment" && (
                <InputPopup
                    label={`Create new environment for service: ${selectedService}`}
                    inputs={[
                        { name: "environmentName", labelValue: "Environment name" }
                    ]}
                    onSubmit={(values) => createEnvironment(values.environmentName)}
                    onClose={() => setPopupType(null)}
                />
            )}

            {/* Add variable popup */}
            {popupType === "add-variable" && (
                <InputPopup
                    label={`Add a new variable for service/environment: ${selectedService}/${selectedEnvironment}`}
                    inputs={[
                        { name: "key", labelValue: "Key" },
                        { name: "value", labelValue: "Value"}
                    ]}
                    onSubmit={(values) => addVariable(values.key, values.value)}
                    onClose={() => setPopupType(null)}
                />
            )}
        </div>
    )
}

export default VaultList
