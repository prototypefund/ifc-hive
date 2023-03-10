# Data Fixtures

The API needs some starting data for it operations. In addition a development
might want a basic scenario during development, where most if not all
key-concepts are manifested in form of data objects present in database, search
index.

This directory contains data objects with human-friendly placeholders for the
UUID's. The placeholders will be replaced by actual UUID's which are generated
during the import. 

Wherever the data-model requires an optional or required reference to another
object, simply use the `idMap.js` to look up placeholders or to add new
mappings. 

You have to make sure that the references are pointing to the appropriate
collections, i. e. as specified in the mongoose models.

## Example

```javascript
/* idMap.js */

export default {
  //...
  userAnton: uuidv4(),
  ///...
  orgaKunde1: uuidv4(),
  //..
}
```

```javascript
/* core_user.js js */

export default {
  //...
  [
    {
      _id: 'userAnton',
      nickname: 'Anton',
      organization: 'orgaKunde1' // reference to a different object
    }
  ]
```
