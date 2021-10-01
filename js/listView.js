function createCatchItem(entry) {
  const $li = document.createElement('li');
  $li.classList.add('catch-item');
  $li.setAttribute('data-id', entry.id);
  $li.setAttribute('data-creature', entry.creatureName);
  const $topRow = document.createElement('div');
  $topRow.classList.add('row');
  $topRow.classList.add('top-row');

  const $leftCol = document.createElement('div');
  const $img = document.createElement('img');
  $img.setAttribute('src', entry.creatureData.icon_uri);
  $img.setAttribute('alt', entry.creatureName);
  $leftCol.classList.add('column-third');
  $leftCol.classList.add('col-left');
  $leftCol.append($img);

  const $midCol = document.createElement('div');
  $midCol.classList.add('column-third');
  $midCol.classList.add('col-mid');

  const $btn = document.createElement('button');
  // const $name = document.createElement('p');
  $btn.textContent = entry.creatureName;
  $btn.classList.add('list-item-title');
  // $btn.append($name);
  $midCol.append($btn);

  const $rightCol = document.createElement('div');
  const $check = document.createElement('input');
  $check.setAttribute('type', 'checkbox');
  $check.className = 'checkbox';
  $check.id = entry.id;
  const $caught = document.createElement('span');
  $caught.className = 'caught-check';
  $caught.textContent = 'Caught!';
  const $label = document.createElement('label');
  $label.append($caught, $check);
  $rightCol.classList.add('column-third');
  $rightCol.classList.add('col-right');
  $rightCol.append($label);
  $topRow.append($leftCol, $midCol, $rightCol);

  const $bottomRow = document.createElement('div');
  $bottomRow.classList.add('row');
  $bottomRow.classList.add('bottom-row');
  const $commentsRow = document.createElement('div');
  $commentsRow.classList.add('column-full');
  $commentsRow.classList.add('comments-row');
  $bottomRow.append($commentsRow);
  const $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.className = 'icon-edit';
  $button.innerHTML = '<i class="fas fa-pen"></i>';
  $commentsRow.append($button);
  if (entry.comment) {
    const $content = document.createElement('div');
    $content.className = 'column-full';
    $content.textContent = entry.comment;
    $bottomRow.append($content);
  }
  $li.append($topRow, $bottomRow);
  return $li;
}

function setCatchList() {
  // remove any items that are already set
  $catchList.innerHTML = '';
  if (data.catchList.length === 0) {
    // create $message element and append to $catchlist
    const $message = document.createElement('p');
    $message.textContent = 'There\'s nothing here yet...';
    $message.id = 'message-list';
    $catchList.append($message);
  } else {
    // remove any items that are already set
    $catchList.innerHTML = '';
    // set items again from catchlist
    data.catchList.forEach(current => {
      const $item = createCatchItem(current);
      // console.log($item)
      $catchList.append($item);
    });
  }
}

function removeFromCatchList(id) {
  const copy = data.catchList.slice();
  let index;
  for (let i = 0; i < copy.length; i++) {
    const item = copy[i];
    if (item.id == id) {
      index = i;
      break;
    }
  }
  copy.splice(index, 1);
  return copy;
}
