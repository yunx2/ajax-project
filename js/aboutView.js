
const $aboutList = document.querySelector('.about-list');

$aboutList.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  const type = e.target.getAttribute('data-type');
  $selectControl.value = type;
  $textControl.value = e.target.id;
  setIcon(type);
  data.view = 'find';
  displayView();
});
