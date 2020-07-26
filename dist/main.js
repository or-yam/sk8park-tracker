import { ParkManager } from './models/ParkManager.js';
import { Renderer } from './views/Renderer.js';

const parkManager = new ParkManager()

let skatPark =
        'https://www.flaticon.com/premium-icon/icons/svg/3098/3098788.svg';

      let skatorUser = 'https://image.flaticon.com/icons/svg/3163/3163766.svg';

      let tlvLatlng = { lat: 32.075, lng: 34.8 }; /////Tel Aviv

      let optPark = { lat: 32.075, lng: 34.8 };

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
  
          map.setCenter(pos, mark);
        },
  
        function () {
          handleLocationError(true, infoWindow1, map.getCenter(tlvLatlng));
        }
      );
    } else {
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
  
  
    for (let i = 0; i < parkManager.skateParks.length; i++) {
      let infowindow2 = new google.maps.InfoWindow({
        content:
          `<div id="siteNotice">` +
          `<h1>${parkManager.skateParks[i].name}</h1>` +
          `<p>Weather</p>` +
          `<p>Style</p>` +
          `<p>Reviews</p>` +
          `</div>`,
      });
  
      let mark1 = new google.maps.Marker({
        position: { lat: parkManager.skateParks[i].lat, lng: parkManager.skateParks[i].lng },
        map: map,
        icon: { url: skatPark, scaledSize: new google.maps.Size(70, 70) },
      });
  
      mark1.addListener('click', function () {
        infowindow2.open(map, mark1);
      });
    }
  
  
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

  initMap()