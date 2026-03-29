// Integration file: Telemetry

import { TELEMETRY_ENDPOINTS } from "../config"
import { authenticateServiceAccount } from "./AuthUtility"

export const sendTelemetryEvent = async (eventType, metadata) => {
    const requestBody = {
        "serviceName": "reactservice",
        "eventType": eventType,
        "timestamp": new Date().toISOString(),
        "metadata": metadata
    }

    const token = await authenticateServiceAccount()

    fetch(TELEMETRY_ENDPOINTS.CREATE_EVENT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestBody)
    }).catch(console.error)
}