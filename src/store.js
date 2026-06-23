import { create } from 'zustand';

export const useIDEStore = create((set) => ({
  files: [
    { id: '1', name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Welcome to SK Coder</h1>\n</body>\n</html>' },
    { id: '2', name: 'style.css', language: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n  background: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}' },
    { id: '3', name: 'script.js', language: 'javascript', content: 'console.log("SK Coder is ready!");\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Developer"));' },
  ],
  currentFileId: '1',
  activeTab: 'editor',
  theme: 'dark',
  fontSize: 14,
  terminalOutput: [],
  
  setCurrentFile: (id) => set({ currentFileId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  setFontSize: (size) => set({ fontSize: size }),
  
  updateFileContent: (id, content) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, content } : f)
  })),
  
  addFile: (name, language) => set((state) => ({
    files: [...state.files, {
      id: Date.now().toString(),
      name,
      language,
      content: ''
    }]
  })),
  
  deleteFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id),
    currentFileId: state.currentFileId === id ? state.files[0]?.id : state.currentFileId
  })),
  
  addTerminalOutput: (output) => set((state) => ({
    terminalOutput: [...state.terminalOutput, output]
  })),
  
  clearTerminal: () => set({ terminalOutput: [] }),
}));
