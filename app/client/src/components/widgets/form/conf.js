export default {
    title: "testWidget default title",
    categories: ['category1', 'category2'],
    query: {
        filter: "ich tue dinge",
        q: "ralf"
    },
    // TODO move this to API
    data: {
        email: "lutz@maier.de",
        name: "meier test 12",
        firstname: "lutz hallo",

    },
    definitions: {
        email: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
          ],
          name: [
            v => !!v || 'Name is required',
            v => v.length <= 10 || 'Name must be less than 10 characters',
          ],
        firstname: [
            v => !!v || 'Name is required',
            v => v.length <= 20 || 'Name must be less than 10 characters',
        ],
    }
}
