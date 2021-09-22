// const baseUrl = 'https://acnhapi.com/v1/'
const $find = document.getElementById('find');
const $resultView = document.getElementById('result-view');
// const $select = document.getElementById('select-creature')
const $form = document.getElementById('form');
// const $findView = document.getElementById('find-view')
const $message = document.getElementById('message');
const $north = document.getElementById('north');
const $south = document.getElementById('south');
const $resultName = document.getElementById('result-name');
const $resultImg = document.querySelector('.result-image');

function checkAvailability(hemisphere) {
  if (data.response.availability.isAllYear) {
    return true;
  }
  const currentMonth = new Date().getMonth() + 1;
  console.log('month:', currentMonth)
  const availability = data.response.availability[`month-array-${hemisphere}`];
  console.log('availability:', availability)
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
  // inside this event listener, guaranteed to have response data
  data.response = request.response;
  // console.log('response:', request.response);
  if (data.response) {
    // handle response
    // console.log('yes there\'s data')
    // console.log('response:', data.response)
    $message.textContent = null;
    const creatureName = data.response['file-name'];
    $resultImg.setAttribute('src', data.response.image_uri);
    $resultImg.setAttribute('alt', creatureName);
    $resultName.textContent = creatureName.toUpperCase();

    const availableNorth = checkAvailability('northern');
    const availableSouth = checkAvailability('southern');
    // console.log('availableNorth:', availableNorth)
    // console.log('availableSouth:', availableSouth)
    displayAvailable(availableNorth, $north);
    displayAvailable(availableSouth, $south);
    $resultView.classList.remove('hidden');
    $resultView.scrollIntoView();
  } else {
    // show not found message
    $message.textContent = `No information about '${data.creature}'. Try again.`;
    // $message.classList.remove('hidden');
  }
});

function handleFind(e) {
  const $selectControl = $form.elements.select;
  const $textControl = $form.elements['text-input'];
  const type = $selectControl.value;
  data.creature = $textControl.value;
  request.open('GET', `https://acnhapi.com/v1/${type}/${$textControl.value}`);
  request.send();
//   console.log('value:', $selectControl.value)
//   console.log('value:', $textControl.value)
  // $form.reset();
}

$find.addEventListener('click', handleFind);
