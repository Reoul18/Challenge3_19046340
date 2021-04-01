
// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoicmVvdWwxOCIsImEiOiJja21sdG90ZWUwZ21vMnByem1wM3JoenZyIn0.5p8Yliukd7hh1N9X3rA9Wg';
	

// Initiate map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [4.32284, 52.067101],
    zoom: 7,
    bearing: -180,
    pitch: 45,
  });


// Voeg de zoekbalk toe
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  }),
  'top-left'
);



map.on('load', function () {
  map.loadImage(
      'https://en.wikipedia.org/wiki/Vandenberg_Air_Force_Base#/media/File:Titan_IV_Centaur_launch_-_Vandenberg_AFB.jpg',
      function (error, image) {
          if (error) throw error;
          map.addImage('island', image);
          map.addSource('point', {
              'type': 'geojson',
              'data': {
                  'type': 'FeatureCollection',
                  'features': [
                      {
                          'type': 'Feature',
                          'geometry': {
                              'type': 'Point',
                              'coordinates': [0, 0]
                          }
                      }
                  ]
              }
          });
          map.addLayer({
              'id': 'points',
              'type': 'symbol',
              'source': 'point',
              'layout': {
                  'icon-image': 'island',
                  'icon-size': 0.25
              }
          });
      }
  );
});


// map.addControl(new mapboxgl.NavigationControl()); 

// var Amsterdam = new mapboxgl.Popup().setHTML('<h1>Amsterdam</h1><h3>Beste Landingplek</h3>');
// var Rotterdam = new mapboxgl.Popup().setHTML('<h3>2e Landingplek</h3>');
// var Zeeland = new mapboxgl.Popup().setHTML('<h3>3e Landingplek</h3>');
// var Friesland = new mapboxgl.Popup().setHTML('<h3>4e Landingplek</h3>');
// var Limburg = new mapboxgl.Popup().setHTML('<h3>5e Landingplek</h3>');

// // Adding a marker based on lon lat coordinates
// var marker = new mapboxgl.Marker().setLngLat([4.895168, 52.370216]).setPopup(Amsterdam).addTo(map);
// var marker = new mapboxgl.Marker().setLngLat([4.463179, 51.922893]).setPopup(Rotterdam).addTo(map);
// var marker = new mapboxgl.Marker().setLngLat([3.702806, 51.416297]).setPopup(Zeeland).addTo(map);
// var marker = new mapboxgl.Marker().setLngLat([5.777043, 53.092369]).setPopup(Friesland).addTo(map);
// var marker = new mapboxgl.Marker().setLngLat([5.9046302, 51.201520]).setPopup(Limburg).addTo(map);




// api token for openWeatherMap
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = '4d3aa280b33cfb3bb3f277c9ee3d0b73';

// Determine cities
var cities = [
  {
    name: 'Cape Canaveral Air Force Station Lanceercomplex 40',
    coordinates: [-80.577249, 28.562048]
  },
  {
    name: 'Vandenberg Air Force Base',
    coordinates: [-120.567747, 34.733238]
  },
  {
    name: 'Den Haag',
    coordinates: [4.32284, 52.067101]
  },
];



// get weather data and plot on map
map.on('load', function () {
  cities.forEach(function(city) {
    // Usually you do not want to call an api multiple times, but in this case we have to
    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    // Get current weather based on cities' coordinates
    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        // Then plot the weather response + icon on MapBox
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1
        }
      });
    }
  );
}


function getAPIdata() {

	// construct request
    var city = document.getElementById("city").value;
	var request = 'https://api.openweathermap.org/data/2.5/weather?appid=4d3aa280b33cfb3bb3f277c9ee3d0b73&q=' + city;
	
	// get current weather
	fetch(request)	
	
	// parse response to JSON format
	.then(function(response) {
		return response.json();
	})
	
	// do something with response
	.then(function(response) {
		// show full JSON object
	  var weatherBox = document.getElementById('weather');
		weatherBox.innerHTML = (response.main.temp -273.15).toFixed(2)+' &#730 C <br />' + response.weather[0].description;
	});
}

document.getElementById('cityButton').onclick = function(){
    getAPIdata();
};


