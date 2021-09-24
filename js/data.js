/* exported data */
let data = {
  view: 'find',
  response: null,
  creature: '',
  displayName: '',
  type: '',
  catchEntries: [],
  nextId: 1
};

function createCatchItem(entry) {
  const $li = document.createElement('li');
  $li.classList.add('catch-item');
  const $topRow = document.createElement('div');
  $topRow.classList.add('row');
  $topRow.classList.add('top-row');

  const $leftCol = document.createElement('div');
  const $img = document.createElement('img');
  $img.setAttribute('src', entry.creatureData.icon_uri);
  $img.setAttribute('alt', entry.creatureName);
  $leftCol.classList.add('column-third');
  $leftCol.classList.add('col-left');
  $leftCol.append($img);

  const $midCol = document.createElement('div');
  $midCol.classList.add('column-third');
  $midCol.classList.add('col-mid');
  const $name = document.createElement('p');
  $name.textContent = entry.creatureName;
  $name.classList.add('list-item-title');
  $midCol.append($name);

  const $rightCol = document.createElement('div');
  const $check = document.createElement('input');
  $check.setAttribute('type', 'checkbox');
  const $caught = document.createElement('span');
  $caught.className = 'caught-check';
  $caught.textContent = 'Caught!';
  const $label = document.createElement('label');
  $label.append($caught, $check);
  $rightCol.classList.add('column-third');
  $rightCol.classList.add('col-right');
  $rightCol.append($label);
  $topRow.append($leftCol, $midCol, $rightCol);

  const $bottomRow = document.createElement('div');
  $bottomRow.className = 'row';
  const $commentsRow = document.createElement('div');
  $commentsRow.classList.add('column-full');
  $commentsRow.classList.add('comments-row');
  $bottomRow.append($commentsRow);
  const $comments = document.createElement('span');
  $comments.textContent = 'Comment:';
  const $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.className = 'btn-edit';
  $button.innerHTML = '<i class="fas fa-pen"></i>';
  $commentsRow.append($comments, $button);
  $li.append($topRow, $bottomRow);
  // console.log($li);
  return $li;
}
const $catchList = document.getElementById('catch-entries'); // the ul element that list items get appended to
function setCatchList() {
  if (data.catchList.length === 0) {
    // create $message element and append to $catchlist
    const $message = document.createElement('p');
    $message.textContent = 'There\'s nothing here yet...';
    $message.id = 'message-list';
    $catchList.append($message);

  } else {
    // remove any items that are already set
    $catchList.innerHTML = '';
    // set items again from catchlist
    // document.getElementById('message-list').classList.add('hidden');
    // console.log('items to add:', data.catchList)
    data.catchList.forEach(current => {
      const $item = createCatchItem(current);
      // console.log($item)
      $catchList.append($item);
    });
  }
}

const viewsList = document.querySelectorAll('[data-view]');

function changeView(view) {
  // console.log('viewsList', viewsList)
  data.view = view;
  if (data.view === 'list') {
    setCatchList();
  }
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
