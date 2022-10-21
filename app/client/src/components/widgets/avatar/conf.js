import { v4 as uuidv4 } from 'uuid';


export default {
    title: "testWidget default title",
    categories: ['category1', 'category2'],
    query: {
        filter: "ich tue dinge",
        q: "ralf"
    },
    entries: {
        email: { content: "", category: { color: 'warning', title: 'Baudokumentation' }, },
        name: { content: "myname", category: { color: 'warning', title: 'Baudokumentation' }, },
    }
}
