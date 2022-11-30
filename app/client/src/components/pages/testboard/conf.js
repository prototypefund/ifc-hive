export default {
    "grid": {
        "type": "default",
        "items": "card",
        "columns": 2
    },
    "title": "testSpaß für Groß und klein",
    "slots": [
        {
            "column": 6,
            "widget": {
                "name": "detail",
                "face": "user",
                "props": {
                    "title": "Detail Ansicht"
                }
            }
        },
        {
            "column": 6,
            "widget": {
                "uuid": "currPageDebug",
                "name": "debug",
                "props": {
                    "title": "döner",
                    "type": "currentPage"
                }
            }
        },
        {
            "class": "huhu",
            "column": 12,
            "widget": {
                "name": "timeline",
                "props": {
                    "title": "anderer Titel",
                    "query": {
                        "q": "ich bin voll die andere query",
                        "filter": "und ich bin ein anderer Filter!"
                    }
                }
            }
        }
    ],
    "count": 0
}