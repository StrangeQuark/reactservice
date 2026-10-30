export function reportTraceFailure(response) {
    const status = response.status
    if(status < 400)
        return

    const traceId = response.headers?.get?.("X-Trace-ID")
        || response.getResponseHeader?.("X-Trace-ID")

    if(traceId)
        console.error("Request failed", { status, traceId })
}

export async function traceFetch(...args) {
    const response = await fetch(...args)
    reportTraceFailure(response)
    return response
}
