'use strict';
import apiService from './api-service.js'

export default {getGeocodeByLatLng}

function getGeocodeByLatLng(position) {
    console.log(position)
    let api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=AIzaSyAnLkdXP-7Vr_C80_Hkyo4PYfdjV7lrfxQ`;
    return apiService.getResponseFromApi(api)
}