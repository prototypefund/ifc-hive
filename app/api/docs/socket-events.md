# Socket Events

## Server Events
The server emits the following events for the client to listen to. 

### hello
A generic event in which the server acknowledges the client connection.
```javascript
const payload = {
  id: 'the-socket-client-id',
  tokenId: 'if-applicable-the-token-id'
}
```

### data 
Whenever the server sends primary application data objects to the client it
signals this to the 

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

See the [payload anatomy](./payload-anatomy.md) for primary data objects.


### join
The server informs the client that he just joined a room. 

```javascript
const payload = {
  room: 'id',
  type: 'project'
}
```

### leave

The server informs the client that the socket was just removed from a room.

```javascript
const payload = {
  room: 'id',
  type: 'project'
}
```


## Client Events

The client emits the following events for the server to listen to. 



