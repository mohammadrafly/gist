function getDistanceToRoad(markerLatLng, multiLineStringCoordinates) {
    var minDistance = Infinity;

    for (var i = 0; i < multiLineStringCoordinates.length; i++) {
        var lineStringCoordinates = multiLineStringCoordinates[i];

        for (var j = 0; j < lineStringCoordinates.length - 1; j++) {
            var distance = L.GeometryUtil.distanceSegment(
                map,
                markerLatLng,
                L.latLng(lineStringCoordinates[j][1], lineStringCoordinates[j][0]),
                L.latLng(lineStringCoordinates[j + 1][1], lineStringCoordinates[j + 1][0])
            );

            minDistance = Math.min(minDistance, distance);
        }
    }

    return minDistance;
}

function calculateValue(distance) {
    var metersPerValue = 50;
    var value = Math.ceil(distance / metersPerValue);
    return Math.min(Math.max(11 - value, 1), 10);
}

function getDistanceToMinimarket(markerLatLng, minimarketFeatures) {
    var closestDistance = Infinity;

    if (Array.isArray(minimarketFeatures)) {
        minimarketFeatures.forEach(minimarketPolygon => {
            var centroid = calculatePolygonCentroid(minimarketPolygon);

            var centerDistance = markerLatLng.distanceTo(centroid);

            closestDistance = Math.min(closestDistance, centerDistance);
        });
    } else {
        console.error("minimarketFeatures is not an array");
    }

    return closestDistance;
}

function getDistanceToPermukiman(markerLatLng, permukimanFeatures) {
    var closestDistance = Infinity;

    if (Array.isArray(permukimanFeatures)) {
        permukimanFeatures.forEach(permukimanPolygon => {
            var centroid = calculatePolygonCentroid(permukimanPolygon);

            var centerDistance = markerLatLng.distanceTo(centroid);

            closestDistance = Math.min(closestDistance, centerDistance);
        });
    } else {
        console.error("Permukiman Features is not an array");
    }

    return closestDistance;
}

function calculatePolygonCentroid(polygon) {
    var sumX = 0;
    var sumY = 0;
    var numPoints = polygon.length;

    polygon.forEach(point => {
        sumX += point[0];
        sumY += point[1];
    });

    var centroidX = sumX / numPoints;
    var centroidY = sumY / numPoints;

    return L.latLng(centroidY, centroidX);
}    

function calculateValueForMinimarket(distance) {
    var metersPerValue = 500;
    var value = Math.ceil(distance / metersPerValue);
    return Math.min(Math.max(11 - value, 1), 10);
}
function calculateValueForPemukiman(distance) {
    var distanceValueMapping = [
        { distance: 50, value: 10 },
        { distance: 100, value: 9 },
        { distance: 150, value: 8 },
        { distance: 200, value: 7 },
        { distance: 250, value: 6 },
        { distance: 300, value: 5 },
        { distance: 350, value: 4 },
        { distance: 400, value: 3 },
        { distance: 450, value: 2 },
        { distance: 500, value: 1 },
    ];

    var matchingThreshold = distanceValueMapping.find(t => distance < t.distance);
    var value = matchingThreshold ? matchingThreshold.value : 1;

    var minValue = 1;
    var maxValue = 10;

    value = Math.min(Math.max(value, minValue), maxValue);

    return value;
}