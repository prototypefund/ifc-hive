# Payload Anatomy

The general format for exchanging primary data objects between components and
also between client and server is as follows. 

On the client-side we **always** expect these meta data to be present. On the
server-side it depends on the state in the life cycle of a request or process
which fields are already populated. 

Internally the server may handle more meta-data fiels when it passed objects
around. However those are never exposed to the client. 

Anything which gets pushed into the blockchain register should also follow this
format, be it primary objects or log objects.

```javascript
const payload = {
  _id: '23234',
  _type: 'objectType', // journal/ticket, core/user etc. note the namespace
  _disId: 'displayId', // generate by the server
  _project: 'projectId' // so we can quickly check read and write permissions
  _title: 'single field or compose of multiple fields',
  _path: 'id-1#id-2#', // optional, only relevant for memos and projects
  _source: {  } // false or object
}
```
