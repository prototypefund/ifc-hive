export default {
    "grid": {
        "type": "default",
        "items": "card",
        "columns": 2
    },
    "title": "the rolfness of life",
    "slots": [
        {
            "class": "SuperClasse",
            "column": 6,
            "widget": {
                "name": "debug",
                "uuid": "currPageDebug",
                "props": {
                    "title": "döner",
                    "type": "pages"
                }
            }
        },
        {
            "class": "nice",
            "column": 6,
            "widget": {
                "name": "form",
                "props": {
                    "title": "anderer blablablab",
                    "query": {
                        "q": "ich bin voll die andere query",
                        "filter": "und ich bin ein anderer Filter!"
                    }
                }
            }
        }
    ]
}