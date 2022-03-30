
```bash
AN DEN PROTOTYP FUND (2022-03-30)
Wir haben das Projekt gerade erst aufgesetzt und wollten lieber diesen als gar
keinen Link in der Bewerbung mitschicken. Im Verlauf von April und Mai kommt
hier Bewegung rein.

Der Regel für den Antrag selber folgend halten wir alle Texte zur Darstellung des Projeks vorläufig auf Deutsch. Um der wachsenden Community an BIM und IFC interessierten Entwicklern keine unnötigen Hürden in den Weg zu stellen schlagen wir für den weiteren Projektverlauf Englisch als Geschäftssprache vor.  
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

# Arbeitsweise

@TODO Arbeisweise in Contribution Guide genauer festlegen. 

- Anforderungs Management im Gitlab Ticketsystem
- Diskussion von Anforderungen und möglichen Umsetzungen im Kommentar des Tickets 
- Design Dokumente für Architektur und einzelne Anforderungen im Projekt Wiki
- Gemeinsame Bewertung, Sprint Planung und Sprint Review im 2-Wochen Rhythmus
- Definition-of-Done 
- 100% Code Coverage (Unit und integration Tests)
- Kein API Endpoint ohne vollständige Dokumentation und automatisierte integration Tests (API Test des gebauten Containrs mit definierten Test-Daten)
- Contract-Driven API Design, d.h. Anforderungen des Clients oder Abstimmung zwischen Front-End und API Implementierung werden über API Tests abgebildet.  
- Einheitliche Linting-Regeln für eine Programmiersprache, d.h. Javascript / Typesceript folgen sowohl im Front-End als auch im Back-End dem selben Stil. Mit kleinen Anpassungen folgendem wir dem [Google Javascript Styleguide](https://google.github.io/styleguide/jsguide.html)
- Wir folgen einem festgelegtem Commit-Template. Das Format ist bei jedem Commit und in jedem Fall zu beachten. Insbesondere kein Check-In ohne Bezug zu einer Issue ID. Jeder Commit hat einen Body mit der Motivation für die Änderungen.
  - Subject `<type> (<component> #<ticket): <imperative description imperative and present tense>`
  - Body Motivation, ggf. Breaking Changes, Depreciation Notice samt Update Path, related issues und issues to be closed.
- Anforderungen werden als User Stories dargestellt möglichst ausführlich und mit Beispielen Dargestellt. Wo notwendig oder hilfreich werden nach gemeinsamer Diskussion Akzeptanzkriterien hinzugefügt.
- Wir handhaben eine noch genauer festzulegende Definition-of-Done für Integration von Anforderungen, Dokumentation, Nutzerhandbuch und sonstige redaktionelle Texte, um einen Mindeststandard zu gewährleisten. 

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

Die verwendeten Technologien werden all als Bestandteil der Enwicklungs oder Produktionsumgebung mit ausgeliefert oder automatisch installiert. 

- **Tools**
  - [eslint](https://eslint.org/) Code Linting
  - [snyk.io](https://snyk.io/) Security Auditing
  - [prettier.io](https://prettier.io/) Auto formatting code
  - [vitejs](https://vitejs.dev/) Lean fron-end tooling for Vue Apps
- **ifc-hive-client**
  - [vue 3.0](https://vuejs.org/) Reactive framework web app 
  - [vuetify 3](https://next.vuetifyjs.com/en/) UI Component Library for Vue 3
  - [three.js](https://threejs.org/) Javascript 3D WebGL library
  - [ifc.js](https://github.com/IFCjs) Open source IFC library  
- **ifc-hive-server**
  - [nodejs](https://nodejs.org/en/)
  - [fastify](https://www.fastify.io/) Lean nodejs web framework with excellent performance as the basis for our API and application Layer.
    - see also the [fastify ecosystem](https://www.fastify.io/ecosystem/)
  - [swagger / openAPI 3.0](https://swagger.io/docs/) openAPI 3.0 compliant API documentation
  - [ifc.js](https://github.com/IFCjs) Open source IFC library
  - [ifcOpenShell](http://ifcopenshell.org/) open source ifc toolkit and geometry engine
- **Deployment und Infrastruktur** 
  - [Gitlab and gitlab-runner](https://docs.gitlab.com/runner/) for code management and deployment to test and integration environment.
  - [Docker and docker-compose](https://www.docker.com/) for development environment and as deployment format.
  - [nginx](https://www.nginx.com/) as reverse proxy and public facade
  - [letsencrypt](https://letsencrypt.org/de/) and [certbot](https://certbot.eff.org/) as default option to handle TSL/SSL certificates.
  - [neo4j](https://neo4j.com/) graph database as primary database technology.
  - [redis](https://redis.io/) in memory data store for the management of socket connections and efficient access control  
  - [elasticsearch](https://www.elastic.co/de/elastic-stack/) for full-text search and meta-data aggregations and indexing of key IFC concepts as denormalized, composed entities.
  - [logstash](https://www.elastic.co/de/logstash/) and [kibana](https://www.elastic.co/de/kibana/) as loggin service


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


# Diskussion und weiterführende Literatur

# Andere interessante BIM und IFC Projekte
