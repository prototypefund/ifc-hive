<div align="center" style="margin-top: 50px">
  <img src="./docs/assets/logo-text-und-bild-small_200px.png">
</div>


# IFC HIVE

**An Open BIM platform for sustainable data management based on the open IFC standard.**

Wir wollen einen Beitrag zu Open BIM leisten, indem wir AnwenderInnen die
Möglichkeit geben, ihre Bauwerksdaten vollständig IFC-konform zu verwalten. Wir
richten uns an Bau- und Planungsprojekte aller Größenordnungen sowie an alle
möglichen Betreiber von Immobilien.

Im Sinne der IFC Spezifikation beschränken wir uns dabei nicht auf Design und
Austausch der Gebäudegeometrie, sondern schließen die abstraken und meist
vernachlässtigen oder proprietär implementierten Konzepte mit ein. Dazu gehören
Randbedingungen und Anforderungen in der Vorplanung, Emmissionswerte zu
Baustoffen, Gewerken und Baugruppen, Dokumente, Verantwortlichkeiten,
Gewährleistungen, Baustoffe Metadaten, Ausstattungs- und Einrichtungselemente. 

Die für BIM relevanten Formate COBie und BCF wollen wir ebenfalls unterstützen,
soweit sie Teil des IFC 4.0 Standards oder einer etablierten Erweiterung sind.
Vor allem im Betrieb und in der Sanierung von Bestandsgebäuden spielen beide
Formate eine wichtige Rolle für einen niederschwelligen Datenaustausch ohne
Medienbrüche.

Dieses Projekt ist zunächst ein Prototyp. Wir wollen einerseits ausgewählte
Anwendungsfälle so vollständig abbilden, dass die Plattform umgehend produktiv
genutzt werden kann. Gleichzeitig wollen wir mit diesem Prototyp aber auch
darstellen, wie ein offenes, anschlussfähiges, zukunftsfähiges BIM Common Data
Environment (CDE) funktionieren kann.

Ein derart offenes und nachhaltiges CDE ist nach unserer Auffassung eine
notwendige Voraussetzung für eine funktionierende, praktische Umsetzung von Open
BIM. Wir sehen uns als Teil einer wachsenden, innovativen Community, die genau
daran arbeitet. Im Abschnitt [Andere interessante IFC und BIM
Projekte](https://repo.karo.design/daniel/ifc-hive#andere-interessante-bim-und-ifc-projekte)
listen wir einige aus unserer Sicht bemerkenswerte und inspirierende Projekte
auf.

Weitere Informationen zum Konzept und zur technischen Umsetzungen finde Sie auf
unsere Projektwebeite [ifc-hive.karo.design](http://ifc-hive.karo.design/).

# Zielgruppen

**Wer kann etwas mit dem Ergebnis dieser Prototyp-Entwicklung anfangen?**

Im Rahmen einer zeiltlich begrenzten Prototyp-Entwicklung richten wir uns
zunächst vor allem an Nutzer, die in verschiedenen Anwendungsfällen mit
Bestandsgebäuden umgehen und eine einheitliche, strukturierte Datenlage als Ziel
haben.

1. Migration von Bauwerksdaten zu BIM / IFC
2. Grundlagenerfassung von Bestandsgebäuden
3. Ausplanung von Räumen, Etagen oder ganzen Gebäuden, z.B. Neueinrichtung von
   Unternehmen und Behörden
4. IFC konforme Verwaltung Immobilienportfolio
5. Datenlage für energetische Gebäudesanierung schaffen und pflegen
6. Planung und Umsetzung Neueinrichtung von Verkaufsräumen
6. Planung von Umbauten und Sanierungen

# Quickstart

Die Entwicklungsumgebung ist Docker-basiert und lässt sich mit den folgenden
Kommandos hochfahren bzw. restlos wieder entfernen.

```bash
# spin up docker based development environment
git clone git@repo.karo.design:daniel/ifc-hive.git
cd ifc-hive
# apply locally project specific git configuration
./admin install dev
# start up the containers in development mode
docker-compose up --build -d

# tear down including all volumes
docker-compose down -v
```
Nach erfolgreichem Start sind die folgenden Services erreichbar.

1. http://localhost:8081 (web client)
2. http://localhost:8082 (API)
3. http://localhost:8082/docs (Auto generated API documentation)
4. http://localhost:8089 (Documentation Website)

Siehe auch [technische Dokumentation](https://ifc-hive.karo.design/docs) und [Quickstart
Anleitung](https://ifc-hive.karo.design/quickstart) in der Dokumentation.

# Arbeitsweise

Wichtige Aspekte für die Zusammenarbeit im Projekt sind im [Contribution
Guide](CONTRIBUTING.md) dargestellt.

# Komponenten

Die Plattform besteht im wesentlich aus drei Komponenten:

1. ifc-hive-server — REST API, GraphQL, socket-server
2. ifc-hive-client — Browser Web App

Im Betrieb kommen mit einem Reverse Proxy (z.B. nginx) und einem persistenten
Logging Service (z.B. Logstash / Kibana) noch weitere Komponenten hinzu.
Außerdem gibt es noch sekundäre Services, z.B. Container für API
Integrationstests und End-to-End Testing der Web App. Grundsäzlich lassen sich
diese sekundäre Komponenten aber auch ganz anders integrieren, je nach
Deployment Infrastruktur.

# Diskussion und weiterführende Literatur

- Afsari, Eastman, Castro-Lacouture, Javascript Object Notation (JSON) data
  serialization for IFC schema and web-based-BIM data exhange, Automation in
  Construction 77 (2017) 24-51
- Bolognesi, Villa, From Building Information Modelling to Mixed Reality,
    Springer (2021)
- Michael Jäger, VCS 4 CDE - Version Control Systems as Common Data
    Environments, 2018, Report Advanced Topics in Building Information Modeling
- Borrmann, König, Koch, Beetz, Building Information Modelling, Technology
    Foundations and Industry Practice, Spriner (2018) 
- Ismael, Application of graph databases and graph theory concepts for advanced
    analysing of BIM models based on IFC standard, Converence Paper (2017)
- Ismael, Building Knowledge Extraction from BIM/IFC Data for Analysis in Graph
    Databases, 2018, DOI: 10.1007/978-3-319-91262-2_57
- Kameli et al., Improving maintanance performance by developing an IFC BIM/
    RFID-based computer system, (2020), Journaal of Ambient Intelligence and
    Humanized Computing (2020), https://doi.org/10.1007/s12652-020-02464-3
- Ofluoglu, Ozener, Isikdag, Advances in Building Information Modeling, Revised
    Selected Papers, Springer (2019) Communications in Computer and Information
    Science 1188
- Sacks et al., BIM Handbook, A guide to Building Information Modeling for
    Owners, Designers, Engineers, Contractors, and Facility Managers, Third
    Edition, Wiley (2017)
- Scherer, Schapke, Informationssystem im Bauwesen 1, Modelle, Methoden und
    Prozesse, Springer Vieweg 2014
- Scherer, Schapke, Informationssystem im Bauwesen 2, Anwendungen, Springer Vieweg 2014
- Yitmen, BIM-enabled Cognitive Computing for Smart Building Environment,
    Potential, Requirements, and Implementation, CRC Press, Tayloer & Franis
    Group (2021)
- [Rasmussen, Hviid, Karlshøj, Web-based, topology queries on a BIM model, 2017,
    Presentation](https://linkedbuildingdata.net/ldac2017/files/Presentations/171114_Web_sparql.pdf)
- Ma, Zhiliang & Liu, Zhe. (2018). Ontology- and freeware-based platform for rapid development of BIM applications with reasoning support. Automation in Construction. 90. 1-8. 10.1016/j.autcon.2018.02.004.  
- Boje, Calin & Kubicki, Sylvain & Guerriero, Annie. (2020). A 4D BIM System Architecture for the Semantic Web. 10.1007/978-3-030-51295-8_40. 
- Boje, Calin & Guerriero, Annie & Kubicki, Sylvain & Rezgui, Yacine. (2020). Towards a semantic Construction Digital Twin: Directions for future research. Automation in Construction. 114. 103179. 10.1016/j.autcon.2020.103179. 
- Jiang, Shaohua & Jiang, Liping & Han, Yunwei & Wu, Zheng & Wang, Na. (2019). OpenBIM: An Enabling Solution for Information Interoperability. Applied Sciences. 9. 5358. 10.3390/app9245358. 
- Yousif, Jabar & Abdul Majeed, Saif & Al-Azzawi, Fouad. (2020). Web-Based Architecture for Automating Quantity Surveying Construction Cost Calculation. 5. 45. 10.3390/infrastructures5060045. 
- Lee, Pin-Chan & Xie, Wei & Lo, Tzu-Ping & Long, Danbing & Tang, Xiaofei. (2019). A Cloud Model-based Knowledge Mapping Method for Historic Building Maintenance based on Building Information Modelling and Ontology. KSCE Journal of Civil Engineering. 23. 10.1007/s12205-019-2457-0. 
- Zhang, Jisong & Zhao, Lihua & Ren, Guoqian & Li, Haijiang & Li, Xiaofei. (2020). Special Issue “Digital Twin Technology in the AEC Industry”. Advances in Civil Engineering. 2020. 1-18. 10.1155/2020/8842113. 
- Cao, Jianpeng & Hall, Daniel. (2020). Ontology-based Product Configuration for Modular Buildings. 10.22260/ISARC2020/0026. 
- L. Wu, P. Cui, J. Pei, and L. Zhao. Graph Neural Networks: Foundations, Frontiers, and Applications. Springer, Singapore, 2022
- Zhiyuan Liu and Jie Zhou(2020),  Introduction to Graph Neural Networks, Morgan & Claypool



# Andere interessante BIM und IFC Projekte

__[Speckle](https://speckle.systems/)__  

Eine innovative Open Source Lösung zur Echtzeit-Kommunikation von 3D Designs.
Mittels nodejs streams, sockets und an Git angelehnten Konzeption können Nutzer
an Speckle Streams partizipieren. Es können ganze Modelle oder auch nur Teile in
einen Stream per »commit« samt Nachricht gepusht werden. Die Speckle
Entwickler-Community stellt für viele wichtige CAD Autorensoftware Konnektoren
bereit (AutoCAD, Rhino, Unreal, Blender, Unity). 

__[BlenderBIM](https://blenderbim.org/)__

BlenderBIM ist gestartet als heroischer Alleingang von Dion Moult, der auszog
den IFC Standard als native Datenstruktur in Blender zu implementieren. Auf
Basis von Blender ist dabei ein sehr ernstzunehmendes Open Source BIM Werkzeug
entstanden, das IFC besser unterstützt als jegliche kommerzielle Plattform. 

Das Projekt wurde inzwischen von der Organisation, die IFC wesentlich
vorantreibt mit dem Building Smart Award 2020 ausgezeichnet, wird vom Epic
MegaGrants und Google Summer of Code unterstützt.

__[ifc.js](https://ifcjs.github.io/info/)__

BIM und IFC Toolkit für Javascript. Kaum eine Plattform zu BIM/IFC, sei es
kommerziell oder Open Source kommt ganz ohne diese Bibliothek aus. 

__[ifcOpenShell](http://ifcopenshell.org/)__

IfcOpenShell ist eine extrem nützliche und low level Bibliothek für C++ und
Python. Das oben erwähnte BlenderBIM nutzt diese Bibliothek bzw. befruchten sich
die Projekte mittlerweile gegenseitig.


