# Worm.

## Kurzbeschreibung

**Worm.** ist ein 2D-Browser-Spiel im Stil von Snake, aber mit einem **Wurm** statt einer Schlange, einem **16x16-Spielfeld**, sammelbaren **guten Power-ups**, sofort wirkenden **schlechten Äpfeln** und wachsendem Platzmangel als zentraler Gefahr.

Der Spieler steuert einen beigen Wurm mit lustigen Augen über ein blaues Spielfeld, sammelt normale Äpfel und Spezialobjekte und versucht, möglichst lange zu überleben. Gute Power-ups werden **eingesammelt und gespeichert**, statt sofort automatisch ausgelöst zu werden. Schlechte Äpfel wirken dagegen **sofort**.

Die wichtigste Besonderheit des Spiels ist: **Wenn kein freies Feld mehr übrig ist, ist das Spiel vorbei.**

---

## Spielziel

Das Ziel des Spiels ist es,

- möglichst lange zu überleben,
- viele Äpfel zu sammeln,
- den Wurm kontrollierbar zu halten,
- Platz auf dem Spielfeld sinnvoll zu verwalten,
- gute Power-ups im richtigen Moment einzusetzen,
- und mit negativen Effekten umzugehen.

Das Spiel ist als **endloses Survival-Arcade-Spiel** gedacht und nicht als klassisches Spiel mit festen, abgeschlossenen Levels.

---

## Spielablauf

### Start des Spiels

- Der Wurm startet klein auf einem **16x16-Raster**.
- Zu Beginn liegt mindestens ein normaler Apfel auf dem Spielfeld.
- Mit der Zeit erscheinen weitere Spawns:
  - normale Äpfel,
  - gute Power-ups,
  - schlechte Spezialäpfel,
  - ein lustiger Spezialeffekt.

### Während des Spiels

- Der Wurm bewegt sich ständig weiter.
- Der Spieler steuert ihn über die Tastatur.
- Normale Äpfel lassen den Wurm wachsen.
- Gute Power-ups werden im Inventar gespeichert.
- Schlechte Äpfel lösen sofort negative Effekte aus.
- Je länger der Wurm wird, desto weniger Platz bleibt.
- Damit steigt der Druck, Power-ups clever zu verwalten.

---

## User-Interaktion

### Steuerung

- **W** = nach oben
- **A** = nach links
- **S** = nach unten
- **D** = nach rechts

### Bewegungsregel

- Der Wurm darf sich **nicht direkt um 180° drehen**.
- Beispiel:
  - Wenn der Wurm nach rechts fährt, darf der Spieler nicht sofort nach links.
  - Wenn der Wurm nach oben fährt, darf der Spieler nicht sofort nach unten.

### Nutzung von Power-ups

Gute Power-ups werden **gesammelt und gespeichert**. Sie werden **nicht automatisch direkt verbraucht**.

#### Inventar-Vorschlag

- Eine sichtbare Inventar-Leiste im Interface
- Gesammelte Power-ups landen in freien Slots
- Der Spieler entscheidet selbst, wann er sie aktiviert

#### Aktivierungsvorschlag

- Klick auf einen Inventar-Slot
- optional zusätzlich Hotkeys wie `1`, `2`, `3`, ...

---

## Spielfeld und visuelle Gestaltung

### Spielfeld

- Größe: **16x16 Felder**
- Rasterbasiert
- Der Boden ist **abwechselnd blau und dunkelblau**
- Dadurch entsteht ein klares, gut lesbares Schachbrett-/Rastermuster

### Stil

- browserfreundlich
- sauber
- klar lesbar
- leicht verspielt
- charmant statt realistisch

### Spielfigur

- Kein klassischer Snake-Körper
- Stattdessen ein **Wurm**
- Farbe: **beige / hellbraun**
- Kopf mit **lustigen Augen**
- Insgesamt eher niedlich und leicht komisch

---

## Spawn-System

### Spawn-Verteilung

- **60 %** aller Spawns sind **normale Äpfel**
- **40 %** aller Spawns sind Spezialobjekte, also:
  - gute Power-ups
  - schlechte Äpfel
  - der lustige Disco-Effekt

### Despawn-Regeln

#### Normale Äpfel

- despawnen **nie**
- bleiben liegen, bis sie eingesammelt werden

#### Gute Power-ups

- despawnen nach **15 Sekunden**, wenn sie nicht eingesammelt werden

#### Schlechte Äpfel / schlechte Spezialobjekte

- despawnen nach **10 Sekunden**, wenn sie nicht eingesammelt werden

---

## Normale Äpfel

Normale Äpfel sind die Standard-Nahrung im Spiel.

### Wirkung

- erhöhen den Punktestand
- lassen den Wurm wachsen
- bleiben dauerhaft auf dem Spielfeld, bis sie eingesammelt werden

### Bedeutung

- Sie sind die verlässlichste Ressource im Spiel
- Gleichzeitig bringen sie den Spieler langfristig in Gefahr, weil der Wurm immer länger wird

---

## Gute Power-ups

Diese Objekte werden **gesammelt und gespeichert**.

### 1. Slowmotion

**Wirkung:**
- Das Spiel wird für kurze Zeit langsamer

**Nutzen:**
- mehr Reaktionszeit
- sicherer durch enge Situationen kommen

---

### 2. Kürzer werden

**Wirkung:**
- Der Wurm verliert einige Segmente

**Nutzen:**
- mehr freier Platz
- besonders wichtig in späteren Spielphasen

---

### 3. Invincibility

**Wirkung:**
- Der Wurm ist für kurze Zeit unverwundbar

**Standardannahme für das Design:**
- schützt vor normalen Kollisionen
- **schützt nicht vor dem Giftapfel**

**Nutzen:**
- Rettung in kritischen Situationen
- aggressiveres Spielen möglich

---

### 4. Freeze

**Wirkung:**
- Das Spielgeschehen friert für kurze Zeit ein

**Nutzen:**
- kurze Verschnaufpause
- hilft in stressigen Situationen

---

### 5. Ghost

**Wirkung:**
- Der Wurm kann für kurze Zeit durch den eigenen Körper hindurchfahren

**Nutzen:**
- besonders stark in engen Spielsituationen
- hilft bei Selbstblockaden

---

### 6. Magnet

**Wirkung:**
- Äpfel und nützliche Objekte in der Nähe werden angezogen

**Nutzen:**
- schnelleres Einsammeln
- weniger riskante Wege nötig

---

### 7. Mini-Boost

**Wirkung:**
- Der Wurm bewegt sich kurzzeitig schneller

**Nutzen:**
- riskantes, aber starkes Power-up
- gut zum schnellen Einsammeln von Objekten

---

### 8. Teleport

**Wirkung:**
- Der Wurm springt auf ein anderes freies Feld

**Nutzen:**
- Notfallrettung
- stark bei Platzmangel

---

### 9. Shield

**Wirkung:**
- schützt genau **einmal** vor einem Fehler oder einer normalen Kollision

**Nutzen:**
- Sicherheitsnetz ohne Zeitdruck
- sehr wertvoll in späteren Phasen

---

## Schlechte Äpfel und negative Effekte

Diese Objekte werden **nicht gespeichert**, sondern wirken **sofort beim Einsammeln**.

### 1. Giftapfel

**Wirkung:**
- sofortiger Tod
- sofort **Game Over**

**Besonderheit:**
- auch Invincibility schützt standardmäßig nicht davor

---

### 2. Vergammelter Apfel

**Wirkung:**
- vertauscht die Steuerung vorübergehend

### Neue Steuerungslogik während des Effekts

- **A wird zu D**
- **D wird zu A**
- **W wird zu S**
- **S wird zu W**

**Nutzen im Design:**
- sorgt für Chaos
- bestraft Gewohnheit und Muskelgedächtnis

---

### 3. Verfluchter Apfel

**Wirkung:**
- starke Vignette / Blindheits-Effekt
- der Spieler sieht nur einen kleinen Bereich des Spielfelds

### Sichtbereich

- Sichtbereich: **4x4 Felder**
- sichtbar ist nur der Körper des Wurms, der in diesem Bereich liegt
- der Rest des Spielfelds ist verdeckt

**Nutzen im Design:**
- erhöht Spannung
- erschwert Orientierung massiv
- macht selbst bekannte Situationen plötzlich gefährlich

---

## Lustiger Spezialeffekt

### Regenbogen-Disco

**Wirkung:**
- Das Spiel wird für kurze Zeit optisch chaotisch und bunt
- Farben wechseln schnell
- Spielfeld, UI oder Objekte können in Regenbogenfarben pulsieren

**Empfehlung für das Design:**
- nur optischer Effekt
- kein unfairer Gameplay-Nachteil
- eher humorvoll als gefährlich

---

## Inventar-System

Da gute Power-ups gesammelt statt direkt ausgelöst werden, ist ein Inventar notwendig.

### Eigenschaften des Inventars

- sichtbare Leiste im Interface
- mehrere Slots
- nur gute Power-ups werden gespeichert
- schlechte Äpfel kommen **nicht** ins Inventar

### Vorteile des Inventars

- mehr Strategie
- Power-ups können bewusst für Notfälle aufgehoben werden
- das Spiel bekommt mehr Tiefe als klassisches Snake

---

## Mögliche Spielparameter

Diese Werte können später im Balancing angepasst werden.

### Spielfeld

- Größe: **16x16**

### Startbedingungen

- Startlänge des Wurms
- Startgeschwindigkeit

### Spawn-Wahrscheinlichkeiten

- 60 % normaler Apfel
- 40 % Spezialspawns

### Despawn-Zeiten

- normale Äpfel: kein Despawn
- gute Power-ups: 15 Sekunden
- schlechte Äpfel: 10 Sekunden

### Effekt-Dauern (später festzulegen)

- Slowmotion-Dauer
- Invincibility-Dauer
- Freeze-Dauer
- Ghost-Dauer
- Magnet-Dauer
- Mini-Boost-Dauer
- Steuerungsumkehr-Dauer
- Blindheits-Dauer
- Disco-Dauer

---

## Level-Struktur / Spielphasen

Das Spiel hat **keine klassischen festen Level**. Stattdessen entwickelt es sich in **Phasen**.

### Frühe Phase

- viel Platz
- wenig Druck
- Spieler lernt Steuerung und System
- gute Einführung in das Spawn-System

### Mittlere Phase

- der Wurm ist deutlich länger
- erste echte Platzprobleme
- gute Power-ups werden wichtiger
- schlechte Effekte werden gefährlicher

### Späte Phase

- sehr wenig freier Raum
- jede Entscheidung zählt
- Kürzer werden, Teleport, Ghost und Shield werden extrem wichtig
- negative Äpfel können sehr schnell das Spiel beenden

---

## Wann das Spiel vorbei ist

Das Spiel ist vorbei, wenn eine der folgenden Bedingungen erfüllt ist:

### 1. Kein freies Feld mehr übrig

- Das ist die wichtigste und charakteristischste Niederlagenbedingung
- Wenn der Wurm das Spielfeld vollständig verbraucht hat, ist **Game Over**

### 2. Normale tödliche Kollision

- Kollision mit Wand oder eigenem Körper
- **außer**, ein aktives Schutz-Power-up verhindert das

### 3. Giftapfel eingesammelt

- sofortiger Tod
- sofort **Game Over**

---

## Spielidee in einem Satz

**Worm.** ist ein 2D-Browser-Survival-Spiel auf einem 16x16-Raster, in dem ein beiger Wurm mit lustigen Augen normale Äpfel, speicherbare Power-ups und gefährliche Spezialäpfel sammelt, während Platzmangel, Kontrollverlust und Sichtbehinderung das Spielfeld immer gefährlicher machen.

---

## Zusammenfassung der wichtigsten Designpunkte

- Name: **Worm.**
- Genre: 2D Browser Survival / Snake-artiges Arcade-Spiel
- Spielfeld: **16x16**
- Steuerung: **W / A / S / D**
- keine direkte **180°-Drehung**
- Spielfigur: **beiger Wurm mit lustigen Augen**
- Boden: **abwechselnd blau und dunkelblau**
- 60 % normale Äpfel
- gute Power-ups werden gespeichert
- schlechte Äpfel wirken sofort
- gute Spawns despawnen nach 15 Sekunden
- schlechte Spawns despawnen nach 10 Sekunden
- normales Essen despawnt nie
- wichtigste Niederlage: **kein freies Feld mehr**
