// Integration file: Telemetry

import { TELEMETRY_ENDPOINTS } from "../config"
import { authenticateServiceAccount } from "./AuthUtility"

export const sendTelemetryEvent = async (eventType, metadata) => {
    try {
        const requestBody = {
            "serviceName": "reactservice",
            "eventType": eventType,
            "timestamp": new Date().toISOString(),
            "metadata": metadata
        }

        await fetch(TELEMETRY_ENDPOINTS.CREATE_EVENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + await authenticateServiceAccount(),// Integration line: Auth
            },
            body: JSON.stringify(requestBody),
        })
    } catch (error) {
        console.error(error)
    }
}