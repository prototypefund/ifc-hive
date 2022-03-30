
```bash
AN DEN PROTOTYP FUND (2022-03-30)
Wir haben das Projekt gerade erst aufgesetzt und wollten lieber diesen als gar
keinen Link in der Bewerbung mitschicken. Im Verlauf von April und Mai kommt
hier Bewegung rein.
```

---

# ifc-hive

An Open BIM plattform to collaborate with stakeholders, contractors, partners
and share your IFC data.

[[_TOC_]]

Wir wollen einen Beitrag zu Open BIM leisten indem wir Bau- und
Planungsprojekten aller Größenordnungen sowie Betreibern von Immobilien
ermöglichen, ihre Bauwerksdaten vollständig IFC-konform zu verwalten. Im Sinne
der IFC Spezifikation beschränken wir uns dabei nicht auf Design und Austausch
der Gebäudegeometrie, sondern schließen die Abstraken und meist vernachlässtigen
oder proprietär implementierten abstraken Konzepte mit ein. Dazu gehören
Randbedingungen und Anforderungen in der Vorplanung, Emmissionswerte zu
Baustoffen, Gewerken und Baugruppen, Dokumente, Verantwortlichkeiten,
Gewährleistungen, Baustoffe Metadaten, Ausstattungs- und Einrichtungselemente. 

Die für BIM Formate COBie und BCF wollen wir ebenfalls unterstützen, soweit sie
Teildes IFC 4.0 Standards order einer etablierten Erweiterung sind. Vor allem im
Betrieb und in der Sanierung von Bestandsgebäuden spielen beide Formate eine
wichtige Rolle für einen niederschwelligen Datenaustausch ohne Medienbrüche.

Dieses Projekt ist zunächst ein Prototyp. Wir wollen einerseits ausgewählte
Anwendungsfälle so vollständig abbilden, dass die Plattform umgehend produktiv
genutzt werden kann. Gleichzeiig wollen wir mit diesem Prototyp aber auch
darstellen, wie ein offenes, anschlussfähiges, zukunftsfähiges BIM Common Data
Environment (CDE) funktionieren kann. Ein derart offenes CDE ist eine notwendige
Voraussetzung, wenn die Vorstellung von Open BIM praktisch möglich werden soll.
Wir sehen uns als Teil einer wachsenden, innovativen Community, die genau daran
arbeitet. Im Abschnitt [Andere interessante IFC und BIM
Projekte](https://repo.karo.design/daniel/ifc-hive#andere-interessante-bim-und-ifc-projekte)
listen wir einige aus unserer Sicht bemerkenswerte und inspirierende Projekte
auf.



## Motivation

## Zielgruppe

# Komponenten

## ifc-hive-server
Eigenes Repo siehe...

## ifc-hive-client
Eigenes Repo siehe...

## ifc-hive-project
Das übergeorndete Projekt das alle aktuellen und etwaige zukünftige Komponenten
referenziert und als Cluster von zusammengehörigen Services präsentiert. Für
bloße Installation, Betrieb und Nutzung der Plattform sind die hier genannten
Informationen hinreichend.

# Konzept

## Kurzbeschreibung

## IFC und Graphdatenbank

## Prämissen und technische Ansätze

## Verwendete Technologien

# Roadmap

Siehe auch [Meilensteine](https://repo.karo.design/daniel/ifc-hive/-/milestones) für detaillierte Beschreibungen.

1. [Detailkonzept und technische Planung](https://repo.karo.design/daniel/ifc-hive/-/milestones/1)
    - **Ergebnis** Detailkonzept, User Stories, Systemarchitektur, technische, Planung,API Design in OpenAPI 3.0,
2. [Front-End Basis](https://repo.karo.design/daniel/ifc-hive/-/milestones/3)
    - **Ergebnis** Globale UX/UI Komponenten, Framework, globale Komponenten,
      Sockets, API client, Error Handling etc.
3. [API und Back-End Basis](https://repo.karo.design/daniel/ifc-hive/-/milestones/2)
    - **Ergebnis** Basis-Implementierung, Security, API für User und Security Management, Integration von neo4j, Redis, Elasticsearch, DevOps Basics, 
4. [IFC Graph Operationen Schlüsselkonzepte](https://repo.karo.design/daniel/ifc-hive/-/milestones/4)
    - **Ergebnis** IFC Dateien bzw. Data Streams werden effizient als Graph
  verarbeitet und in neo4j gespeichert. Basisoperationen zur Bearbeitung des
  Graphen und performante Transformation in beide Richtungen ist implementiert. 
5. [Front-End interaktiver IFC Viewer](https://repo.karo.design/daniel/ifc-hive/-/milestones/5)
    - **Ergebnis** Erweiterung von ifc/web-ifc-viewer und auf Basis von three.js
      manipulation von Bauwerksdaten, isolierte Darstellung von Etagen und
      einzelnen Räumen, und Baugruppen nach Kategorien, dynamischer Querschnitt
      durch Modell, Bearbeitung von Meta-Daten.
6. [Early Alpha Basis-Anwendungsfällen](https://repo.karo.design/daniel/ifc-hive/-/milestones/6)
    - **Ergebnis** Erste Rohversion aller Komponenten, zentrale Anwendungsfälle
     sind implmentiert. IFC Dateien können importiert, neu erstellt, bearbeitet
     und dargestellt werden. Mit Graph-Operationen können Teilgraphen isoliert
     werden und Suchen über Attribute und Relationen ausgeführt werden.
7. [IFC Projekt Management und Versionskontrolle](https://repo.karo.design/daniel/ifc-hive/-/milestones/7)
    - **Ergebnis** Die Basisoperationen sind um einfache, git-ähnliche Operationen
  zur Verwaltung des digitalen Zwillings erweitert. Es können Teilgraphen an
  Fachplaner herausgegeben und nach Bearbeitung wieder integriert werden. Die an
  Git angelehnten Konzepte Commit und Tag und das identifizieren und Lösen von
  Merge-Konflikten ist umgesetzt.
8. [Front-End feature complete](https://repo.karo.design/daniel/ifc-hive/-/milestones/9)
    - **Ergebnis** Front-End Prototyp ist bezogen auf die geplanten Anwendungsfälle vollständig. Qualitätsicherung und Dokumentation sind abgeschlossen.
9. [API feature complete](https://repo.karo.design/daniel/ifc-hive/-/milestones/8)
    - **Ergebnis** API und Back-End sind vollständig im Sinne der Planung
      implementiert. Qualitätssicherung und Dokumentation sind abgeschlossen.
10. [Prototype Release Candidate (QA)](https://repo.karo.design/daniel/ifc-hive/-/milestones/10)
    - **Ergebnis** User Acceptance Testing mit Fokusgruppe, Evaluierung aller Anwendungsfälle, Verbesserungen, Optimierungen Deployment, Online Nutzer-Handbuch  etc.
11. [Prototyp Release](https://repo.karo.design/daniel/ifc-hive/-/milestones/11)
    - **Ergebnis** Inbetriebnahme des Prototypen bei Fokusgruppe, Bereistellung der
      Plattform an die öffentliche Verwaltung über den https://www.fitko.de/.
      Marketing des Projekts an weitere Zielgruppen, z.B. Schulträger für
      Umsetzung Digitalpakt, institutionelle Bauherren und Betreiber von
      Immobilien.


# Sonstiges

## Diskussion und weiterführende Literatur

## Andere interessante BIM und IFC Projekte
