/* exported data */
let data = {
  view: 'find',
  response: null,
  creature: '',
  type: '',
  catchEntries: [],
  nextId: 1
};

const viewsList = document.querySelectorAll('[data-view]');

function changeView(view) {
  // console.log('viewsList', viewsList)
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
  changeView('find');
  const dataJSON = localStorage.getItem('dataJSON');
  if (dataJSON) {
    data = JSON.parse(dataJSON);
  }
});

window.addEventListener('beforeunload', ()=> {
  data.creature = null;
  data.type = null;
  data.view = 'find';
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('dataJSON', dataJSON);
});

function setState(catchList = [], view = 'find') {
  data = {
    view,
    catchList,
    nextId: catchList.length + 1
  };
  const stateJSON = JSON.stringify(data);
  localStorage.setItem('dataJSON', stateJSON);
  window.location.reload();
}
