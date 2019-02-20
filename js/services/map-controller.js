import weatherService from './weather-service.js'
import { renderWeatherDetails, renderLocationName } from '../main.js'
import geoService from './geocode-service.js'
import storageService from './storage-service.js'

const CURR_POS_KEY = 'currPos';


export default {
    initMap,
    addMarker,
    panTo
}

var gMap;

function initMap(lat = 32.8430031, lng = 35.4202657) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then((res) => {
            setGoogleMap(lat, lng)
            addMarker({ lat, lng }, 'QUERY')
            createSearchAutocomplete()
        })
}

function setGoogleMap(lat, lng) {
    gMap = new google.maps.Map(
        document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 10
        })
}

function createSearchAutocomplete() {
    let elSearch = document.querySelector('.location-list-input');
    let placesInput = new google.maps.places.Autocomplete(elSearch);
    placesInput.addListener('place_changed', () => {
        let place = placesInput.getPlace();
        let lat = place.geometry.location.lat()
        let lng = place.geometry.location.lng()
        panTo(lat, lng);
        addMarker({ lat, lng }, place.name)
        storageService.saveToStorage(CURR_POS_KEY, { lat, lng })
        weatherService.getWeatherByPos({ lat, lng }).then(renderWeatherDetails)
        geoService.getGeocodeByLatLng({ lat, lng }).then(geocode => {
            renderLocationName(geocode.results[0].formatted_address);
        })
    })
}

function addMarker(position, title) {
    console.log('title', title)
    var icon = {
        url: "/img/marker.png", // url
        scaledSize: new google.maps.Size(23, 33), // scaled size
    };
    var marker = new google.maps.Marker({
        position,
        icon: icon,
        map: gMap,
        title
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAodJPeAR2kC-a-rrqDGgRrLheAovXkLeM';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}