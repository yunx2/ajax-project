/* exported data */
const data = {
  view: 'find',
  response: null,
  creature: '',
  type: '',
  catchEntries: [],
  nextId: 1
};

const viewsList = document.querySelectorAll('[data-view]');

function changeView(view) {
  data.view = view;
  for (let i = 0; i < viewsList.length; i++) {
    const $view = viewsList[i];
    if ($view.getAttribute('data-view') === data.view) {
      $view.classList.remove('hidden');
      $view.scrollIntoView();
    } else {
      $view.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', e => {
  // changeView('find');
});
