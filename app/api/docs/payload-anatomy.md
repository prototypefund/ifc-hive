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
  _id: 'uuid',
  _type: 'objectType', // journal/ticket, core/user etc. note the namespace
  _disId: 'displayId', // generate by the server
  _project: 'uuid' // so we can quickly check read and write permissions
  _title: 'single field or compose of multiple fields',
  _path: 'uuid#uuid#uuid', // optional, only relevant for memos and projects
  _requestId: 'uuid', 
  _source: { /* ... the actual object */ } // false or object
}
```


## Request ID

The request ID is handed through in the processing of a request. If the client
provides a `x-request-rd` header the provided ID will be used. Otherwise an ID
for request will be generated. The second case is mainly for logging and
debugging purposes. 
