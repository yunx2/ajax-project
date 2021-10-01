const $form = document.getElementById('form');
const $message = document.getElementById('message');
const $resultName = document.getElementById('result-name');
const $resultImg = document.querySelector('.result-image');
const $details = document.getElementById('details');
const $resultsAdd = document.getElementById('results-add');
const $detailsAdd = document.getElementById('add-details');
const $catchListButton = document.getElementById('btn-catch');
const $headingButton = document.getElementById('btn-heading');
const $notifications = document.getElementById('notifications');
const $editButtonsContainer = document.getElementById('edit-buttons'); // contains 'done' and 'cancel' buttons on edit modal
const $comment = document.querySelector('.comment-text');
const $editModal = document.getElementById('edit-view');
const $confirmModal = document.getElementById('confirm-view');
const $confirmButtons = document.getElementById('confirm-buttons'); // contains 'confirm' and 'cancel' buttons on delete modal

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
      // switch to detail view
      data.response = creature.creatureData;
      data.displayName = creature.creatureName;
      changeView('details');
    } else {
      // do comment things
      data.editing = creature;
      // determine if editing comment or adding comment
      // check if there is already a comment
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
  // only do edit things if the comment has been changed
  if (data.editing.comment !== $comment.value) {
    // set new comment value
    data.editing.comment = $comment.value;
    // find and remove from catchList
    const newCatchList = removeFromCatchList(data.editing.id);
    newCatchList.unshift(data.editing);
    data.catchList = newCatchList;
    const $edited = createCatchItem(data.editing);
    // change DOM to reflect changes in data.
    const $original = document.querySelector(`[data-id='${data.editing.id}']`);
    $original.remove();
    $catchList.prepend($edited);
  }
  data.editing = null;
}

$editButtonsContainer.addEventListener('click', e => {
  // only respond to button clicks
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  // do edit things
  if (e.target.id === 'btn-done') {
    handleEdit();
  }
  // close modal
  $editModal.close();
  $catchList.scrollIntoView();
});

function handleCheck({ target }) {
  if (target.tagName !== 'BUTTON') {
    // ignore anything that's not a button
    return;
  }
  const $toDelete = data.editing;
  const id = $toDelete.getAttribute('data-id');
  if (target.id === 'confirm-delete') {
    // do delete things
    $toDelete.remove();
    data.catchList = data.catchList.filter(item => item.id != id);
  } else {
    // uncheck checkbox
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

$catchListButton.addEventListener('click', () => {
  changeView('list');
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
  // if creature already in catchList return
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
// console.log('data.catchList:', data.catchList);
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
  // hide spinner because response received
  $spinner.classList.add('hidden');
  data.response = request.response;
  if (data.response) {
    $message.textContent = null;
    // set and change to result view
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

request.addEventListener('load', e => {
  // hide spinner because response received
  $spinner.classList.add('hidden');
  data.response = request.response;
  if (data.response) {
    // handle response
    $message.textContent = null;
    handleResponse();
  } else {
    // show not found message
    setMessage();
  }
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
  const $selectControl = e.target.elements.select;
  const $textControl = e.target.elements['text-input'];
  const textInput = $textControl.value.trim();
  if (textInput) {
    const endpoint = createUrl($selectControl.value, textInput);
    // remove previous results from results view
    $resultImg.setAttribute('src', null);
    $resultImg.setAttribute('alt', null);
    $resultName.textContent = null;
    // send request
    request.open('GET', endpoint);
    // show spinner because api call sent
    $spinner.classList.remove('hidden');
    request.send();
  }
}

$form.addEventListener('submit', e => {
  handleFind(e);
});
