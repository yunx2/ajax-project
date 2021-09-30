
function setState(catchList = [], view = 'find') {
  data = {
    view,
    catchList,
    nextId: catchList.length + 1
  };
  const stateJSON = JSON.stringify(data);
  localStorage.setItem('dataJSON', stateJSON);
  window.location.reload();
}

function getResultView() {
  const req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', 'https://acnhapi.com/v1/fish/carp');
  req.addEventListener('load', e => {
  data.response = req.response;
  setResultView();
  changeView('result');
  });
  req.send();
}
