import { useIDEStore } from '../store';
import { useEffect, useRef } from 'react';

export function CodeEditor() {
  const { files, currentFileId, updateFileContent, fontSize } = useIDEStore();
  const editorRef = useRef(null);
  const currentFile = files.find(f => f.id === currentFileId);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleInput = (e) => {
      updateFileContent(currentFileId, e.target.value);
    };
    
    editorRef.current.addEventListener('input', handleInput);
    return () => editorRef.current?.removeEventListener('input', handleInput);
  }, [currentFileId, updateFileContent]);

  if (!currentFile) return null;

  return (
    <div className="w-full h-full flex flex-col bg-sk-darker">
      <div className="bg-sk-dark border-b border-slate-700 px-4 py-2">
        <p className="text-sm text-slate-400">{currentFile.name}</p>
      </div>
      <textarea
        ref={editorRef}
        value={currentFile.content}
        className="flex-1 bg-sk-darker text-slate-100 p-4 font-mono resize-none focus:outline-none"
        style={{ fontSize: `${fontSize}px` }}
        spellCheck="false"
      />
    </div>
  );
}
