// src/App.jsx
import { createSignal, onMount, onCleanup } from 'solid-js';
import { decodePayload } from './core/decoder';
import { renderMermaid } from './engines/mermaid';
import { renderVega } from './engines/vega';

function App() {
  const [diagramSource, setDiagramSource] = createSignal('');
  const [error, setError] = createSignal('');
  const [isEmbed, setIsEmbed] = createSignal(false);
  let containerRef;

  const handleHashChange = async () => {
    setError('');
    setDiagramSource('');
    if (containerRef) containerRef.innerHTML = '';

    let hash = window.location.hash.slice(1); 
    if (!hash || hash === '/') return; 

    if (hash.startsWith('/')) hash = hash.slice(1);

    // --- FALL 1: Direct-Image Modus ---
    if (hash.startsWith('data:image/')) {
      if (containerRef) {
        containerRef.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
            ${!isEmbed() ? '<p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">Direkt-Bild Modus (Base64)</p>' : ''}
            <img src="${hash}" alt="Injected Content" style="max-width: 100%; max-height: 100vh; border-radius: ${isEmbed() ? '0' : '8px'}; box-shadow: ${isEmbed() ? 'none' : '0 10px 25px rgba(0,0,0,0.2)'};" />
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
    // 1. Embed-Modus erkennen (iframe ODER expliziter ?embed Parameter)
    const inIframe = window.self !== window.top;
    const hasEmbedParam = new URLSearchParams(window.location.search).has('embed');
    setIsEmbed(inIframe || hasEmbedParam);

    // 2. Event-Listener registrieren
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  });

// ... (oberer Teil bleibt gleich bis onCleanup) ...

  onCleanup(() => window.removeEventListener('hashchange', handleHashChange));

  // LÖSUNG: Aus Konstanten werden Arrow-Functions (Derived Signals)
  const appStyle = () => isEmbed() 
    ? "width: 100vw; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0; background: transparent;"
    : "max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;";

  const mainStyle = () => isEmbed()
    ? "width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"
    : "background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); min-height: 300px; display: flex; align-items: center; justify-content: center;";

  return (
    // Aufruf der Funktionen mit appStyle() statt appStyle
    <div style={appStyle()}>
      
      {!isEmbed() && (
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 2.5rem; margin-bottom: 0;">🥷 Zero-Outbound Kroki</h1>
          <p style="color: #666; font-style: italic;">„Leere ist das Fundament aller Dinge.“</p>
        </header>
      )}
      
      {error() && (
        <div style={`background: #fff5f5; color: #c53030; padding: 20px; border-left: 5px solid #c53030; ${isEmbed() ? 'margin: 20px;' : 'border-radius: 4px; margin-bottom: 30px;'}`}>
          <strong>Fehler:</strong> {error()}
        </div>
      )}

      {!isEmbed() && diagramSource() && (
        <details style="margin-bottom: 20px; cursor: pointer;">
          <summary style="color: #4a5568; font-weight: bold;">Quelltext anzeigen</summary>
          <pre style="background: #edf2f7; padding: 15px; border-radius: 8px; overflow-x: auto; margin-top: 10px; font-size: 0.9rem;">
            {diagramSource()}
          </pre>
        </details>
      )}

      {/* Aufruf der Funktion mainStyle() */}
      <main style={mainStyle()}>
         <div ref={containerRef} style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"></div>
         {!window.location.hash && !isEmbed() && (
           <p style="color: #a0aec0; text-align: center;">Warte auf Input-Hash...</p>
         )}
      </main>
    </div>
  );
}

export default App;