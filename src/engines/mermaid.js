// src/engines/mermaid.js
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'default' });

export async function renderMermaid(code, container) {
    try {
        const id = `mermaid-svg-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        
        // Das fertige SVG in unseren Container werfen
        container.innerHTML = svg;

        // --- NEU: Responsive Anpassung ---
        // Suche das gerade eingefügte SVG-Element
        const svgElement = container.querySelector('svg');
        if (svgElement) {
            // Entferne feste Breiten/Höhen-Angaben, falls Mermaid welche gesetzt hat
            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
            
            // Setze CSS-Regeln für responsives Verhalten
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.style.maxWidth = '100%';
            // Im Embed-Modus wollen wir oft auch, dass es nicht unnötig hoch wird
            svgElement.style.maxHeight = '100vh'; 
        }
        
    } catch (error) {
        console.error("Mermaid Render Error:", error);
        container.innerHTML = `
            <div style="color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; font-family: monospace;">
                <strong>Fehler beim Rendern:</strong><br/>${error.message}
            </div>
        `;
    }
}
