import { useIDEStore } from '../store';
import { File, Plus, Trash2, FolderOpen } from 'lucide-react';
import { useState } from 'react';

export function FileManager() {
  const { files, currentFileId, setCurrentFile, addFile, deleteFile } = useIDEStore();
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);

  const handleAddFile = () => {
    if (newFileName.trim()) {
      const ext = newFileName.split('.').pop();
      const langMap = { js: 'javascript', css: 'css', html: 'html', py: 'python', json: 'json' };
      addFile(newFileName, langMap[ext] || 'text');
      setNewFileName('');
      setShowNewFile(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-sk-darker">
      <div className="bg-sk-dark border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen size={18} />
          <span className="font-semibold">Files</span>
        </div>
        <button
          onClick={() => setShowNewFile(!showNewFile)}
          className="p-1 hover:bg-slate-700 rounded transition"
        >
          <Plus size={18} />
        </button>
      </div>

      {showNewFile && (
        <div className="bg-sk-dark border-b border-slate-700 p-3 flex gap-2">
          <input
            type="text"
            placeholder="filename.js"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFile()}
            className="flex-1 bg-slate-800 text-slate-100 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {files.map(file => (
          <div
            key={file.id}
            onClick={() => setCurrentFile(file.id)}
            className={`flex items-center justify-between px-4 py-2 cursor-pointer transition ${
              currentFileId === file.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <File size={16} />
              <span className="text-sm truncate">{file.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFile(file.id);
              }}
              className="p-1 hover:bg-red-600 rounded transition opacity-0 hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
