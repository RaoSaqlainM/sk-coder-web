import { useState } from "react"
import { useIDEStore } from "@/store/ideStore"
import { exportToZip, downloadBlob } from "@/lib/importProject"
import { buildPreview } from "@/lib/previewBuilder"
import { runJavaScript } from "@/lib/jsRunner"
import { runWithPiston, detectLanguageFromExtension } from "@/lib/pistonRunner"
import { generateExpoZip } from "@/lib/expoZip"
import { toast } from "sonner"

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<{
      runPythonAsync: (code: string) => Promise<unknown>
      globals: { get: (k: string) => unknown }
    }>
    _pyodide?: Awaited<ReturnType<NonNullable<Window["loadPyodide"]>>>
  }
}

let _pyodideReady = false
let _pyodideLoading = false

async function ensurePyodide(): Promise<boolean> {
  if (_pyodideReady && window._pyodide) return true
  if (_pyodideLoading) return false
  if (!window.loadPyodide) {
    _pyodideLoading = true
    return new Promise((resolve) => {
      const s = document.createElement("script")
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js"
      s.onload = async () => {
        try {
          window._pyodide = await window.loadPyodide!({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" })
          _pyodideReady = true
          _pyodideLoading = false
          resolve(true)
        } catch { _pyodideLoading = false; resolve(false) }
      }
      s.onerror = () => { _pyodideLoading = false; resolve(false) }
      document.head.appendChild(s)
    })
  }
  return false
}

async function runPythonCode(code: string): Promise<{ output: string; error: string }> {
  const ready = await ensurePyodide()
  if (!ready) return { output: "", error: "Python is still loading, please wait..." }
  try {
    const py = window._pyodide!
    const wrapped = `
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
sys.stderr = _buf
try:
${code.split("\n").map((l) => "    " + l).join("\n")}
except Exception as e:
    print(f"Error: {e}")
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
_buf.getvalue()
`
    const result = await py.runPythonAsync(wrapped)
    return { output: String(result || ""), error: "" }
  } catch (e) {
    return { output: "", error: String(e) }
  }
}

export default function TopBar() {
  const {
    isRunning, setIsRunning, fileTree, openTabs, activeTabId,
    addTerminalLine, clearTerminal, setActivePanel, setShowSettings, getActiveFile,
    setPreviewContent, refreshPreview,
  } = useIDEStore()
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  const activeFile = getActiveFile()

  async function handleRun() {
    if (isRunning) {
      setIsRunning(false)
      addTerminalLine({ type: "info", content: "Execution stopped." })
      return
    }

    if (!activeFile) {
      toast.error("Open a file first")
      return
    }

    const ext = activeFile.name.split(".").pop()?.toLowerCase() || ""

    if (["html", "htm"].includes(ext)) {
      const html = buildPreview(fileTree, activeFile.path)
      setPreviewContent(html)
      refreshPreview()
      setActivePanel("preview")
      toast.success("Preview updated")
      return
    }

    if (["js", "jsx"].includes(ext)) {
      setActivePanel("terminal")
      clearTerminal()
      addTerminalLine({ type: "info", content: `Running ${activeFile.name}...` })
      setIsRunning(true)
      try {
        const result = runJavaScript(activeFile.content || "")
        for (const line of result.output) addTerminalLine({ type: "output", content: line })
        if (result.error) addTerminalLine({ type: "error", content: result.error })
        if (result.output.length === 0 && !result.error) addTerminalLine({ type: "info", content: "(no output)" })
        addTerminalLine({ type: "success", content: "Done." })
      } finally {
        setIsRunning(false)
      }
      return
    }

    if (ext === "py") {
      setActivePanel("terminal")
      clearTerminal()
      addTerminalLine({ type: "info", content: `Running ${activeFile.name} with Python...` })
      setIsRunning(true)
      try {
        const { output, error } = await runPythonCode(activeFile.content || "")
        if (output) {
          const lines = output.split("\n").filter((l) => l !== "")
          for (const line of lines) addTerminalLine({ type: "output", content: line })
        }
        if (error) addTerminalLine({ type: "error", content: error })
        if (!output && !error) addTerminalLine({ type: "info", content: "(no output)" })
        addTerminalLine({ type: "success", content: "Done." })
      } finally {
        setIsRunning(false)
      }
      return
    }

    if (["ts", "tsx"].includes(ext)) {
      setActivePanel("terminal")
      clearTerminal()
      addTerminalLine({ type: "info", content: `Running ${activeFile.name} via TypeScript...` })
      setIsRunning(true)
      try {
        const res = await runWithPiston(activeFile.content || "", "typescript")
        if (res.output) addTerminalLine({ type: "output", content: res.output })
        if (res.stderr) addTerminalLine({ type: "error", content: res.stderr })
        if (!res.output && !res.stderr) addTerminalLine({ type: "info", content: "(no output)" })
        addTerminalLine({ type: "success", content: "Done." })
      } finally {
        setIsRunning(false)
      }
      return
    }

    const lang = detectLanguageFromExtension(activeFile.name)
    if (lang && ["cpp", "c", "java", "rust", "go", "kotlin", "rb", "php", "swift"].some((l) => lang === l || ext === l)) {
      setActivePanel("terminal")
      clearTerminal()
      addTerminalLine({ type: "info", content: `Compiling & running ${activeFile.name}...` })
      setIsRunning(true)
      try {
        const res = await runWithPiston(activeFile.content || "", lang)
        if (res.output) addTerminalLine({ type: "output", content: res.output })
        if (res.stderr) addTerminalLine({ type: "error", content: res.stderr })
        if (!res.output && !res.stderr) addTerminalLine({ type: "info", content: "(no output)" })
        addTerminalLine({ type: "success", content: "Done." })
      } finally {
        setIsRunning(false)
      }
      return
    }

    toast.info(`No runner for .${ext} — try the terminal`)
  }

  async function handleExportProject() {
    if (fileTree.length === 0) { toast.error("No files to export"); return }
    try {
      const blob = await exportToZip(fileTree)
      downloadBlob(blob, "sk-coder-project.zip")
      toast.success("Project exported as ZIP")
    } catch {
      toast.error("Export failed")
    }
    setShowDownloadMenu(false)
  }

  async function handleExportExpo() {
    try {
      toast.info("Generating React Native / Expo project...")
      const blob = await generateExpoZip()
      downloadBlob(blob, "sk-coder-mobile-expo.zip")
      toast.success("Expo source ZIP downloaded — see README inside for build instructions")
    } catch {
      toast.error("Failed to generate Expo ZIP")
    }
    setShowDownloadMenu(false)
  }

  return (
    <div className="ide-topbar">
      <div className="topbar-logo">
        <div className="topbar-logo-icon">SK</div>
        <span>Coder</span>
      </div>

      <div className="topbar-divider" />

      {activeFile && (
        <span className="topbar-breadcrumb" style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {activeFile.name}
        </span>
      )}

      <div className="topbar-actions">
        <button
          className={`topbar-run-btn ${isRunning ? "running" : ""}`}
          onClick={handleRun}
          title={isRunning ? "Stop execution" : `Run ${activeFile?.name || "file"}`}
        >
          {isRunning ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="2" width="3" height="8" rx="1"/>
              <rect x="7" y="2" width="3" height="8" rx="1"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
              <polygon points="2,1 11,6 2,11"/>
            </svg>
          )}
          {isRunning ? "Stop" : "Run"}
        </button>

        <div className="topbar-divider" />

        <div style={{ position: "relative" }}>
          <button
            className="btn-icon"
            onClick={() => setShowDownloadMenu((v) => !v)}
            title="Download / Export"
            style={{ position: "relative" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>

          {showDownloadMenu && (
            <div
              style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 500,
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)",
                minWidth: 220, padding: "0.25rem", animation: "fade-in 0.1s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="context-menu-item"
                onClick={handleExportProject}
                style={{ width: "100%" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Export Project ZIP (Web)
              </button>
              <button
                className="context-menu-item"
                onClick={handleExportExpo}
                style={{ width: "100%" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/></svg>
                Export React Native / Expo APK Source
              </button>
              <div className="context-menu-divider" />
              <div style={{ padding: "0.25rem 0.6rem", fontSize: 10, color: "var(--text-muted)" }}>
                Expo ZIP includes README with APK build guide
              </div>
            </div>
          )}
        </div>

        <button className="btn-icon" onClick={() => setShowSettings(true)} title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
