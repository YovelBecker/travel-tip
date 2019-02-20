export default {
    initMap,
    addMarker,
    panTo
}

var gMap;

function initMap(lat = 32.8430031, lng = 35.4202657) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 10
                })
            addMarker({lat, lng}, 'DEFAULT')
            console.log('Map Rendered!', gMap);
        })
}

function addMarker(position, title) {
    console.log('title', title)
    var marker = new google.maps.Marker({
        position,
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
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}