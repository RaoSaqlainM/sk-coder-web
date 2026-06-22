type PistonResult = {
  output: string
  stderr: string
  exitCode: number
  error?: string
}

type PistonResponse = {
  run: {
    stdout: string
    stderr: string
    code: number
    signal: string | null
  }
  compile?: {
    stdout: string
    stderr: string
    code: number
  }
}

const LANG_MAP: Record<string, { language: string; version: string }> = {
  cpp: { language: "c++", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  kotlin: { language: "kotlin", version: "1.4.31" },
  rust: { language: "rust", version: "1.50.0" },
  go: { language: "go", version: "1.16.2" },
  ruby: { language: "ruby", version: "3.0.1" },
  php: { language: "php", version: "8.0.2" },
  swift: { language: "swift", version: "5.3.3" },
  r: { language: "r", version: "4.1.1" },
  bash: { language: "bash", version: "5.1.0" },
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
}

export function getAvailableLanguages() {
  return Object.keys(LANG_MAP)
}

export async function runWithPiston(
  code: string,
  language: string,
  serverUrl = "https://emkc.org/api/v2/piston",
  stdin = ""
): Promise<PistonResult> {
  const lang = LANG_MAP[language]
  if (!lang) {
    return {
      output: "",
      stderr: `Language "${language}" not supported by Piston runner.`,
      exitCode: 1,
      error: "unsupported_language",
    }
  }

  const fileExtMap: Record<string, string> = {
    "c++": "cpp", c: "c", java: "Main.java", kotlin: "Main.kt",
    rust: "main.rs", go: "main.go", ruby: "main.rb", php: "main.php",
    swift: "main.swift", r: "main.r", bash: "main.sh",
    python: "main.py", javascript: "main.js", typescript: "main.ts",
  }
  const filename = fileExtMap[lang.language] || "main.txt"

  try {
    const res = await fetch(`${serverUrl}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ name: filename, content: code }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 10000,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return { output: "", stderr: `Piston API error: ${res.status} — ${text}`, exitCode: 1 }
    }

    const data: PistonResponse = await res.json()

    const compileErr = data.compile?.stderr || ""
    const runOut = data.run?.stdout || ""
    const runErr = data.run?.stderr || ""
    const combined = [compileErr, runErr].filter(Boolean).join("\n")

    return {
      output: runOut,
      stderr: combined,
      exitCode: data.run?.code ?? 0,
    }
  } catch (e) {
    return {
      output: "",
      stderr: `Network error: ${String(e)}`,
      exitCode: 1,
      error: "network_error",
    }
  }
}

export function detectLanguageFromExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  const extMap: Record<string, string> = {
    cpp: "cpp", cc: "cpp", cxx: "cpp", c: "c", h: "c",
    java: "java", kt: "kotlin", rs: "rust", go: "go",
    rb: "ruby", php: "php", swift: "swift", r: "r",
    sh: "bash", bash: "bash", py: "python",
    js: "javascript", ts: "typescript",
  }
  return extMap[ext] || ""
}
