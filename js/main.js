const $message = document.getElementById('message');
const $resultName = document.getElementById('result-name');
const $resultImg = document.querySelector('.result-image');
const $details = document.getElementById('details');
const $resultsAdd = document.getElementById('results-add');
const $detailsAdd = document.getElementById('add-details');
const $headingButton = document.getElementById('btn-heading');
const $notifications = document.getElementById('notifications');
const $editButtonsContainer = document.getElementById('edit-buttons');
const $comment = document.querySelector('.comment-text');
const $editModal = document.getElementById('edit-view');
const $confirmModal = document.getElementById('confirm-view');
const $confirmButtons = document.getElementById('confirm-buttons');
const $typeImage = document.getElementById('critterpedia');
const $selectControl =  document.getElementById('select-creature');
const $textControl = document.querySelector('.find-input');

const $nav = document.querySelector('.navigation');
$nav.addEventListener('click', e => {
  if (e.target.id === 'home') {
    changeView('find');
  }
  if (e.target.id === 'catch') {
    changeView('list');
  }
  if (e.target.id === 'about') {
    changeView('about');
  }
});

document.addEventListener('DOMContentLoaded', e => {
  const dataJSON = localStorage.getItem('dataJSON');
  if (dataJSON) {
    data = JSON.parse(dataJSON);
    changeView('find');
  }
});

window.addEventListener('beforeunload', () => {
  data.creature = null;
  data.type = null;
  data.editing = null;
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('dataJSON', dataJSON);
});

$catchList.addEventListener('click', e => { // prepopulate text area if comment exists; open edit modal
  if (e.target.tagName === 'I' || e.target.tagName === 'BUTTON') {
    const $closest = e.target.closest('li');
    const itemId = $closest.getAttribute('data-id');
    const creature = data.catchList.find(item => item.id == itemId);
    if (e.target.className === 'list-item-title') {
      data.response = creature.creatureData;
      data.displayName = creature.creatureName;
      changeView('details');
    } else {
      data.editing = creature;
      if (data.editing.comment) {
        $comment.value = data.editing.comment;
      } else {
        $comment.value = null;
      }
      $editModal.showModal();
    }
  }
});

function handleEdit() {
  if (data.editing.comment !== $comment.value) {
    data.editing.comment = $comment.value;
    const newCatchList = removeFromCatchList(data.editing.id);
    newCatchList.unshift(data.editing);
    data.catchList = newCatchList;
    const $edited = createCatchItem(data.editing);
    const $original = document.querySelector(`[data-id='${data.editing.id}']`);
    $original.remove();
    $catchList.prepend($edited);
  }
  data.editing = null;
}

$editButtonsContainer.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  if (e.target.id === 'btn-done') {
    handleEdit();
  }
  $editModal.close();
  $catchList.scrollIntoView();
});

function handleCheck({ target }) {
  if (target.tagName !== 'BUTTON') {
    return;
  }
  const $toDelete = data.editing;
  const id = $toDelete.getAttribute('data-id');
  if (target.id === 'confirm-delete') {
    $toDelete.remove();
    data.catchList = data.catchList.filter(item => item.id != id);
  } else {
    document.getElementById(id).checked = false;
  }
  data.editing = null;
  $confirmModal.close();
}
$confirmButtons.addEventListener('click', e => handleCheck(e));

$catchList.addEventListener('input', e => {
  const $toDelete = document.querySelector(`[data-id='${e.target.id}']`);
  const creatureName = $toDelete.getAttribute('data-creature');
  const $text = document.querySelector('.confirm-text');
  $text.textContent = `Remove ${creatureName} from the To-Catch list?`;
  $confirmModal.showModal();
  data.editing = $toDelete;
});

$headingButton.addEventListener('click', () => {
  changeView('find');
});

function isAdded() {
  const catchItem = data.catchList.find(item => item.creatureName === data.displayName);
  return Boolean(catchItem);
}

function showNotification(message) {
  $notifications.textContent = message;
  setTimeout(showNotification, 2000, '');
}

function handleAdd() {
  if (isAdded()) {
    const msg = `${data.displayName} already added`;
    showNotification(msg);
    return;
  }
  const catchItem = {
    id: data.nextId,
    creatureName: data.displayName,
    creatureData: data.response,
    comment: ''
  };
  data.nextId++;
  data.catchList.unshift(catchItem);
  changeView('list');
}

$resultsAdd.addEventListener('click', handleAdd);
$detailsAdd.addEventListener('click', handleAdd);

$details.addEventListener('click', e => {
  fillDetails();
  changeView('details');
});

const $spinner = document.getElementById('spinner');

const request = new XMLHttpRequest();
request.responseType = 'json';

function handleResponse(e) {
  $spinner.classList.add('hidden');
  data.response = request.response;
  if (data.response) {
    $message.textContent = null;
    setResultView();
    changeView('result');
  }
}

function setMessage() {
  let type;
  if (data.type === 'bugs') {
    type = 'bug';
  }
  if (data.type === 'sea') {
    type = 'sea creature';
  }
  if (data.type === 'fish') {
    type = 'fish';
  }
  $message.innerHTML = `No information found. Are you sure <span class="text-pink">${data.creature}</span> is a <span class="text-green">${type}</span>?`;
}

// called when response recieved
request.addEventListener('load', e => {
  // hide spinner because response received
  $spinner.classList.add('hidden');
  data.response = request.response;
  if (data.response) {
    $message.textContent = null;
    handleResponse();
  } else {
    setMessage();
  }
  $typeImage.setAttribute('src', 'images/FishButton.png');
  $typeImage.setAttribute('alt', 'critterpedia');
  $form.reset();
});

function createUrl(type, creature) {
  const name = creature.toLowerCase();
  data.type = type;
  const noSpaces = name.replaceAll(' ', '_');
  data.creature = noSpaces.replaceAll("'", '');
  return `https://acnhapi.com/v1/${data.type}/${data.creature}`;
}

// api call made here
function handleFind(e) {
  e.preventDefault();
  $message.innerHTML = '';
  const textInput = $textControl.value.trim();
  if (textInput) {
    const endpoint = createUrl($selectControl.value, textInput);
    $resultImg.setAttribute('src', null);
    $resultImg.setAttribute('alt', null);
    $resultName.textContent = null;
    request.open('GET', endpoint);
    $spinner.classList.remove('hidden');
    request.send();
  }
}

$form.addEventListener('submit', e => {
  handleFind(e);
});

function setIcon(type) {
  switch (type) {
      case 'fish':
        $typeImage.setAttribute('src', 'images/FishButton.png');
        $typeImage.setAttribute('alt', 'fish');
        break;
      case 'bugs':
        $typeImage.setAttribute('src', 'images/BugButton.png');
        $typeImage.setAttribute('alt', 'bugs');
        break;
      case 'sea':
        $typeImage.setAttribute('src', 'images/SeaCreatureButton.png');
        $typeImage.setAttribute('alt', 'sea-creatures');
        break;
    }
}

$selectControl.addEventListener('input', e => {
  const type = $selectControl.value;
  setIcon(type);
});
