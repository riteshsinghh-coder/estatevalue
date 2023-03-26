mapboxgl.accessToken = 'pk.eyJ1Ijoicml0ZXNoa3VtYXJzaW5naCIsImEiOiJjbDhkYm1ubnEwcm8yM3hxOWpneWU0d25wIn0.cpLNiwhiFrTD7QkkAyMX3Q';
var everylat=document.getElementById("everylat").value;
var everylon=document.getElementById("everylon").value;
console.log(everylat,everylon);
var everymap = new mapboxgl.Map({
	container: 'map3',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [everylon,everylat],
	zoom: 14,
    streetViewControl: true

  })
  everymap.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var everymarker = new mapboxgl.Marker()
.setLngLat([everylon, everylat])
.addTo(everymap);
// setallite view
var everylat=document.getElementById("everylat").value;
var everylon=document.getElementById("everylon").value;
console.log(everylat,everylon);
var everymap = new mapboxgl.Map({
	container: 'estate-street-view',
	style: 'mapbox://styles/mapbox/satellite-streets-v11',
	center: [everylon,everylat],
	zoom: 14,
    streetViewControl: true

  })
  everymap.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var everymarker = new mapboxgl.Marker()
.setLngLat([everylon, everylat])
.addTo(everymap);
