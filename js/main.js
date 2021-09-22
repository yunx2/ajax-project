const baseUrl = 'https://acnhapi.com/v1/'
const $find = document.getElementById('find');
const $input = document.getElementById('find-input');
const $select = document.getElementById('select-creature')
const $form = document.getElementById('form');

const request = new XMLHttpRequest();
request.responseType = 'json';
request.addEventListener('load', e => {
console.log('response:', request.response);
});

 function handleFind(e) {
  // console.log('form elements:', $form.elements)
  const $selectControl = $form.elements.select;
  const $textControl = $form.elements['text-input'];
  const type = $selectControl.value;
  const creature = $textControl.value;
  // console.log('endpoint:', `https://acnhapi.com/v1/${type}/${creature}`)
  request.open('GET', `https://acnhapi.com/v1/${type}/${creature}`);
  request.send();
//   console.log('value:', $selectControl.value)
//   console.log('value:', $textControl.value)
  $form.reset();
}

$find.addEventListener('click', handleFind);

  // console.log('response:', request.response);

// const $radio = document.querySelectorAll()
// console.log($form.elements['creature-type'])
