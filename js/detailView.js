
function convertMonth(str) {
  const monthsObj = {
    1: 'January',
    2: 'Febrary',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };
  const months = str.split('-');
  const start = months[0]; const end = months[1];
  return `${monthsObj[start]} - ${monthsObj[end]}`;
}

function fillDetails() {
  const { availability, price, icon_uri } = data.response;
  const phrase = data.response['catch-phrase'];
  document.getElementById('details-name').textContent = data.displayName.toUpperCase();
  const $detailsImg = document.getElementById('details-img');
  $detailsImg.setAttribute('src', icon_uri);
  $detailsImg.setAttribute('alt', data.displayName);
  document.getElementById('phrase').textContent = phrase;
  if (availability.location) {
    document.getElementById('location').textContent = availability.location;
  } else {
    document.getElementById('location').textContent = 'No data available.';
  }

  if (availability.rarity) {
    document.getElementById('rarity').textContent = availability.rarity;
  } else {
    document.getElementById('rarity').textContent = 'No data available.';
  }

  document.getElementById('price').textContent = price;

  if (availability.isAllYear) {
    document.getElementById('available-north').textContent = 'All year';
    document.getElementById('available-south').textContent = 'All year';
  } else {
    const monthsNorth = convertMonth(availability['month-northern']);
    const monthsSouth = convertMonth(availability['month-southern']);
    document.getElementById('available-north').textContent = monthsNorth;
    document.getElementById('available-south').textContent = monthsSouth;
  }

  if (availability.isAllDay || availability.time === '') {
    document.getElementById('time-of-day').textContent = 'All day';
  } else {
    document.getElementById('time-of-day').textContent = availability.time;
  }
}
