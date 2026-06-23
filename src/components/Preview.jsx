import { useIDEStore } from '../store';
import { Eye } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Preview() {
  const { files } = useIDEStore();
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const htmlFile = files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.language === 'javascript');

    if (!htmlFile) return;

    let html = htmlFile.content;
    
    // Inject CSS
    if (cssFile && !html.includes('<style>')) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }
    
    // Inject JS
    if (jsFile && !html.includes('<script>')) {
      html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }

    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();
  }, [files]);

  return (
    <div className="w-full h-full flex flex-col bg-sk-darker">
      <div className="bg-sk-dark border-b border-slate-700 px-4 py-3 flex items-center gap-2">
        <Eye size={18} />
        <span className="font-semibold">Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-0"
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
