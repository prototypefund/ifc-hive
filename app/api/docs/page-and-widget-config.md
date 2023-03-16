# Page and Widget Config


```javascript

const config = {
  _id: 'id',
  _project: 'id',
  _configType: 'page|widget|tools', // page hat slotes oder ein object widget
  // config: { },  // ... siehe front-end widget and page minimal config
  // note for the ticketboard we need a sensible default config, i. e. some
  // predefined tags for the ticketboard. 
  _config: {
    _id: 'repeat id' 

    // only pages
    tools: [{ _id: '', page: 'parent._id' }]
    widgets: [],
    slots: [],
    grid: {} // 
  }


}

```

In Toplevel tools ist page immer false
In child-tools 

- ticketboard
- journald
- quicklists
- fileupload


