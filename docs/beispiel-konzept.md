# Spiel-Konzept: Snake (Beispiel)

> Das ist ein Beispiel, wie so ein Konzept aussehen kann.
> Schreib deins in eigenen Worten — so detailliert wie hier, gern auch ausführlicher.

## Spielziel

Eine Schlange wird durch ein rechteckiges Spielfeld gesteuert und soll Futter fressen. Jedes gefressene Futter macht die Schlange länger und gibt einen Punkt. Ziel: möglichst viele Punkte holen, ohne dass die Schlange sich selbst beisst oder gegen die Wand fährt.

## Spielablauf

1. Beim Start sieht man einen Startbildschirm mit dem Titel "Snake" und dem Text *"Drücke Leertaste zum Starten"*.
2. Nach dem Drücken erscheint das Spielfeld. Die Schlange startet in der Mitte, 3 Felder lang, und bewegt sich nach rechts.
3. Ein Futter-Punkt erscheint an einer zufälligen Stelle des Feldes.
4. Der Spieler steuert mit den Pfeiltasten. Die Schlange bewegt sich automatisch und kontinuierlich in die letzte Richtung.
5. Frisst die Schlange das Futter, wächst sie um 1 Feld, der Punktestand erhöht sich um 1, und an einer neuen Zufallsstelle erscheint Futter.
6. Trifft die Schlange die Wand oder sich selbst → **Game Over**.

## User-Interaktion

| Taste | Aktion |
|---|---|
| Pfeil oben | Richtung nach oben |
| Pfeil unten | Richtung nach unten |
| Pfeil links | Richtung nach links |
| Pfeil rechts | Richtung nach rechts |
| Leertaste | Spiel starten / neu starten |

**Regel:** 180°-Wende ist nicht erlaubt (wenn die Schlange nach rechts geht, kann sie nicht direkt nach links wechseln — sonst beisst sie sich sofort selbst).

## Spiel-Parameter

| Parameter | Wert |
|---|---|
| Spielfeld | 20 x 20 Felder |
| Feldgrösse | 20 Pixel pro Feld (macht 400 x 400 Pixel) |
| Startlänge | 3 Felder |
| Geschwindigkeit | alle 150 Millisekunden ein Feld vorrücken |

**Farben:**

- Hintergrund: schwarz
- Schlange: grün
- Futter: rot
- Punktestand: weisse Schrift, oben links

## Level / Schwierigkeitsgrad

- Keine festen Levels.
- Alle 5 gefressenen Futter wird die Schlange 10 ms schneller (von 150 ms runter, **Minimum 60 ms** — sonst wird's unspielbar).
- So wird das Spiel automatisch schwerer, je besser man ist.

## Game Over

- Die Schlange bleibt stehen.
- Es erscheint ein Text in der Mitte: **"Game Over — Punkte: X"**
- Darunter: *"Drücke Leertaste für neue Runde"*.
- Der Highscore wird gespeichert (einfach im Browser, `localStorage`) und unter dem Punktestand angezeigt: **"Highscore: Y"**.

## Was mir wichtig ist

- Das Spiel soll sich schnell und direkt anfühlen — keine Verzögerung beim Richtungswechsel.
- Die Steuerung soll auch funktionieren, wenn man zwei Tasten schnell hintereinander drückt.
- Es soll auf dem Laptop im Browser laufen, ohne Installation.

## Was (noch) nicht wichtig ist

- Handy-Steuerung (Touch)
- Sound-Effekte
- Animationen
- Mehrspieler

Kann später dazukommen, wenn die Grundversion läuft.
