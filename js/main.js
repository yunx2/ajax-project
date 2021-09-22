const $find = document.getElementById('find');
const $resultView = document.getElementById('result-view');
const $form = document.getElementById('form');
const $message = document.getElementById('message');
const $north = document.getElementById('north');
const $south = document.getElementById('south');
const $resultName = document.getElementById('result-name');
const $resultImg = document.querySelector('.result-image');
const viewsList = document.querySelectorAll('[data-view]');
const $details = document.getElementById('details');


$details.addEventListener('click', e => {
  console.log('view:', viewsList);
  changeView('details');
})


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
    const creatureName = data.response['file-name'];
    $resultImg.setAttribute('src', data.response.icon_uri);
    $resultImg.setAttribute('alt', creatureName);
    $resultName.textContent = creatureName.toUpperCase();

    const availableNorth = checkAvailability('northern');
    const availableSouth = checkAvailability('southern');
    displayAvailable(availableNorth, $north);
    displayAvailable(availableSouth, $south);
   changeView('result')
    $resultView.scrollIntoView();
  } else {
    // show not found message
    $resultView.classList.add('hidden');
    $message.textContent = `No information about '${data.creature}'. Try again.`;
  }
  $form.reset();
});

function handleFind(e) {
  const $selectControl = $form.elements.select;
  const $textControl = $form.elements['text-input'];
  const type = $selectControl.value;
  data.creature = $textControl.value.toLowerCase();
  request.open('GET', `https://acnhapi.com/v1/${type}/${data.creature}`);
  request.send();
}

$find.addEventListener('click', handleFind);
