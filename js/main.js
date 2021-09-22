// const baseUrl = 'https://acnhapi.com/v1/'
const $find = document.getElementById('find');
// const $input = document.getElementById('find-input');
// const $select = document.getElementById('select-creature')
const $form = document.getElementById('form');
// const $findView = document.getElementById('find-view')
const $message = document.getElementById('message');

const request = new XMLHttpRequest();
request.responseType = 'json';
request.addEventListener('load', e => {
  // inside this event listener, guaranteed to have response data
  data.response = request.response;
  console.log('response:', request.response);
  if (data.response) {
    // handle response

  } else {
    // show not found message
    $message.textContent = `No information about '${data.creature}'. Try again.`;
    $message.classList.remove('hidden');
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
