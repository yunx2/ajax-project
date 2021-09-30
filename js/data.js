// first script tag links to this
// load data object into memory

/* exported data */
let data = {
  view: 'find',
  response: null,
  creature: '',
  displayName: '',
  type: '',
  catchList: [],
  nextId: 1,
  editing: null
};
const $catchList = document.getElementById('catch-entries'); // the ul element that list items get appended to
