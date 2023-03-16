export default [
  {
    _id: 'ticket_0',
    title: 'LP-1',
    project: 'projectClient',
    tags: ['tagMilestone'],
  },
  {
    _id: 'ticket_1',
    title: 'LP-2',
    project: 'projectClient',
    tags: ['tagImportant', 'tagToDo'],
  },
  {
    _id: 'ticket_2',
    title: 'Vorbereitung',
    parent: 'ticket_0',
    project: 'projectClient',
    tags: ['tagDoing'],
  },
  {
    _id: 'ticket_3',
    title: 'Brainstorming',
    parent: 'ticket_2',
    project: 'projectClient',
    tags: ['tagMilestone', 'tagRequirement'],
  },
  {
    _id: 'ticket_4',
    title: 'Gesprächsprotokoll',
    parent: 'ticket_2',
    project: 'projectClient',
    tags: ['tagDone', 'tagImportant'],
  },
  {
    _id: 'ticket_5',
    title: 'Ideensammlung',
    parent: 'ticket_0',
    project: 'projectClient',
    tags: ['tagDoing', 'tagRequirement', 'tagImportant'],
  },
  {
    _id: 'ticket_6',
    title: 'Konzeptentwurf',
    parent: 'ticket_5',
    project: 'projectClient',
    tags: [],
  }
]
