function setSearch(type, creature) {
  $selectControl.value = type;
  $textControl.value = creature;
  changeView('find');
}

const $aboutList = document.querySelector('.about-list');

$aboutList.addEventListener('click', e => {
  // console.log('target', e.target)
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  const type = e.target.getAttribute('data-type');
  // console.log('target id', e.target.id);
  setSearch(type, e.target.id)
});
