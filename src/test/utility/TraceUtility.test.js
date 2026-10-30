import { afterEach, describe, expect, it, vi } from "vitest"
import { reportTraceFailure, traceFetch } from "../../utility/TraceUtility"

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe("request trace diagnostics", () => {
    it("returns the original response and logs only a failed request's trace ID", async () => {
        const response = { status: 500, headers: new Headers({ "X-Trace-ID": "test-trace" }) }
        const fetchMock = vi.fn().mockResolvedValue(response)
        vi.stubGlobal("fetch", fetchMock)
        const error = vi.spyOn(console, "error").mockImplementation(() => {})
        expect(await traceFetch("/api/test")).toBe(response)
        expect(fetchMock).toHaveBeenCalledWith("/api/test")
        expect(error).toHaveBeenCalledWith("Request failed", { status: 500, traceId: "test-trace" })
    })

    it("leaves successful, untraced, and network error behavior unchanged", async () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {})
        reportTraceFailure({ status: 200, headers: new Headers({ "X-Trace-ID": "test-trace" }) })
        reportTraceFailure({ status: 400, headers: new Headers() })
        expect(error).not.toHaveBeenCalled()
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")))
        await expect(traceFetch("/api/test")).rejects.toThrow("Network error")
    })

    it("also reads trace IDs from XMLHttpRequest failures", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {})
        reportTraceFailure({ status: 403, getResponseHeader: () => "xhr-trace" })
        expect(error).toHaveBeenCalledWith("Request failed", { status: 403, traceId: "xhr-trace" })
    })
})
