// src/engines/mermaid.js
import mermaid from 'mermaid';

// Initiale Konfiguration: Mermaid soll nicht automatisch das ganze DOM durchsuchen,
// da wir ihm den Code gezielt übergeben.
mermaid.initialize({ startOnLoad: false, theme: 'default' });

export async function renderMermaid(code, container) {
    try {
        // Mermaid benötigt eine eindeutige ID für das zu generierende SVG
        const id = `mermaid-svg-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        
        // Das fertige SVG in unseren Container werfen
        container.innerHTML = svg;
    } catch (error) {
        console.error("Mermaid Render Error:", error);
        container.innerHTML = `
            <div style="color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; font-family: monospace;">
                <strong>Fehler beim Rendern:</strong><br/>${error.message}
            </div>
        `;
    }
}