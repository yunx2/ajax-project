const $find = document.getElementById('find');
const $form = document.getElementById('form');
const $message = document.getElementById('message');
const $north = document.getElementById('north');
const $south = document.getElementById('south');
const $resultName = document.getElementById('result-name');
const $resultImg = document.querySelector('.result-image');
const $details = document.getElementById('details');
const $resultsAdd = document.getElementById('results-add');
const $detailsAdd = document.getElementById('add-details');
const $catchListButton = document.getElementById('btn-catch');
const $headingButton = document.getElementById('btn-heading');
const $notifications = document.getElementById('notifications');
const $editButtonsContainer = document.getElementById('edit-buttons');
const $comment = document.querySelector('.comment-text');
const $editModal = document.getElementById('edit-view');

$catchList.addEventListener('click', e => { // prepopulate text area if comment exists; open edit modal
  if (e.target.tagName === 'I' || e.target.tagName === 'BUTTON') {
    const $closest = e.target.closest('li');
    const itemId = $closest.getAttribute('data-id');
    data.editing = data.catchList.find(item => item.id == itemId);
    // determine if editing comment or adding comment
    if (data.editing.comment) {
      // console.log('this shoulve have a comment:', data.editing)
      $comment.value = data.editing.comment;
    } else {
      $comment.value = null;
    }
    $editModal.showModal();
  }
});

function removeFromCatchList(id) {
  const copy = data.catchList.slice();
  let index;
  for (let i = 0; i < copy.length; i++) {
    const item = copy[i];
    if (item.id == id) {
      index = i;
      break;
    }
  }
  copy.splice(index, 1);
  return copy;
}

function handleEdit() {
  // only do edit things if the comment has been changed
  if (data.editing.comment !== $comment.value) {
    // set new comment value
    data.editing.comment = $comment.value;
    // find and remove from catchList
    const newCatchList = removeFromCatchList(data.editing.id)
    newCatchList.unshift(data.editing);
    data.catchList = newCatchList;
    console.log('data.catchList:', newCatchList);
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

function handleCheck(e) {
  const $toDelete = document.querySelector(`[data-id='${e.target.id}']`);
  $toDelete.remove();
  data.catchList = data.catchList.filter(item => item.id != e.target.id);
}

$catchList.addEventListener('input', e => handleCheck(e));

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
    console.log('already in list');
    const msg = `${data.displayName} already added`;
    showNotification(msg);
    return;
  }
  const catchItem = {
    id: data.nextId,
    creatureName: data.displayName,
    creatureData: data.response
  };
  data.nextId++;
  data.catchList.unshift(catchItem);
  changeView('list');
// console.log('data.catchList:', data.catchList);
}

$resultsAdd.addEventListener('click', handleAdd);
$detailsAdd.addEventListener('click', handleAdd);

function convertMonth(str) {
  const monthsObj = {
    1: 'January',
    2: 'Febrary',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };
  const months = str.split('-');
  const start = months[0]; const end = months[1];
  return `${monthsObj[start]} - ${monthsObj[end]}`;
}

function fillDetails() {
  const { availability, price, icon_uri } = data.response;
  const phrase = data.response['catch-phrase'];
  // const creatureName = name['name-USen'];
  // data.displayName = creatureName;
  document.getElementById('details-name').textContent = data.displayName.toUpperCase();
  const $detailsImg = document.getElementById('details-img');
  $detailsImg.setAttribute('src', icon_uri);
  $detailsImg.setAttribute('alt', data.displayName);
  document.getElementById('phrase').textContent = phrase;
  if (availability.location) {
    document.getElementById('location').textContent = availability.location;
  } else {
    document.getElementById('location').textContent = 'No data available.';
  }

  if (availability.rarity) {
    document.getElementById('rarity').textContent = availability.rarity;
  } else {
    document.getElementById('rarity').textContent = 'No data available.';
  }

  document.getElementById('price').textContent = price;
  if (availability.isAllYear) {
    document.getElementById('available-north').textContent = 'All year';
    document.getElementById('available-south').textContent = 'All year';
  } else {
    const monthsNorth = convertMonth(availability['month-northern']);
    const monthsSouth = convertMonth(availability['month-southern']);
    document.getElementById('available-north').textContent = monthsNorth;
    document.getElementById('available-south').textContent = monthsSouth;
  }
  if (availability.isAllDay || availability.time === '') {
    document.getElementById('time-of-day').textContent = 'All day';
  } else {
    document.getElementById('time-of-day').textContent = availability.time;
  }
}

$details.addEventListener('click', e => {
  fillDetails();
  changeView('details');
});

function checkAvailability(hemisphere) {
  if (data.response.availability.isAllYear) {
    return true;
  }
  const currentMonth = new Date().getMonth() + 1;
  const availability = data.response.availability[`month-array-${hemisphere}`];
  return availability.includes(currentMonth);
}

function displayAvailable(availability, node) {
  if (availability) {
    node.textContent = 'YES';
  } else {
    node.textContent = 'NO';
  }
}

function capitalizeInitial(str) {
  const words = str.split(' ');
  const capitalized = [];
  // console.log('words Array:', words);
  words.forEach(word => {
    const first = word[0].toUpperCase();
    // console.log('word:', word);
    const rest = word.slice(1);
    // console.log('sliced:', rest);
    capitalized.push(first + rest);
  });
  return capitalized.join(' ');
}

const request = new XMLHttpRequest();
request.responseType = 'json';
request.addEventListener('load', e => {
  // inside this event listener, guaranteed to have a response
  data.response = request.response;
  if (data.response) {
    // handle response
    $message.textContent = null;
    const creatureName = data.response.name['name-USen'];
    data.displayName = capitalizeInitial(creatureName);
    // console.log('name USen', data.displayName);
    $resultImg.setAttribute('src', data.response.icon_uri);
    $resultImg.setAttribute('alt', data.displayName);
    $resultName.textContent = creatureName.toUpperCase();
    const availableNorth = checkAvailability('northern');
    const availableSouth = checkAvailability('southern');
    displayAvailable(availableNorth, $north);
    displayAvailable(availableSouth, $south);
    changeView('result');
  } else {
    // show not found message
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
    $message.textContent = `No information about the ${type} '${data.creature}'. Try again.`;
  }
  $form.reset();
});

function handleFind(e) {
  // console.log('target',e.target)
  const $selectControl = $form.elements.select;
  const $textControl = $form.elements['text-input'];
  data.type = $selectControl.value;
  const name = $textControl.value.toLowerCase();
  const noSpaces = name.replace(' ', '_');
  data.creature = noSpaces.replaceAll("'", '');

  // remove previous results from results view
  $resultImg.setAttribute('src', null);
  $resultImg.setAttribute('alt', null);
  $resultName.textContent = null;
  // send request
  request.open('GET', `https://acnhapi.com/v1/${data.type}/${data.creature}`);
  request.send();
}

$find.addEventListener('click', e => handleFind(e));
