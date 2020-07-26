//'use strict';

let skatPark =
  'https://www.flaticon.com/premium-icon/icons/svg/3098/3098788.svg';

let skatorUser = 'https://image.flaticon.com/icons/svg/3163/3163766.svg';

let tlvLatlng = { lat: 32.075, lng: 34.8 }; /////Tel Aviv

let optPark = { lat: 32.075, lng: 34.8 };

let arrPark = [
  {
    lat: 32.1688118,
    lng: 34.8267088,
    name: 'Skate Park',
  },
  {
    lat: 32.0612484,
    lng: 34.789238,
    name: 'Galit Park',
  },
  {
    lat: 31.779018,
    lng: 35.222518,
    name: "Gili's Skate Shop",
  },
  {
    lat: 32.0653579,
    lng: 34.8115221,
    name: "Skateboard Park Giv'atayim",
  },
  {
    lat: 32.0615915,
    lng: 34.7889951,
    name: 'EndlessRoll LTD',
  },
  {
    lat: 31.8001489,
    lng: 34.7779506,
    name: 'Skatepark Gedera',
  },
  {
    lat: 32.0594776,
    lng: 34.7896726,
    name: 'Noiz Skateshop',
  },
  {
    lat: 32.0704054,
    lng: 34.8604265,
    name: 'Skateboard Park Petah Tikva',
  },
];

//////////////////////////////////////////

function initMap() {
  let map = new google.maps.Map(document.getElementById('map'), {
    center: tlvLatlng,
    zoom: 15,
  });
  let infoWindow1 = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        let mark = new google.maps.Marker({
          position: pos,
          map: map,
          icon: {
            url: skatorUser,
            scaledSize: new google.maps.Size(70, 70),
          },
        });

        map.setCenter(pos);
      },

      function () {
        handleLocationError(true, infoWindow1, map.getCenter(tlvLatlng));
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow1, map.getCenter(tlvLatlng));
  }

  function handleLocationError(browserHasGeolocation, infoWindow1, tlvLatlng) {
    infoWindow1.setPosition(tlvLatlng);
    infoWindow1.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
  }

  ///////////////////////////////////////////////////////////////// Park info Window

  for (let i = 0; i < arrPark.length; i++) {
    let infowindow2 = new google.maps.InfoWindow({
      content:
        `<div id="siteNotice">` +
        `<h1>${arrPark[i].name}</h1>` +
        `<p>Weather</p>` +
        `<p>Style</p>` +
        `<p>Reviews</p>` +
        `</div>`,
    });

    let mark1 = new google.maps.Marker({
      position: { lat: arrPark[i].lat, lng: arrPark[i].lng },
      map: map,
      icon: { url: skatPark, scaledSize: new google.maps.Size(70, 70) },
    });

    mark1.addListener('click', function () {
      infowindow2.open(map, mark1);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////// New park Location

  let question =
    '<p><a href="https://www.google.co.il/">To add this skatpark location?</a></p>';

  map.addListener('click', function (mapsMouseEvent) {
    let infoWindow3 = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
      content: question,
    });
    console.log(mapsMouseEvent.latLng.toString());
    infoWindow3.open(map);
  });
}
