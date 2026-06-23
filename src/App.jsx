import { useIDEStore } from './store';
import { CodeEditor } from './components/CodeEditor';
import { FileManager } from './components/FileManager';
import { Terminal } from './components/Terminal';
import { Preview } from './components/Preview';
import { Settings } from './components/Settings';
import { Code2, Files, Terminal as TerminalIcon, Eye, Settings as SettingsIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const { activeTab, setActiveTab } = useIDEStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-sk-darker">
        {/* Mobile Header */}
        <div className="bg-sk-dark border-b border-slate-700 px-4 py-3">
          <h1 className="text-xl font-bold text-blue-400">SK Coder</h1>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'editor' && <CodeEditor />}
          {activeTab === 'files' && <FileManager />}
          {activeTab === 'terminal' && <Terminal />}
          {activeTab === 'preview' && <Preview />}
          {activeTab === 'settings' && <Settings />}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="bg-sk-dark border-t border-slate-700 flex">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition ${
              activeTab === 'editor'
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Code2 size={20} />
            <span className="text-xs mt-1">Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition ${
              activeTab === 'files'
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Files size={20} />
            <span className="text-xs mt-1">Files</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition ${
              activeTab === 'terminal'
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <TerminalIcon size={20} />
            <span className="text-xs mt-1">Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition ${
              activeTab === 'preview'
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Eye size={20} />
            <span className="text-xs mt-1">Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition ${
              activeTab === 'settings'
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <SettingsIcon size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex flex-col h-screen bg-sk-darker">
      {/* Desktop Header */}
      <div className="bg-sk-dark border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-400">SK Coder</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SettingsIcon size={18} />
            Settings
          </button>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Left: File Manager */}
        <div className="w-64 bg-sk-dark rounded-lg border border-slate-700 overflow-hidden">
          <FileManager />
        </div>

        {/* Center: Editor */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Editor */}
          <div className="flex-1 bg-sk-dark rounded-lg border border-slate-700 overflow-hidden">
            <CodeEditor />
          </div>

          {/* Terminal */}
          <div className="h-48 bg-sk-dark rounded-lg border border-slate-700 overflow-hidden">
            <Terminal />
          </div>
        </div>

        {/* Right: Preview & Settings */}
        <div className="w-96 bg-sk-dark rounded-lg border border-slate-700 overflow-hidden">
          {activeTab === 'settings' ? <Settings /> : <Preview />}
        </div>
      </div>
    </div>
  );
}

export default App;
