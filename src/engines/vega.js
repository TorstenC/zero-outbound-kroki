// src/engines/vega.js
import vegaEmbed from 'vega-embed';

export async function renderVega(code, container) {
    try {
        // Der entpackte Code ist bei Vega/Vega-Lite ein JSON-String
        const spec = JSON.parse(code);
        
        // vegaEmbed übernimmt das komplette Rendering in den Container.
        // Mit { actions: false } schalten wir das kleine Vega-Menü (Export etc.) ab, 
        // damit es sich nahtlos ins UI einfügt.
        await vegaEmbed(container, spec, { actions: false });
        
    } catch (error) {
        console.error("Vega Render Error:", error);
        container.innerHTML = `
            <div style="color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; font-family: monospace;">
                <strong>Fehler beim Rendern des Vega-Diagramms:</strong><br/>${error.message}
            </div>
        `;
    }
}
