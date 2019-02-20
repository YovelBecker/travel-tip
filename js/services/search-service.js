'use strict';

import apiService from './api-service.js'

export default {searchPlacesOnInput}

function searchPlacesOnInput(input){
    let api = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=geocode&language=fr&key=AIzaSyDygBklvF35Jy4u5JQp-ayl94zM5yAKx7Y`
    
    apiService.getResponseFromApi(api).then(res => console.log(res))
}