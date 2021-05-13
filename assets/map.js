// .map() - Instantiates a map object given the DOM ID of a <div> element
// .setView() - Sets the view of the map (geographical center and zoom) with the given animation options.
var mymap = L.map('mapid').setView([40,-95 ], 4);
var mapboxAccessToken = 'pk.eyJ1IjoidHBuZXR0bGVzMSIsImEiOiJja29rcndteXAwMGxzMm9wa2hiaWVna3d1In0.H_d_OMc1GOMW4Mr3yXKDsw';

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 4,
    maxZoom: 8,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapboxAccessToken
}).addTo(mymap);

var marker = L.marker([51.5, -0.09]).addTo(mymap);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);