<template></template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  inject: ["$store"],
  data: () => ({
    tags: [
      {
        title: "todo",
        type: "status",
        color: "#2DCECEED",
      },
      {
        title: "doing",
        type: "status",
        color: "#A9F576",
        locked: 0,
      },
      {
        title: "schmieren",
        type: "status",
        color: "#EB8AE9",
        locked: 0,
      },
      {
        title: "test",
        type: "status",
        color: "#B71C1C",
        locked: 0,
      },
      {
        title: "qa",
        type: "status",
        color: "#4250DA",
        locked: 0,
        tags: ["tag-doing"],
      },
      {
        title: "done",
        type: "status",
        color: "#147419",
        locked: 0,
      },
      {
        title: "dingens",
        type: "milestone",
        color: "#D84315",
        locked: 1,
      },
    ],
    user: [
      {
        firstname: "Sebastian",
        lastname: "Mc Testface",
        nickname: "ralf",
        email: "Sebastian@Testmichdurch.com",
        organisation: "org-dummy", // Type organization
        active: true,
        tags: ["tag-todo"],
        avatar: {
          file: "/user/sebastian.png",
          mimetype: "image/PNG",
          size: 1231233,
          originalName: "sebastian.png",
        },
      },
      {
        firstname: "Jan",
        lastname: "Schukat",
        nickname: "imbacile",
        email: "imbacile@pacifico.org",
        organisation: "org-dummy", // Type organization
        tags: ["tag-todo"],
        active: true,
        avatar: {
          file: "/user/jan.png",
          mimetype: "image/PNG",
          size: 1231233,
          originalName: "jan.png",
        },
      },
      {
        firstname: "Daniel",
        lastname: "Kaminski",
        nickname: "jurand",
        email: "jurand@pacifico.org",
        organisation: "org-dummy", // Type organization
        active: true,
        avatar: {
          file: "/user/daniel.png",
          mimetype: "image/PNG",
          size: 1231233,
          originalName: "daniel.png",
        },
      },
      {
        firstname: "Christian",
        lastname: "Silbermann",
        nickname: "cptKarpfen",
        email: "karpfen@pacifico.org",
        organisation: "org-dummy", // Type organization
        active: true,
        avatar: {
          file: "user/christian.png",
          mimetype: "image/PNG",
          size: 1231233,
          originalName: "christian.png",
        },
      },
      {
        firstname: "Till",
        lastname: "Pliestermann",
        nickname: "derMitDemPliesterMann",
        email: "derMitDemPliesterMann@pacifico.org",
        organisation: "org-dummy", // Type organization
        active: true,
        avatar: {
          file: "/user/till.png",
          mimetype: "image/PNG",
          size: 1231233,
          originalName: "till.png",
        },
      },
    ],
    memo: [
      {
        title: "Test Memo 1",
        path: false, // materialized path
        project: 2,
        body: {
          time: 1675761665085,
          blocks: [
            {
              id: "mhTl6ghSkV",
              type: "paragraph",
              data: {
                text: "I'm a simple paragraph, I can contain bold",
              },
            },
            {
              id: "l98dyx3yjb",
              type: "header",
              data: {
                text: "Key features",
                level: 3,
              },
            },
            {
              id: "234987234",
              type: "list",
              data: {
                type: "unordered",
                items: [
                  "First unordered list item",
                  "second unordered list item",
                  "third unordered list item",
                ],
              },
            },
            {
              id: "665348756",
              type: "attaches",
              data: {
                url: "path/to/attachment.pdf",
                size: 12345,
                name: "my-attachment.pdf",
                extension: "pdf",
              },
              title: "My Attachment",
            },
            {
              id: "775634589",
              type: "image",
              data: {
                file: { url: "/path/to/image.png" },
                withBorder: false,
                withBackground: false,
                streched: true,
                caption: "Some info for my image",
              },
            },
            {
              type: "checklist",
              data: {
                items: [
                  {
                    text: "This is a block-styled editor",
                    checked: true,
                  },
                  {
                    text: "Clean output data",
                    checked: false,
                  },
                  {
                    text: "Simple and powerful API",
                    checked: true,
                  },
                ],
              },
            },
            {
              type: "delimiter",
              data: {},
            },
            {
              type: "quote",
              data: {
                text: "The unexamined life is not worth living.",
                caption: "Socrates",
                alignment: "left",
              },
            },
            {
              type: "alert",
              data: {
                type: "danger",
                text:
                  "<strong>Holy smokes!</strong><br>Something seriously <em>bad</em> happened.",
              },
            },
          ],
        },
        closed: false, // default false
        tags: ["test", "tag-dingens"], // Type Tag
        owner: "user-jurand",
        assigned: "user-cptKarpfen", // User object
        approvals: {
          user: "user-jurand", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
      {
        title: "eine geschmiert bekommen",
        path: false, // materialized path
        project: 2,
        body: {}, // block
        closed: true, // default false
        tags: ["test", "tag-dingens", "tag-schmieren"], // Type Tag
        owner: "user-jurand",
        assigned: "user-cptKarpfen", // User object
        approvals: {
          user: "user-jurand", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
      {
        title: "Widgets fertig machen",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-doing", "test"], // Type Tag
        owner: "user-cptKarpfen",
        assigned: "user-jurand", // User object
        approvals: {},
      },
      {
        title: "cool sein",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-done", "test"], // Type Tag
        owner: "user-cptKarpfen",
        assigned: "user-cptKarpfen", // User object
        approvals: {},
      },
      {
        title: "dem Olaf eine schmieren",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["test", "olaf", "tag-schmieren"], // Type Tag
        owner: "user-cptKarpfen",
        assigned: "user-cptKarpfen", // User object
        approvals: {},
      },
      {
        title: "Salami in die Küche werfen",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-qa", "salami", "werfen", "waffen", "küche"], // Type Tag
        owner: "user-imbacile",
        assigned: "user-imbacile", // User object
        approvals: {
          user: "user-cptKarpfen", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
      {
        title: "in die küche geworfene salami weg schnabbulieren",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-test", "küche", "schnabbulation"], // Type Tag
        owner: "user-imbacile",
        assigned: "user-imbacile", // User object
        approvals: {
          user: "user-cptKarpfen", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
      {
        title: "sich mit dem Thema 'schmieren' auseinander setzen",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-todo", "test", "tag-schmieren", "weiterbildung"], // Type Tag
        owner: "user-imbacile",
        assigned: "user-imbacile", // User object
        approvals: {
          user: "user-cptKarpfen", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
      {
        title: "Dem Peter eine schmieren",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-qa", "test", "tag-schmieren"], // Type Tag
        owner: "user-imbacile",
        assigned: "user-imbacile", // User object
        approvals: {
          user: "user-cptKarpfen", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
      {
        title: "Salami konsistenz prüfen",
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: ["tag-test", "test", "salami"], // Type Tag
        owner: "user-imbacile",
        assigned: "user-derMitDemPliesterMann", // User object
        approvals: {
          user: "user-imbacile", // uuid user
          answer: null, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
    ],
  }),
  created() {
    this.$store.dispatch({
      type: "data/push",
      payload: {
        data: this.makeDataList(this.tags, "tag"),
      },
    });
    this.$store.dispatch({
      type: "data/push",
      payload: {
        data: this.makeDataList(this.user, "user"),
      },
    });
    this.$store.dispatch({
      type: "data/push",
      payload: {
        data: this.makeDataList(this.memo, "memo"),
      },
    });
  },
  destroyed() { },
  methods: {
    getRandomArbitrary: function (min, max) {
      return Math.random() * (max - min) + min;
    },
    makeDataList: function (source, dataType) {
      const dataList = [];
      source.forEach((source) => {
        if (dataType === "tag") {
          dataList.push(this.makeDummyTag(source));
        }
        if (dataType === "memo") {
          dataList.push(this.makeDummyMemo(source));
        }
        if (dataType === "user") {
          dataList.push(this.makeDummyUser(source));
        }
      });
      return dataList;
    },
    makeDummyTag: function (data) {
      return {
        _id: "tag-" + data.title,
        _type: "tag",
        _disId: "faaaaaaaake",
        _project: false,
        _title: data.title,
        _source: {
          title: data.title,
          type: data.type,
          color: data.color,
          tags: data.tags || [],
          locked: 0,
        },
      };
    },
    makeDummyUser: function (data) {
      return {
        _id: "user-" + data.nickname,
        _type: "user",
        _path: false,
        _disId: "faaaaaaaake",
        _title: `${data.firstname} ${data.lastname} @${data.email}`, // Nickname (email)  Organization
        _source: {
          firstname: data.firstname,
          lastname: data.lastname,
          nickname: data.nickname,
          email: data.email,
          organisation: data.organization, // Type organization
          active: data.active,
          tags: data.tags || [],
          avatar: data.avatar || {},
        },
      };
    },
    makeDummyMemo: function (data) {
      let created = new Date();
      const modified = new Date();
      const due = new Date();
      created.setDate(created.getDate() - this.getRandomArbitrary(20, 40));
      modified.setDate(created.getDate() - this.getRandomArbitrary(10, 20));
      due.setDate(modified.getDate() + this.getRandomArbitrary(2, 4));
      return {
        _id: "memo-" + uuidv4(), // UUID
        _path: false,
        _project: false,
        _type: "memo",
        _title: data.title,
        _created: created,
        _disId: "faaaaaaaake",
        _modified: modified,
        _source: {
          title: data.title,
          path: data.path, // materialized path
          project: data.project,
          body: data.body || {}, // block
          closed: data.closed, // default false
          tags: data.tags || [], // Type Tag
          created: created,
          modified: modified,
          due: due,
          owner: data.owner, // User object
          assigned: data.assigned, // User object
          approvals: data.approvals,
        },
      };
    },
  },
};
</script>
<style>

</style>
