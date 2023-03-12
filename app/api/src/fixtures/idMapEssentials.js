/*
 * ID Map for fixtures
 *
 * In order to make it easier to model relationships between objects in the
 * fixtures we maintain a map of human-friendly ID's to actual UUID's for
 * the fixtures.
 */

export default [
  /* users */
  'userAnton',
  'userBerta',
  'userCaesar',

  /* organizations */
  'orgaBetreiber',
  'orgaPacifico',
  'orgaAcme',

  /* accounts */
  'accountDefault',

  /* tags */
  'tagMilestone',
  'tagImportant',
  'tagToDo',
  'tagDoing',
  'tagDone',
  'tagRequirement',

  /* projects */
  'projectFirst',
  'projectClient',

  /* permissions */
  'permUserAntonProjectClient',
  'permUserAntonAccountDefault',
] 
