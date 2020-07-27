import { ParkManager } from './models/ParkManager.js';
const parkManager = new ParkManager();

// const loginUser = async (email, password) => {
//   const credentials = { email, password };
//   const userData = await $.post('/api/users/login', credentials);
//   userData ? renderWelcome(userData) : renderWrong();
// };

// const registerUser = async (userData) => {
//   const user = await $.post('/api/users/register');
//   renderWelcome(userData);
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

const skatParkIcon =
  'https://www.flaticon.com/premium-icon/icons/svg/3098/3098788.svg';
const skateUserIcon = 'https://image.flaticon.com/icons/svg/3163/3163766.svg';
const tlvLatLng = { lat: 32.075, lng: 34.8 };

const initMap = async () => {
  await parkManager.getAllParks();
  let map = new google.maps.Map(document.getElementById('map'), {
    center: tlvLatLng,
    zoom: 15,
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
        <h1>Name: ${park.name}</h1> 
        <p>Rating: ${park.rating}</p> 
        <p>About: ${park.about}</p> 
        </div>`,
    });

    let parkMark = new google.maps.Marker({
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
    '<p><a href="./views/parkForm.html">To add this skatepark location?</a></p>'; //change href to create park form

  map.addListener('click', function (mapsMouseEvent) {
    let infoWindow3 = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
      content: question,
    });
    console.log(mapsMouseEvent.latLng.toString()); // getting pointer location
    infoWindow3.open(map);
  });
};

initMap();
