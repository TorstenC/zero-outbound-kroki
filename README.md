# 🥷 Zero-Outbound Kroki

Ein rein clientseitiger, serverloser Viewer für Diagramme (kompatibel mit dem [Kroki](https://kroki.io/)-URL-Format).

## 🎯 Warum dieses Projekt?

In Unternehmensumgebungen stellen webbasierte Diagramm-Tools oft ein Sicherheitsrisiko dar ("IP-Leakage"), wenn interne Architektur- oder Prozessdiagramme an externe Server (wie `kroki.io` oder PlantUML-Server) gesendet werden, um dort gerendert zu werden.

**Zero-Outbound Kroki löst dieses Problem:**

* **100% Client-Side:** Alles passiert in deinem Browser. Es gibt keine ausgehenden HTTP-Requests an Rendering-Server.
* **Kroki-Kompatibilität:** Es nutzt denselben komprimierten Base64-Payload wie Kroki, liest diesen aber aus dem URL-Hash (`#`).
* **Sicher teilbar:** Da der Code komplett im Hash (`#...`) der URL liegt, wird der Diagramm-Code beim Aufrufen der Seite nicht einmal an den Server (z.B. GitHub Pages) übertragen.

## 🏗️ Architektur

Die URL-Struktur orientiert sich an Kroki, verlagert den Payload aber in den Hash:
`https://<domain>/#/<engine>/<format>/<base64-payload>`

Das Tool liest den Hash, entpackt ihn (Base64 Decode -> Zlib Inflate via `pako`) und übergibt den Klartext an die lokale, im Browser laufende Diagramm-Engine (z.B. Mermaid.js).

## 🚀 Technologie-Stack

* **Build-Tool:** [Vite](https://vitejs.dev/)
* **UI-Framework:** [SolidJS](https://www.solidjs.com/) (Extrem leichtgewichtig, kein Virtual DOM)
* **Kompression:** `pako` (Zlib port)

## 🛠️ Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver mit Hot-Module-Replacement starten
npm run dev

# Projekt für die Produktion bauen (Static Files)
npm run buil
```
