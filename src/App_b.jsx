// src/App.jsx
import { createSignal, onMount, onCleanup } from 'solid-js';
import { decodePayload } from './core/decoder';
import { renderMermaid } from './engines/mermaid';
import { renderVega } from './engines/vega';

function App() {
  const [diagramSource, setDiagramSource] = createSignal('');
  const [error, setError] = createSignal('');
  let containerRef;

  const handleHashChange = async () => {
    // Reset
    setError('');
    setDiagramSource('');
    if (containerRef) containerRef.innerHTML = '';

    let hash = window.location.hash.slice(1); 
    if (!hash || hash === '/') return; 

    // Normalisierung: Führenden Slash entfernen, falls vorhanden
    if (hash.startsWith('/')) hash = hash.slice(1);

    // --- FALL 1: Direct-Image Modus ---
    if (hash.startsWith('data:image/')) {
      if (containerRef) {
        containerRef.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <p style="font-size: 0.8rem; color: #666;">Direkt-Bild Modus (Base64)</p>
            <img src="${hash}" alt="Injected Content" style="max-width: 100%; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);" />
          </div>`;
      }
      return;
    }

    // --- FALL 2: Kroki-Modus ---
    const parts = hash.split('/').filter(Boolean);
    if (parts.length < 3) {
      setError("Format-Fehler: Nutze #/engine/format/payload oder #data:image/...");
      return;
    }

    const [engine, format, payload] = parts;

    try {
      const decodedCode = decodePayload(payload);
      setDiagramSource(decodedCode);

      if (engine === 'mermaid') {
         await renderMermaid(decodedCode, containerRef);
      } else if (engine === 'vegalite' || engine === 'vega') {
         await renderVega(decodedCode, containerRef);
      } else {
         setError(`Engine '${engine}' ist noch nicht implementiert.`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  onMount(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  });

  onCleanup(() => window.removeEventListener('hashchange', handleHashChange));

  return (
    <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      <header style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 2.5rem; margin-bottom: 0;">🥷 Zero-Outbound Kroki</h1>
        <p style="color: #666; font-style: italic;">„Leere ist das Fundament aller Dinge.“</p>
      </header>
      
      {error() && (
        <div style="background: #fff5f5; color: #c53030; padding: 20px; border-left: 5px solid #c53030; border-radius: 4px; margin-bottom: 30px;">
          <strong>Fehler:</strong> {error()}
        </div>
      )}

      {diagramSource() && (
        <details style="margin-bottom: 20px; cursor: pointer;">
          <summary style="color: #4a5568; font-weight: bold;">Quelltext anzeigen</summary>
          <pre style="background: #edf2f7; padding: 15px; border-radius: 8px; overflow-x: auto; margin-top: 10px; font-size: 0.9rem;">
            {diagramSource()}
          </pre>
        </details>
      )}

      <main style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); min-height: 300px; display: flex; align-items: center; justify-content: center;">
         <div ref={containerRef} style="width: 100%;"></div>
         {!window.location.hash && (
           <p style="color: #a0aec0; text-align: center;">Warte auf Input-Hash...</p>
         )}
      </main>
    </div>
  );
}

export default App;
