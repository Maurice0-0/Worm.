# Worm.

Ein lokales Browser-Spiel im Stil von Snake, umgesetzt nur mit `HTML`, `CSS` und `JavaScript`.
Der Wurm sammelt Aepfel und Spezialobjekte auf einem 16x16-Feld, waechst mit jedem Apfel und kann ueber Inventar-Power-ups taktisch gesteuert werden.

## Start

Es gibt keinen Build-Schritt.
Zum Starten einfach `index.html` im Browser oeffnen.

## Steuerung

- `Leertaste`: Spiel starten oder nach Game Over neu starten
- `W`, `A`, `S`, `D`: Richtung steuern
- `1` bis `5`: Inventar-Slots direkt ausloesen
- Mausklick auf Inventar-Slot: gespeichertes Power-up benutzen

## Bereits enthaltene Features

- 16x16-Spielfeld
- Score und Highscore
- Start- und Game-Over-Overlay
- Inventar mit 5 Slots
- konfigurierbare Geschwindigkeit
- konfigurierbare Spawnrate
- Anti-Epilepsie-Schalter
- einzeln aktivierbare Spezialobjekte
- einstellbare Effekt-Dauern

## Spezialobjekte

Positive Inventar-Power-ups:

- `Slowmotion`
- `Kuerzer werden`
- `Ghost`
- `Magnet`
- `Time Stop`

Negative oder direkte Spezialeffekte:

- `Teleport`
- `Stoerung`
- `Disco`
- `Gruener Apfel`

## Projektstruktur

- `index.html`: UI-Struktur und Einstellungen
- `style.css`: visuelle Darstellung
- `game.js`: Spiellogik
- `docs/umsetzung.md`: aktueller Entwicklungsstand
- `docs/worm_game_idea.md`: urspruengliche Idee

## Hinweise

- Der Highscore wird im Browser via `localStorage` gespeichert.
- Das Projekt ist fuer lokales Oeffnen ohne Server gedacht.
- Der aktuelle Stand wurde in `docs/umsetzung.md` dokumentiert.
