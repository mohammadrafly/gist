    var map = L.map('map').setView([-8.1805, 113.6856], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var kecamatanKaliwatesBoundary = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": batasKaliwates,
                    "type": "Polygon"
                }
            }
        ]
    };
    
    var jalanFeature = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "MultiLineString",
            "coordinates": roadFeatures
        }
    };

    var minimarketArea = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": minimarketFeatures
        }
    };

    var permukimanArea = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": permukimanFeatures
        }
    };

    var jalanLayer = L.geoJSON(jalanFeature, {
        style: {
            color: 'blue',
            weight: 4
        }
    }).addTo(map);

    var kecamatanKaliwatesLayer = L.geoJSON(kecamatanKaliwatesBoundary, {
        style: {
            fillColor: 'gray',
            color: 'gray',
            weight: 2
        }
    }).addTo(map);

    kecamatanKaliwatesLayer.on('mouseout', function (e) {
        kecamatanKaliwatesLayer.resetStyle(e.target);
    });

    var markers = [];
    var markerCounter = 0;
    
    map.on('click', function(e) {
      if (isPointInsideBoundary(e.latlng, kecamatanKaliwatesBoundary)) {
        markerCounter++;
        var markerLabel = String.fromCharCode(65 + markers.length); 
        var marker = L.marker(e.latlng).addTo(map);
        markers.push(marker);
    
        var popupContent = `<p>Titik lokasi ${markerLabel}: ${e.latlng.toString()}</p>`;
        marker.bindPopup(popupContent).openPopup();
      } else {
        alert('Maaf titik yang anda pilih berada diluar kecamatan kaliwates');
      }
    });    

    var nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', onNextButtonClick);

    var loadingSpinner = document.getElementById('loadingSpinner');
    var buttonContent = document.getElementById('buttonContent');
    var resultDisplay = document.getElementById('resultDisplay');

    function isPointInsideBoundary(point, boundary) {
      var polygon = turf.polygon(boundary.features[0].geometry.coordinates);
      var pt = turf.point([point.lng, point.lat]);
    
      return turf.booleanPointInPolygon(pt, polygon);
    }

    function onNextButtonClick() {
      buttonContent.classList.add('hidden');
      loadingSpinner.classList.remove('hidden');
    
      if (markers.length > 0) {
        var results = [];
    
        markers.forEach(function(marker, index) {
          var markerLatLng = marker.getLatLng();
          var distanceToRoad = getDistanceToRoad(markerLatLng, jalanFeature.geometry.coordinates);
          var value = calculateValue(distanceToRoad);
    
          var distanceToMinimarket = getDistanceToMinimarket(markerLatLng, minimarketArea.geometry.coordinates);
          var valueMinimarket = calculateValueForMinimarket(distanceToMinimarket);
    
          var distanceToPermukiman = getDistanceToPermukiman(markerLatLng, permukimanArea.geometry.coordinates);
          var valuePermukiman = calculateValueForPemukiman(distanceToPermukiman);
    
          var jumlahGedung = 500;
          if (valuePermukiman <= 10) {
            for (var i = 10; i > valuePermukiman; i--) {
              jumlahGedung -= 50;
            }
          }
    
          results.push({
            distanceToMinimarket: distanceToMinimarket.toFixed(2),
            valueMinimarket: valueMinimarket,
            distanceToRoad: distanceToRoad.toFixed(2),
            value: value,
            distanceToPermukiman: distanceToPermukiman.toFixed(2),
            valuePermukiman: valuePermukiman,
            jumlahGedung: jumlahGedung
          });
        });
    
        const dataMatrix = results.map(result => [result.valueMinimarket, result.value, result.valuePermukiman]);
    
        console.log(dataMatrix)
        const k = 3;
        const clusters = kmeans(dataMatrix, k);
    
        console.log(clusters);
        results.forEach((result, index) => {
          const clusterIndex = clusters.assignments[index];
          result.cluster = clusterIndex;
          console.log(clusterIndex)
        });
    
        setTimeout(function () {
          loadingSpinner.classList.add('hidden');
          buttonContent.classList.remove('hidden');
    
          results.forEach(function(result, index) {
              var markerLabel = String.fromCharCode(65 + index);
              var clusterSum = result.valueMinimarket + result.value + result.valuePermukiman; // Sum of all variable values
              var clusterLabel = (clusterSum >= 15) ? 2 : 1; // Determine the cluster label based on the sum
          
              resultDisplay.innerHTML += `
                <div class="m-5">
                  <p>Titik ${markerLabel} (Cluster ${clusterLabel}): Jumlah Value ${clusterSum / 10 * 100}% ${(clusterSum >= 15) ? 'Area Layak' : 'Area Tidak Layak'}</p>
                  <p>Jarak dengan minimarket: ${result.distanceToMinimarket} Meter (Value: ${result.valueMinimarket / 10 * 100}%) </p>
                  <p>Jarak dengan jalan: ${result.distanceToRoad} Meter (Value: ${result.value / 10 * 100}%)</p>
                  <p>Jumlah Gedung: ${result.jumlahGedung} Gedung/500m (Value: ${result.valuePermukiman / 10 * 100}%)</p>
                </div>
              `;
          });
    
          resultDisplay.classList.remove('hidden');
        }, 2000);
      } else {
        loadingSpinner.classList.add('hidden');
        buttonContent.classList.remove('hidden');
        alert('No markers selected. Please click on the map to set markers.');
      }
    }    