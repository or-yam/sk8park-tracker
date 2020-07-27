import { ParkManager } from './models/ParkManager.js';
import { UserManger } from './models/UserManager.js';
const parkManager = new ParkManager();
const userManager = new UserManger();

$('#submit-park-btn').on('click', function (event) {
  event.preventDefault();
  parkManager._data.tempPark.name = $('#park-name').val();
  const styles = $('.style')
    .filter(':checked')
    .toArray()
    .map((s) => ({ [s.value]: true }));
  console.log(styles);
  const times = $('.time')
    .filter(':checked')
    .toArray()
    .map((t) => t.value);
  const rate = $('.rating').filter(':checked').val();
  const about = $('.about').val();
});

const loginUser = async (email, password) => {
  const credentials = { email, password };
  const userData = await $.post('/api/users/login', credentials);
  userManager._userData = userData;
  userData
    ? (window.location = 'http://localhost:3000')
    : alert('check your email and password');
  // userData ? renderWelcome(userData) : renderWrong();
};

$('#loginBut').on('click', async function (event) {
  event.preventDefault();
  let email = $('#emailLogin').val();
  let password = $('#passwordLogin').val();
  await loginUser(email, password);
  $('#emailLogin').val('');
  $('#passwordLogin').val('');
});

$('#goToRegister').on('click', function (event) {
  event.preventDefault();
  $('#register').show();
  $('#login').hide();
});

$('#registerBut').on('click', async function (event) {
  event.preventDefault();
  let userData = {
    name: $('#registerUame').val(),
    email: $('#RegisterMail').val(),
    password: $('#passwordRegister').val(),
  };
  let newUser = await $.post('/api/users/register', userData);
  userManager._userData = newUser;
  window.location = 'http://localhost:3000';
});

// const registerUser = async (userData) => {
//   const user = await $.post('/api/users/register');
//   renderWelcome(userData);
// };

// const getNewParkData = () => {
//   const name = $('#name').val();
//   const about = $('#id').val();
// };

$('#addPark').click(() => {
  if ($('#message').html() === '') {
    $('#message').append(
      '<div id="messageContent">Mark on the map the park location</div>'
    );
  } else {
    $('#message').empty();
  }
});

const skatParkIcon = 'https://image.flaticon.com/icons/svg/3004/3004731.svg';
const skateUserIcon = 'https://image.flaticon.com/icons/svg/3163/3163766.svg';
const tlvLatLng = { lat: 32.075, lng: 34.8 };

const initMap = async () => {
  await parkManager.getAllParks();
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
      content: `<div id="parkInfo">
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
        <h2>Activity Hours: ${park.activityHours}</h2>
        <a href="https://www.google.co.il/"><img class="btnImg" src="https://image.flaticon.com/icons/svg/1076/1076337.svg"/></a>
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
    parkManager._data.tempPark.lat = Number(location[0]);
    parkManager._data.tempPark.lng = Number(location[1]);
    console.log(parkManager._data.tempPark);
    infoWindow3.open(map);
  });
};

initMap();
