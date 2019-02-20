import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import utilService from './services/util-service.js'

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(setMapToCurrentLocation)
}

document.querySelector('.current-location-btn').addEventListener('click', setMapToCurrentLocation)

function setMapToCurrentLocation() {
    locService.getPosition()
        .then(pos => {
            let currLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapService.addMarker(currLocation, 'Your current location')
            mapService.panTo(currLocation.lat, currLocation.lng)
        })
}