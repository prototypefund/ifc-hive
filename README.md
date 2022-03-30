
```bash
AN DEN PROTOTYP FUND (2022-03-30)
Wir haben das Projekt gerade erst aufgesetzt und wollten lieber diesen als gar
keinen Link in der Bewerbung mitschicken. Im Verlauf von April und Mai kommt
hier Bewegung rein.
```

---

# ifc-hive

A BIM plattform to collaborate and share your IFC data.

[[_TOC_]]

## Projektbeschreibung

Wir wollen einen Beitrag zu Open BIM leisten. Gegenstand dieses Projekts ist die
Entwicklung einer Plattform, mit der Bauherren einen digitalen Zwilling eines
Gebäudes Planern und Handwerkern bereitstellen können. Der digitale Zwilling
kann gemeinsam bearbeitet und fortlaufend mit Daten für eine nachhaltige
Gebäudeverwaltung angereichert werden. Grundlage ist das offene Datenschema IFC
in Kombination mit einer Repräsentation der Bauwerksdaten als Graph. Vernetztes
Arbeiten im Sinne von Open BIM und eine datengetriebene Bewirtschaftung von
Gebäuden braucht ein Common Data Environment (CDE), das nativ vom IFC Standard
her gedacht und entwickelt ist. Diese Vision wollen wir als Prototyp
realisieren.

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
Nutzer, die das Projekt nur installieren und als Plattform verwenden wollen
brauchen nur die hier genannten Informationen.

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
