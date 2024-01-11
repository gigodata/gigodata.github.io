// Define link to extract data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Define link to extract tectonic boundaries
const boundaryUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

		// Create initial map 
		let map = L.map("map", {
		center: [45.52, -122.67],
		zoom: 3
		});
		
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);


// Create markers for earthquakes

d3.json(url).then(data => {
		L.geoJSON(data, {
		style: function (feature) {
			let mag = feature.properties.mag;
			
			let depth = feature.geometry.coordinates[2];
			
		
		return {
			color: "black",
			radius: mag * 4,
			weight: 1,
			fillOpacity: .8,
			fillColor: 
				depth > 90 ? "red" :
				depth > 70 ? "blue" :
				depth > 50 ? "yellow" :
				depth > 30 ? "orange" :
				depth > 10 ? "lime" :
				"green"
		};
		},
		pointToLayer: function(data, latlng) {
    	return L.circleMarker(latlng);
}
}).bindPopup(function (layer) {
	let place = layer.feature.properties.place;
	let mag = layer.feature.properties.mag;
	let time = new Date (layer.feature.properties.time).toLocaleString();
	
    return `<h3>${place}<br>Magnitude: ${mag}<br>${time}</h3>`;
}).addTo(map);
}

)

d3.json(boundaryUrl).then(data => {
		L.geoJSON(data, {

			color: "orange",
			weight: 2
			
}).addTo(map);

})

// Add legend
let legend = L.control({position: "bottomright"})

legend.onAdd = function(){
	let div = L.DomUtil.create("div", "info legend")
	
	div.innerHTML += "<i style = 'background: green' ></i> -10&ndash;10<br>"
	div.innerHTML += "<i style = 'background: lime' ></i>10&ndash;30<br>"
	div.innerHTML += "<i style = 'background: orange' ></i>30&ndash;50<br>"
	div.innerHTML += "<i style = 'background: yellow' ></i>50&ndash;70<br>"
	div.innerHTML += "<i style = 'background: blue' ></i>70&ndash;90<br>"
	div.innerHTML += "<i style = 'background: red' ></i>90+"
	
	return div
	
};

legend.addTo(map);