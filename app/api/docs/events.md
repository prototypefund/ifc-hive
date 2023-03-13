# Events

The api relies internally heavily on a global event bus as message broker to
achieve lose rather than tight coupling of components.

For the primary data objects there is a general [payload format](./payload-anatomy.md) which is used
both internally and also when sending data to the client (RestAPI or socket).

These are only internal event, see [Socket-Events](./socket-events.md) for
events and their expected payload for the client-server socket communication.

### `dataUpdate`

Signals update of a primary object.

**Payload**  
See the [payload anatomy](./payload-anatomy.md).

### `dataNew`

Signals new primary object. See the [payload anatomy](./payload-anatomy.md).

**Payload**  
See the [payload anatomy](./payload-anatomy.md).

### `serverStart`

### `serverClose`


### `dataNew`

### `dataDelete`

### `userLogin`

### `userLogout`

### `memoFileUpload`

### `memoFileDelete`

### `memoNew`

### `memoUpdate`

### `memoMove`

### `projectNew`

