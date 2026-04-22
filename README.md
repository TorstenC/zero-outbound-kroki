# 🥷 Zero-Outbound Kroki

Ein rein clientseitiger, serverloser Viewer für Diagramme und Bilder.

## 🎯 Warum dieses Projekt?

In Konzernumgebungen ist "IP-Leakage" ein echtes Risiko. Interne Architekturdiagramme sollten niemals externe Rendering-Server sehen.

**Zero-Outbound Kroki löst das:**

* **100% Client-Side:** Kein Rendering-Server, kein Backend.
* **Verschwiegen:** Da alles im URL-Hash (`#`) stattfindet, sieht selbst der Webserver (GitHub Pages) nicht, was du dir ansiehst (Hashes werden nicht an den Server gesendet).

## 🏗️ Unterstützte URL-Schemata

### A. Kroki-Modus (Diagramme)

Nutzt den komprimierten Kroki-Standard:
`/#/{engine}/{format}/{base64-payload}`
*Beispiel:* `/#/mermaid/svg/eNpLyslPzub6MH_p9setSwArgwcN`

### B. Direct-Image-Modus (Bilder/Snapshots)

Zeigt Base64-kodierte Bilder direkt an:
`/#data:image/{png|jpg|webp};base64,{payload}`
*Vorteil:* Perfekt, um sensible Screenshots sicher über einen Link zu teilen, ohne sie hochzuladen.

## 🛠️ Technologie

* **Nāgārjuna-Engine:** „Leere ist das Fundament aller Dinge“ (Die App ist initial leer und baut sich aus dem Hash auf).
* **SolidJS & Vite:** Für maximale Performance und minimale Größe.