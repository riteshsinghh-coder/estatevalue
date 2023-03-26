mapboxgl.accessToken = 'pk.eyJ1Ijoicml0ZXNoa3VtYXJzaW5naCIsImEiOiJjbDhkYm1ubnEwcm8yM3hxOWpneWU0d25wIn0.cpLNiwhiFrTD7QkkAyMX3Q';
var lat0=document.getElementById("lat0").value;
var lon0=document.getElementById("lon0").value;
		
var map0 = new mapboxgl.Map({
	container: 'map0',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon0,lat0],
	zoom:11,
	streetViewControl: true,
	
	
  });
  map0.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
var marker = new mapboxgl.Marker()
.setLngLat([lon0, lat0])
.addTo(map0);
  var lat1=document.getElementById("lat1").value;
var lon1=document.getElementById("lon1").value;

var map1 = new mapboxgl.Map({
	container: 'map1',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon1,lat1],
	zoom:11,
	streetViewControl: true,
	
	
  });
  map1.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var marker1 = new mapboxgl.Marker()
.setLngLat([lon1, lat1])
.addTo(map1);
  var lat1=document.getElementById("lat1").value;
var lon1=document.getElementById("lon1").value;

var map1 = new mapboxgl.Map({
	container: 'map1',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon1,lat1],
	zoom:11,
	streetViewControl: true,
	
	
  });
  map1.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var marker1 = new mapboxgl.Marker()
.setLngLat([lon1, lat1])
.addTo(map1);
  var lat2=document.getElementById("lat2").value;
var lon2=document.getElementById("lon2").value;

var map2 = new mapboxgl.Map({
	container: 'map2',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon2,lat2],
	zoom:11,
	streetViewControl: true,
	
	
  });
  map2.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var marker1 = new mapboxgl.Marker()
.setLngLat([lon2, lat2])
.addTo(map2);
  var lat3=document.getElementById("lat3").value;
var lon3=document.getElementById("lon3").value;

var map3 = new mapboxgl.Map({
	container: 'map3',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon2,lat2],
	zoom:11,
	streetViewControl: true,
	
	
  });
  map3.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var marker1 = new mapboxgl.Marker()
.setLngLat([lon3, lat3])
.addTo(map3);
  var lat4=document.getElementById("lat4").value;
var lon4=document.getElementById("lon4").value;

var map4 = new mapboxgl.Map({
	container: 'map4',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon2,lat2],
	zoom:11,
	streetViewControl: true,
	
	
  });
  map4.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var marker1 = new mapboxgl.Marker()
.setLngLat([lon4, lat4])
.addTo(map4);

  var newlat0=document.getElementById("newlat0").value;
  var newlon0=document.getElementById("newlon0").value;

var newlistingmap0 = new mapboxgl.Map({
	container: 'grid-map0',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon0,newlat0],
	zoom:11,
	streetViewControl: true,
	
  })
  newlistingmap0.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker0 = new mapboxgl.Marker()
.setLngLat([newlon0, newlat0])
.addTo(newlistingmap0);

  var newlat1=document.getElementById("newlat1").value;
  var newlon1=document.getElementById("newlon1").value;

var newlistingmap1 = new mapboxgl.Map({
	container: 'grid-map1',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon1,newlat1],
	zoom:11,
	streetViewControl: true,
	
	
  })
  newlistingmap1.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker1 = new mapboxgl.Marker()
.setLngLat([newlon1, newlat1])
.addTo(newlistingmap1);

  var newlat2=document.getElementById("newlat2").value;
  var newlon2=document.getElementById("newlon2").value;

var newlistingmap2 = new mapboxgl.Map({
	container: 'grid-map2',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon2,newlat2],
	zoom:11,
	streetViewControl: true,
	
	
  })
  newlistingmap2.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker2 = new mapboxgl.Marker()
.setLngLat([newlon2, newlat2])
.addTo(newlistingmap2);

  var newlat3=document.getElementById("newlat3").value;
  var newlon3=document.getElementById("newlon3").value;

var newlistingmap3 = new mapboxgl.Map({
	container: 'grid-map3',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon3,newlat3],
	zoom:11,
	streetViewControl: true,
	
	
  })
  newlistingmap3.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker3 = new mapboxgl.Marker()
.setLngLat([newlon3, newlat3])
.addTo(newlistingmap3);



  var newlat4=document.getElementById("newlat4").value;
  var newlon4=document.getElementById("newlon4").value;

var newlistingmap4 = new mapboxgl.Map({
	container: 'grid-map4',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon4,newlat4],
	zoom:11,
	streetViewControl: true,
	
	
  })
  newlistingmap4.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker4 = new mapboxgl.Marker()
.setLngLat([newlon4, newlat4])
.addTo(newlistingmap4);



  var newlat5=document.getElementById("newlat5").value;
  var newlon5=document.getElementById("newlon5").value;

var newlistingmap5 = new mapboxgl.Map({
	container: 'grid-map5',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon5,newlat5],
	zoom:11,
	streetViewControl: true,
	
	
  })
  newlistingmap5.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker5 = new mapboxgl.Marker()
.setLngLat([newlon5, newlat5])
.addTo(newlistingmap5);



  var newlat6=document.getElementById("newlat6").value;
  var newlon6=document.getElementById("newlon6").value;

var newlistingmap6 = new mapboxgl.Map({
	container: 'grid-map6',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [newlon6,newlat6],
	zoom:11,
	streetViewControl: true,
	
	
  })
  newlistingmap6.addControl(new mapboxgl.GeolocateControl({
	positionOption:{
		enableHighAccuracy:true
	},
	trackUserLocation:true
}))
  var newmarker6 = new mapboxgl.Marker()
.setLngLat([newlon6, newlat6])
.addTo(newlistingmap6);




		