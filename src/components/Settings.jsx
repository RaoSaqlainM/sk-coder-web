import { useIDEStore } from '../store';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';

export function Settings() {
  const { theme, setTheme, fontSize, setFontSize } = useIDEStore();

  return (
    <div className="w-full h-full flex flex-col bg-sk-darker">
      <div className="bg-sk-dark border-b border-slate-700 px-4 py-3 flex items-center gap-2">
        <SettingsIcon size={18} />
        <span className="font-semibold">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm font-semibold mb-3">Theme</label>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Moon size={18} />
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                theme === 'light'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sun size={18} />
              Light
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-semibold mb-3">Font Size: {fontSize}px</label>
          <input
            type="range"
            min="10"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>10px</span>
            <span>24px</span>
          </div>
        </div>

        {/* About */}
        <div className="border-t border-slate-700 pt-6">
          <h3 className="font-semibold mb-2">About SK Coder</h3>
          <p className="text-sm text-slate-400">
            SK Coder is a professional, mobile-first integrated development environment.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Version: 1.0.0
          </p>
          <p className="text-sm text-slate-400 mt-2">
            © 2024 SK Coder. All rights reserved.
          </p>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="border-t border-slate-700 pt-6">
          <h3 className="font-semibold mb-3">Keyboard Shortcuts</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Ctrl + S</span>
              <span className="text-slate-500">Save File</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl + N</span>
              <span className="text-slate-500">New File</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl + O</span>
              <span className="text-slate-500">Open File</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl + L</span>
              <span className="text-slate-500">Clear Terminal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
