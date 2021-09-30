
const viewsList = document.querySelectorAll('[data-view]');
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
  // hide all other views
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
