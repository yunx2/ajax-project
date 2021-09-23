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
const $catchList = document.getElementById('catch-entries');

$headingButton.addEventListener('click', () => {
  changeView('find');
});

function handleAdd() {
  const catchItem = {
    id: data.nextId,
    creatureName: data.creature,
    creatureData: data.response
  };
  data.nextId++;
  data.catchEntries.push(catchItem);
console.log('data.catchEntries:', data.catchEntries);
}

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
  $leftCol.classList.add('colummn-third');
  $leftCol.append($img);
  const $midCol = document.createElement('div');
  $midCol.classList.add('colummn-third');
  $midCol.textContent = entry.creatureName;
  const $rightCol = document.createElement('div');
  const $check = document.createElement('input');
  $check.setAttribute('type', 'checkbox');
  const $caught = document.createElement('span');
  $caught.textContent = 'Caught!';
  const $label = document.createElement('label');
  $label.append($caught, $check);
  $rightCol.classList.add('colummn-third');
  $rightCol.append($label);
  $topRow.append($leftCol, $midCol, $rightCol);
  console.log($topRow);
}
function setCatchList() {
  if (data.catchEntries.length === 0) {
    document.getElementById('message-list').classList.remove('hidden');
  } else {
    // data.catchEntries.forEach(current => {
    //   const $item = createCatchItem(current);
    //   console.log($item)
    //   // $catchList.append($item);
     createCatchItem({creatureName: 'Carp',
     creatureData: { icon_uri: 'https://acnhapi.com/v1/icons/fish/5' }
    })
    // });
  }
}

$catchListButton.addEventListener('click', (e) => {
  e.preventDefault();
  changeView('list');
  setCatchList()
});

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
  const { name, availability, price, icon_uri } = data.response;
  const phrase = data.response['catch-phrase'];
  const creatureName = name['name-USen'];
  document.getElementById('details-name').textContent = creatureName.toUpperCase();
  const $detailsImg = document.getElementById('details-img');
  $detailsImg.setAttribute('src', icon_uri);
  $detailsImg.setAttribute('alt', creatureName);
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

const request = new XMLHttpRequest();
request.responseType = 'json';
request.addEventListener('load', e => {
  // inside this event listener, guaranteed to have a response
  data.response = request.response;
  if (data.response) {
    // handle response
    $message.textContent = null;
    const creatureName = data.response.name['name-USen'];
    $resultImg.setAttribute('src', data.response.icon_uri);
    $resultImg.setAttribute('alt', creatureName);
    $resultName.textContent = creatureName.toUpperCase();

    const availableNorth = checkAvailability('northern');
    const availableSouth = checkAvailability('southern');
    displayAvailable(availableNorth, $north);
    displayAvailable(availableSouth, $south);
    changeView('result');
  } else {
    // show not found message
    $message.textContent = `No information about '${data.creature}'. Try again.`;
  }
  $form.reset();
});

function handleFind(e) {
  // console.log('target',e.target)
  const $selectControl = $form.elements.select;
  const $textControl = $form.elements['text-input'];
  data.type = $selectControl.value;
  const name = $textControl.value.toLowerCase();
  data.creature = name.replaceAll(' ', '_');
  request.open('GET', `https://acnhapi.com/v1/${data.type}/${data.creature}`);
  request.send();
}

$find.addEventListener('click', e => handleFind(e));
