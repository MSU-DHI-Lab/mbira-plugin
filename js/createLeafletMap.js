$( document ).ready(function() {
	var map = L.map('map').setView([42.7404566603398, -84.5452880859375], 13);

	L.tileLayer('https://{s}.tiles.mapbox.com/v3/austintruchan.jb1pjhel/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(map);

	var search = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: true
	}).addTo(map);

	map.invalidateSize(false);

	var marker;
	map.on('click', function(e) {
		if(marker){
			map.removeLayer(marker);
		}
		if(search._positionMarker){
			map.removeLayer(search._positionMarker);
		}
		console.log(e.latlng); // e is an event object (MouseEvent in this case)
		marker = L.marker(e.latlng).addTo(map);
	});

});