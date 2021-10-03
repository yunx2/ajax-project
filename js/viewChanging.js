const $form = document.getElementById('form');
const viewsList = document.querySelectorAll('[data-view]');

function setIcon(type) {
  switch (type) {
      case 'fish':
        $typeImage.setAttribute('src', 'images/FishButton.png');
        $typeImage.setAttribute('alt', 'fish');
        break;
      case 'bugs':
        $typeImage.setAttribute('src', 'images/BugButton.png');
        $typeImage.setAttribute('alt', 'bugs');
        break;
      case 'sea':
        $typeImage.setAttribute('src', 'images/SeaCreatureButton.png');
        $typeImage.setAttribute('alt', 'sea-creatures');
        break;
    }
}

function displayView() {
  for (let i = 0; i < viewsList.length; i++) {
    const $view = viewsList[i];
    if ($view.getAttribute('data-view') === data.view) {
      $view.classList.remove('hidden');
      $view.scrollIntoView();
    } else {
      $view.classList.add('hidden');
    }
  }
}

function changeView(view) {
   data.view = view;
     // set catch list before switching to list view
  if (data.view === 'list') {
    setCatchList();
  }
  // set creature details before switching to detail view
  if (data.view === 'details') {
    fillDetails();
  }
  if (data.view === 'find') {
    $form.reset();
    setIcon('fish');
  }
  displayView();
}
