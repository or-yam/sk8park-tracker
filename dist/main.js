import { ParkManager } from './models/ParkManager.js';
import { UserManger } from './models/UserManager.js';
const parkManager = new ParkManager();
const userManager = new UserManger();

$('#submit-park-btn').on('click', function (event) {
  event.preventDefault();
  const { tempPark } = parkManager._data;
  let newStyles = { vert: false, street: false, pump: false };
  $('.style')
    .filter(':checked')
    .toArray()
    .forEach((s) => {
      let key = s.value;
      if (newStyles.hasOwnProperty(key)) {
        newStyles[key] = true;
      }
    });
  let newRate = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
  };
  let userRate = $('.rating').filter(':checked').val();
  for (const key in newRate) {
    if (key == userRate) {
      newRate[key]++;
    }
  }
  tempPark.rating = newRate;
  tempPark.about = $('.about').val();
  tempPark.default = false;
  tempPark.lat = JSON.parse(localStorage.lat || '[]').lat.toFixed(7);
  tempPark.lng = JSON.parse(localStorage.lng || '[]').lng.toFixed(7);
  tempPark.name = $('#park-name').val();
  tempPark.style = newStyles;
  tempPark.activityHours = $('.time')
    .filter(':checked')
    .toArray()
    .map((t) => t.value)[0];
  parkManager.addPark(tempPark);
  window.location.replace('../index.html');
});

$('#goToLogin').on('click', function (event) {
  event.preventDefault();
  $('#bless').hide();
  $('#map').hide();
  $('#addPark').hide();
  $('#user').hide();
  $('#login').show();
});

$('#loginBut').on('click', async function (event) {
  event.preventDefault();
  let email = $('#emailLogin').val();
  let password = $('#passwordLogin').val();
  await loginUser(email, password);
  $('#emailLogin').val('');
  $('#passwordLogin').val('');
  let userLogedIn = userManager._userData;
  $('#map').show();
  userManager._userData = userLogedIn;
});

const loginUser = async (email, password) => {
  $('#bless').hide();
  $('#map').hide();
  $('#login').show();
  $('#addPark').show();
  $('#user').show();
  const credentials = { email, password };
  const userData = await $.post('/api/users/login', credentials);
  userManager._userData = userData;
  $('#bless').empty();
  welcomeUser('Hello ');
  $('#login').show() && $('#map').hide()
    ? $('#login').hide() &&
      $('#map').show() &&
      $('#user').hide() &&
      $('#bless').show()
    : alert('check your email and password');
  initMap();
};

$('#goToRegister').on('click', function (event) {
  event.preventDefault();
  $('#register').show();
  $('#login').hide();
  $('#bless').hide();
});

$('#registerBut').on('click', async function (event) {
  event.preventDefault();
  let userData = {
    name: $('#registerName').val(),
    email: $('#RegisterMail').val(),
    password: $('#passwordRegister').val(),
  };
  let newUser = await $.post('/api/users/register', userData);
  userManager._userData = newUser;
  $('#bless').empty();
  welcomeUser('Hello ');
  $('#addPark').show();
  $('#map').show();
  $('#bless').show();
  initMap();
});

$('#map').on('click', '.btnImg', function () {
  let windowInfo = $(this).closest($('.parkInfo')).html().split('_')[0];
  let moreInfo = `<h3>Add review</h3><textarea cols="50" rows="3"></textarea>
  <h3>Add score review</h3><input type="number" id="quantity" min="1" max="5">
  <br><button id="backBtn">Back to map</button>`;
  $('#map').empty();
  $('#map').append(
    `<div id="addComment" class="parkInfo">${windowInfo}${moreInfo}</div>`
  );
});
$('#map').on('click', '#backBtn', function () {
  $('#map').empty();
  initMap();
});

$('#addPark').on('click', () => {
  if ($('#message').html() === '') {
    $('#message').append(
      '<div id="messageContent">Mark on the map the park location</div>'
    );
  } else {
    $('#message').empty();
  }
});

const welcomeUser = (bless) => {
  $('body').append(
    `<h1 Visible=false id="bless">${bless}${userManager._userData.name}</h1>`
  );
};
// var time = new Date().toLocaleTimeString().slice(0, 1);
// if (time > 6 && time < 14) {
//   welcomeUser('Good morning ');
// } else if (time >= 14 && time < 18) {
//   welcomeUser('Good afternoon ');
// } else if (time >= 18 && time < 22) {
//   welcomeUser('Good evening ');
// } else {
//   welcomeUser('Good night ');
// }

const skatParkIcon = 'https://image.flaticon.com/icons/svg/3004/3004731.svg';
const skateUserIcon = 'https://image.flaticon.com/icons/svg/3163/3163766.svg';
const tlvLatLng = { lat: 32.075, lng: 34.8 };

const initMap = async () => {
  $('#register').hide();
  $('#login').hide();
  if (userManager._userData.name === 'guest') {
    await parkManager.getAllParks('guest');
  } else {
    await parkManager.getAllParks();
  }

  let map = new google.maps.Map(document.getElementById('map'), {
    center: tlvLatLng,
    zoom: 13,
  });
  let userLocationWindow = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const userMark = new google.maps.Marker({
          animation: google.maps.Animation.BOUNCE,
          position: userLocation,
          map: map,
          icon: {
            url: skateUserIcon,
            scaledSize: new google.maps.Size(70, 70),
          },
        });
        map.setCenter(userLocation, userMark);
      },
      function () {
        handleLocationError(true, userLocationWindow, map.getCenter(tlvLatLng));
      }
    );
  } else {
    handleLocationError(false, userLocationWindow, map.getCenter(tlvLatLng));
  }

  //handle ERROR
  function handleLocationError(
    browserHasGeolocation,
    parkInfoWindow,
    tlvLatLng
  ) {
    parkInfoWindow.setPosition(tlvLatLng);
    parkInfoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
  }

  for (const park of parkManager._data.skateParks) {
    let parkInfoWindow = new google.maps.InfoWindow({
      //parkInfo
      content: `<div class="parkInfo">
        <h1>${park.name}</h1>
        <img class="imgStar" src="https://image.flaticon.com/icons/svg/991/99198${
          park.rating
        }.svg">
        <div>
        ${
          park.style.street
            ? "<img class='ingStyle' src='https://image.flaticon.com/icons/svg/2649/2649112.svg'>"
            : ''
        }
        ${
          park.style.vert
            ? "<img class='ingStyle' src='https://www.flaticon.com/premium-icon/icons/svg/3098/3098788.svg'>"
            : ''
        }
        ${
          park.style.pump
            ? "<img class='ingStyle' src='https://image.flaticon.com/icons/svg/2380/2380533.svg'>"
            : ''
        }
        </div>
        <h2>About: ${park.about}</h2>   
        <h2>Activity Hours: ${
          park.activityHours
        }</h2>________________________________
        <img class="btnImg" src="https://image.flaticon.com/icons/svg/1076/1076337.svg"/>
        </div>`,
    });

    let parkMark = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: {
        lat: park.lat,
        lng: park.lng,
      },
      map: map,
      icon: { url: skatParkIcon, scaledSize: new google.maps.Size(70, 70) },
    });

    parkMark.addListener('click', function () {
      parkInfoWindow.open(map, parkMark);
    });
  }

  let question =
    '<p><a href="./views/parkForm.html">To add this skatepark location?</a></p>';

  map.addListener('click', function (mapsMouseEvent) {
    let infoWindow3 = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
      content: question,
    });
    let location = mapsMouseEvent.latLng
      .toString()
      .replace('(', '')
      .replace(')', '')
      .split(', ');

    let lat = { lat: Number(location[0]) };
    let lng = { lng: Number(location[1]) };
    localStorage.setItem('lat', JSON.stringify(lat));
    localStorage.setItem('lng', JSON.stringify(lng));

    infoWindow3.open(map);
  });
};

initMap();
