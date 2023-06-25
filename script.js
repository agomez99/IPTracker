
const SVG_MARKER = './images/icon-location.svg';
let ipDetails = {};
const defaultDetails = {
    ipAddress: "192.212.174",
    location: "Brooklyn, NY 10001",
    utc: "UTC -5:00",
    isp: "SpaceX Starlink",
};
let map;
const mapOptions = {
    center: { lat: 40.6782, lng: -73.9442 },
    zoom: 15,
};

window.onload = initMap;

function initMap() {
    updateDetails(defaultDetails);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            mapOptions.center = userLocation;
            map.setCenter(userLocation);
        });
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        const marker = new google.maps.Marker({
            position: mapOptions.center,
            map,
            icon: SVG_MARKER,
        });
        map.setCenter(marker.getPosition());
        document.getElementById("ipForm").addEventListener("submit", trackIP);
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
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map,
                icon: SVG_MARKER,
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
updateDetails(defaultDetails);


