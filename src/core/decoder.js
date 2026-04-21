// src/core/decoder.js
import pako from 'pako';

/**
 * Dekodiert einen Kroki-kompatiblen Base64-Payload zurück in den Diagramm-Quelltext.
 * @param {string} payload - Der URL-sichere Base64 String aus dem URL-Hash
 * @returns {string} Der entpackte Diagramm-Code im Klartext
 */
export function decodePayload(payload) {
  try {
    // 1. URL-Safe Base64 in Standard-Base64 umwandeln
    // Kroki ersetzt '+' durch '-' und '/' durch '_'
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // 2. Base64 zu einem binären String dekodieren
    const binaryString = atob(base64);

    // 3. Binärstring in ein Uint8Array konvertieren (wird von pako benötigt)
    const uint8Array = Uint8Array.from(binaryString, c => c.charCodeAt(0));

    // 4. Mit pako entpacken (Zlib/Deflate) und direkt als UTF-8 String ausgeben
    const text = pako.inflate(uint8Array, { to: 'string' });

    return text;
  } catch (error) {
    console.error("Fehler beim Dekodieren des Payloads:", error);
    throw new Error("Ungültiger oder beschädigter Diagramm-Code. Konnte nicht entpackt werden.");
  }
}