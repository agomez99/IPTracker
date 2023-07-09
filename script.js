const SVG_MARKER = './images/icon-location.svg';
let ipDetails = {};

const mapOptions = {
  zoom: 14,
};

function initMap() {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const ipAddress = data.ip;
      fetch(`https://ipapi.co/${ipAddress}/json/`)
        .then(response => response.json())
        .then(data => {
          ipDetails = {
            ipAddress: data.ip,
            location: data.city,
            utc: data.timezone,
            isp: data.org,
          };
          updateDetails(ipDetails);
        })
        .catch(error => console.log('Error:', error));
    });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      mapOptions.center = userLocation;
      const map = new google.maps.Map(document.getElementById('map'), mapOptions);
      const marker = new google.maps.Marker({
        position: mapOptions.center,
        map,
        icon: SVG_MARKER,
        animation: google.maps.Animation.DROP
      });
      map.setCenter(marker.getPosition());
      document.getElementById('ipForm').addEventListener('submit', trackIP);
    });
  }
}

function trackIP(event) {
  event.preventDefault();
  const ipAddress = document.getElementById('ipInput').value;
  fetch(`https://ipapi.co/${ipAddress}/json/`)
    .then(response => response.json())
    .then(data => {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
      const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 14
      };
      const map = new google.maps.Map(document.getElementById('map'), mapOptions);
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        icon: SVG_MARKER,
        animation: google.maps.Animation.DROP
      });
      map.setCenter(marker.getPosition());
      ipDetails = {
        ipAddress: data.ip,
        location: data.city,
        utc: data.timezone,
        isp: data.org,
      };
      updateDetails(ipDetails);
    })
    .catch(error => console.log('Error:', error));
}

function updateDetails(details) {
  document.getElementById('ip-address').innerHTML = details.ipAddress;
  document.getElementById('location').innerHTML = details.location;
  document.getElementById('utc').innerHTML = details.utc;
  document.getElementById('isp').innerHTML = details.isp;
}
