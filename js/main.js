import locService from './services/loc.service.js'
import mapService from './services/map-controller.js'
import geoService from './services/geocode-service.js'
import storageService from './services/storage-service.js'
import weatherService from './services/weather-service.js'
import searchService from './services/search-service.js'

const CURR_POS_KEY = 'currPos';

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let queryLat = +urlParams.get('lat');
    let queryLng = +urlParams.get('lng');
    let pos = { lat: queryLat, lng: queryLng }
    if (queryLat && queryLng) {
        mapService.initMap(queryLat, queryLng).then(() => {
            geoService.getGeocodeByLatLng(pos).then(geocode => {
                renderLocationName(geocode.results[0].formatted_address);
            })
            weatherService.getWeatherByPos(pos).then(renderWeatherDetails)
        })
    } else {
        mapService.initMap()
            .then(setMapToCurrentLocation)
    }
}

document.querySelector('.current-location-btn').addEventListener('click', setMapToCurrentLocation)

function setMapToCurrentLocation() {
    document.querySelector('.location-list-input').value = ''
    locService.getPosition()
        .then(pos => {
            let currLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            storageService.saveToStorage(CURR_POS_KEY, currLocation)
            weatherService.getWeatherByPos(currLocation).then(renderWeatherDetails)
            mapService.addMarker(currLocation, 'Your current location')
            mapService.panTo(currLocation.lat, currLocation.lng)
            geoService.getGeocodeByLatLng(currLocation).then(geocode => {
                renderLocationName(geocode.results[0].formatted_address);
            })
        })
}

export function renderLocationName(name) {
    document.querySelector('.current-location-text').innerHTML = name;
}

export function renderWeatherDetails(weather) {
    document.querySelector('.current-temp').innerHTML = weather.temp;
    document.querySelector('.weather-description').innerHTML = weather.description;
}
document.querySelector('.clipboard-btn').addEventListener('click', () => {
    let pos = storageService.getFromStorage(CURR_POS_KEY)
    console.log(pos);
    let str = `https://yovelbecker.github.io/travel-tip/index.html?lat=${pos.lat}4&lng=${pos.lng}`;
    // let str = `http://127.0.0.1:5500/?lat=${pos.lat}4&lng=${pos.lng}`;
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = 'Copied To Clipboard';
    tooltip.classList.add('tooltiptext');
    setTimeout(() => {
        tooltip.innerHTML = '';
        tooltip.classList.remove('tooltiptext');
    }, 1000);
    navigator.clipboard.writeText(str).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    });
})