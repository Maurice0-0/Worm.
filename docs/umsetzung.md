# Umsetzungsstand Worm

Stand: 22. April 2026

## Projektstatus

Das Spiel ist als lokale Browser-Version mit reinem HTML, CSS und JavaScript umgesetzt.
Es gibt keinen Build-Prozess und keine externen Abhaengigkeiten.
`index.html` kann direkt im Browser geoeffnet werden.

## Aktuell vorhandene Dateien

- `index.html`: Layout, HUD, Overlay, Inventar und Einstellungsbereich
- `style.css`: komplettes Styling fuer Spielfeld, Wurm, Effekte, Overlay und Responsive-Verhalten
- `game.js`: gesamte Spiellogik, Spawns, Kollisionen, Effekte, Inventar und Highscore
- `docs/worm_game_idea.md`: urspruengliche Spielidee und Feature-Wunschliste
- `docs/anleitung.md`: Arbeitsanweisung fuer fruehere KI-Schritte
- `docs/umsetzung.md`: diese Statusdokumentation

## Bereits umgesetzt

- 16x16-Spielfeld
- Wurm mit kontinuierlicher Bewegung
- Steuerung mit `W`, `A`, `S`, `D`
- 180-Grad-Sperre
- Wandkollision und Selbstkollision als Game Over
- Startscreen mit `Leertaste`
- Neustart nach Game Over mit `Leertaste`
- Punktestand
- Highscore per `localStorage`
- mindestens ein normaler Apfel immer auf dem Feld
- maximal 5 Objekte gleichzeitig auf dem Spielfeld
- Spawn-System mit konfigurierbarer Spawnrate
- Inventar mit 5 Slots
- Aktivierung von Inventar-Objekten per Klick
- Aktivierung von Inventar-Objekten ueber Tasten `1` bis `5`
- Einstellungsbereich fuer Geschwindigkeit und Spawnrate
- Ein- und Ausschalten einzelner Spezialtypen
- konfigurierbare Dauern fuer mehrere Effekte
- Anti-Epilepsie-Schalter fuer visuelle Risiko-Effekte

## Implementierte Spezialobjekte

Gute Objekte, landen im Inventar:

- `Slowmotion`
- `Kuerzer werden`
- `Ghost`
- `Magnet`
- `Time Stop`

Sofort wirkende negative oder besondere Objekte:

- `Teleport`
- `Stoerung`
- `Disco`
- `Gruener Apfel`

## Verhalten der Spezialeffekte

- `Slowmotion`: verlangsamt den Spieltakt fuer eine einstellbare Dauer
- `Kuerzer werden`: reduziert die Wurmlaenge direkt, aber nicht unter die Mindestlaenge
- `Ghost`: erlaubt fuer kurze Zeit das Durchfahren des eigenen Koerpers und sogar das Verlassen des Spielfelds
- `Magnet`: zieht nahe Objekte in Richtung Kopf
- `Time Stop`: stoppt die automatische Bewegung; Richtungsinputs bewegen den Wurm dann schrittweise
- `Teleport`: versetzt den gesamten Wurm sofort an eine andere gueltige Position
- `Stoerung`: invertiert die Richtungssteuerung fuer kurze Zeit
- `Disco`: aktiviert einen starken optischen Farbeffekt auf dem Spielfeld
- `Gruener Apfel`: aktiviert einen starken Farbwechsel ueber die ganze Seite

## Spawn- und Balancing-Logik

- normale Aepfel despawnen nicht
- gute Power-ups despawnen nach 15 Sekunden
- schlechte Objekte despawnen nach 10 Sekunden
- `Disco` despawnt nach 10 Sekunden
- nach dem Entfernen eines Spezialobjekts wird der naechste Spawn ueber eine Wartezeit neu terminiert
- die Spawnrate ist ueber die UI auf `Wenig`, `Normal` oder `Viel` einstellbar
- bei mehreren Spezialspawns hintereinander wird spaetestens nach zwei nicht-negativen Spezialspawns wieder ein schlechtes Objekt erzwungen, sofern eines aktiviert ist

## Wichtige technische Beobachtungen

- Der Wurm wird nicht als klassische Block-Snake, sondern ueber ein zusaetzliches SVG-Layer weich gezeichnet.
- Der Highscore wird unter dem Key `worm.highscore` im Browser gespeichert.
- Das Spiel ist fuer den Direktstart als lokale Datei ausgelegt.

## Heute korrigiert

Blindheit wurde wieder komplett entfernt.
Damit entfaellt die zusaetzliche Maskierung im Spielfeld ebenso wie die zugehoerige Einstellung in der UI.

## Offene Punkte und sinnvolle naechste Schritte

- im Browser testen, ob alle Einstellungs-Toggles wie erwartet reagieren
- pruefen, ob `Ghost` ausserhalb des Spielfelds spielerisch so gewollt ist
- Balance der Spawn-Gewichte weiter abstimmen
- README aktuell halten, wenn weitere Power-ups dazukommen
