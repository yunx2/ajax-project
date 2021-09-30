const $north = document.getElementById('north');
const $south = document.getElementById('south');

function checkAvailability(hemisphere) {
  if (data.response.availability.isAllYear) {
    return true;
  }
  const currentMonth = new Date().getMonth() + 1;
  const availability = data.response.availability[`month-array-${hemisphere}`];
  return availability.includes(currentMonth);
}

function displayAvailable(availability, node) {
  if (availability) {
    node.textContent = 'YES';
  } else {
    node.textContent = 'NO';
  }
}

function capitalizeInitial(str) {
  const words = str.split(' ');
  const capitalized = [];
  words.forEach(word => {
    const first = word[0].toUpperCase();
    const rest = word.slice(1);
    capitalized.push(first + rest);
  });
  return capitalized.join(' ');
}

function setResultView() {
  const creatureName = data.response.name['name-USen'];
  data.displayName = capitalizeInitial(creatureName);
  $resultImg.setAttribute('src', data.response.icon_uri);
  $resultImg.setAttribute('alt', data.displayName);
  $resultName.textContent = data.displayName;
  const availableNorth = checkAvailability('northern');
  const availableSouth = checkAvailability('southern');
  displayAvailable(availableNorth, $north);
  displayAvailable(availableSouth, $south);
}
