// Integration file: Vault

import { useEffect, useState } from "react"
import "./css/VaultList.css"
import { VAULT_ENDPOINTS } from "../../config"
import { useAuth } from "../../context/AuthContext"

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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const varsPerPage = 5

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
        // shell for fetch
        const response = await fetch(`${VAULT_ENDPOINTS.GET_ALL_SERVICES}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        const data = await response.json()
        setServices(data)
    }

    const fetchEnvironments = async (service) => {
        // shell for fetch
        const response = await fetch(`${VAULT_ENDPOINTS.GET_ALL_ENVS_BY_SERVICE}/${service}`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        const data = await response.json()
        setEnvironments(data)
    }

    const fetchVariables = async (service, environment) => {
        // shell for fetch
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

    const deleteVariable = async (service, environment, variable) => {
        // shell for delete
        await fetch(`${VAULT_ENDPOINTS.DELETE_VAR}/${service}/${environment}/${variable}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + getAccessToken() }
        })
        setVariables(prev => prev.filter(v => v.key !== key))
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

    const handleAddVar = () => {
        setVariables(prev => [...prev, { key: "", value: "", masked: true, isNew: true }])
        setChangesMade(true)
    }

    const handleChangeVar = (index, field, value) => {
        setVariables(vars => vars.map((v, i) => i === index ? { ...v, [field]: value } : v))
        setChangesMade(true)
    }

    const handleSave = async () => {
        // shell for save
        // await fetch(`${VAULT_ENDPOINTS.GET_ALL}/${collectionName}`, {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: "Bearer " + getAccessToken()
        //     },
        //     body: JSON.stringify(variables)
        // })
        setChangesMade(false)
    }

    // Pagination logic
    const indexOfLastVar = currentPage * varsPerPage
    const indexOfFirstVar = indexOfLastVar - varsPerPage
    const currentVars = filteredVariables.slice(indexOfFirstVar, indexOfLastVar)
    const totalPages = Math.ceil(filteredVariables.length / varsPerPage)

    return (
        <div className="vault-page">
            <div className="vault-header">
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
                        setSelectedEnvironment(e.target.value)
                        fetchVariables(selectedService, e.target.value)
                    }}
                >
                    <option value="">Select Environment</option>
                    {environments.map((env, idx) => (
                        <option key={idx} value={env}>{env}</option>
                    ))}
                </select>

                {changesMade && (
                    <button className="save-btn" onClick={handleSave}>Save</button>
                )}
                <button className="add-btn" onClick={handleAddVar}>Add Var</button>
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
                        />
                    </div>

                    <div className="vault-table">
                        {currentVars.map((v, index) => (
                            <div key={index} className="vault-row">
                                <input
                                    type="text"
                                    value={v.key}
                                    onChange={(e) => handleChangeVar(indexOfFirstVar + index, "key", e.target.value)}
                                    placeholder="key"
                                />
                                <input
                                    type={v.masked ? "password" : "text"}
                                    value={v.value}
                                    onChange={(e) => handleChangeVar(indexOfFirstVar + index, "value", e.target.value)}
                                    placeholder="value"
                                />
                                <button onClick={() => toggleMaskOne(indexOfFirstVar + index)}>U</button>
                                <button onClick={() => copyValue(v.value)}>C</button>
                                <button onClick={() => deleteVariable(v.key)}>D</button>
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
        </div>
    )
}

export default VaultList
