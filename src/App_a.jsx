// src/App.jsx
import { createSignal, onMount, onCleanup } from 'solid-js';
import { decodePayload } from './core/decoder';
import { renderMermaid } from './engines/mermaid';
import diagrams from './assets/diagrams'

function App() {
  const [diagramSource, setDiagramSource] = createSignal('');
  const [error, setError] = createSignal('');
  let containerRef;

  const handleHashChange = async () => {
    // State zurücksetzen
    setError('');
    setDiagramSource('');
    if (containerRef) containerRef.innerHTML = '';

    console.log(`URL-Hash geändert: ${window.location.hash}`);

    const hash = window.location.hash.slice(1); // Das '#' am Anfang entfernen
    if (!hash || hash === '/') return; // Nichts zu tun bei der Startseite

    // Format aufsplitten: /engine/format/payload
    const parts = hash.split('/').filter(Boolean);
    if (parts.length < 3) {
      setError("Ungültiges URL-Format. Erwartet: #/engine/format/payload");
      return;
    }

    const [engine, format, payload] = parts;

    try {
      // 1. Payload entpacken
      const decodedCode = decodePayload(payload);
      setDiagramSource(decodedCode); // Zur Kontrolle im UI anzeigen

      // 2. An die richtige Engine weiterleiten
      if (engine === 'mermaid') {
         await renderMermaid(decodedCode, containerRef);
      } else {
         setError(`Die Engine '${engine}' wird noch nicht unterstützt.`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Event-Listener für URL-Änderungen registrieren
  onMount(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Auch beim ersten Laden direkt ausführen
  });

  onCleanup(() => {
    window.removeEventListener('hashchange', handleHashChange);
  });

  return (
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif;">
      <h1>🥷 Zero-Outbound Kroki</h1>
      
      {error() && (
        <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          {error()}
        </div>
      )}

      {diagramSource() && (
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 5px;">Entpackter Quelltext:</h3>
          <pre style="text-align: left; background: #f4f6f8; padding: 15px; border-radius: 6px; overflow-x: auto;">
            {diagramSource()}
          </pre>
        </div>
      )}

      <div style="border: 2px dashed #ccc; border-radius: 6px; padding: 20px; min-height: 200px; background: #fff;">
         <div ref={containerRef}></div>
         {!diagramSource() && !error() && (<>
           <p style="text-align: left; margin-top: 40px; color: #666;">
             Hänge einen Kroki-Hash an die URL an, um ein Diagramm zu sehen.<br/>
             Links:
           </p>
           <ul style="text-align: left;">
            {diagrams.mermaid.map((diagram) => (
              <li>
                <a href={diagram.url} target="mermaid">
                  {diagram.label}
                </a>
              </li>
            ))}
           </ul>
         </>
         )}
      </div>
    </div>
  );
}

export default App;