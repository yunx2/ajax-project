// function setSearch(type, creature) {

//   // changeView('find');
// }

const $aboutList = document.querySelector('.about-list');

$aboutList.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  const type = e.target.getAttribute('data-type');
  $selectControl.value = type;
  $textControl.value = e.target.id;
  // console.log('target id', e.target.id);
  setIcon(type);
  // setSearch(type, e.target.id)
  data.view = 'find';
  displayView();
});
