function setSearch(type, creature) {
  $selectControl.value = type;
  $textControl.value = creature;
  changeView('find');
}
