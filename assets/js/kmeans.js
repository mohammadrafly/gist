function kmeans(data, k) {
    let centroids = [];
    for (let i = 0; i < k; i++) {
      centroids.push(data[Math.floor(Math.random() * data.length)]);
    }
  
    let iterations = 0;
    const maxIterations = 100;
    let assignments;
  
    while (iterations < maxIterations) {
      assignments = data.map(point => {
        const distances = centroids.map(centroid => euclideanDistance(point, centroid));
        return distances.indexOf(Math.min(...distances));
      });
  
      const newCentroids = centroids.map((centroid, index) => {
        const assignedPoints = data.filter((_, i) => assignments[i] === index);
        if (assignedPoints.length > 0) {
          const centroidDimensions = centroid.length;
          const meanPoint = Array(centroidDimensions).fill(0);
  
          assignedPoints.forEach(point => {
            point.forEach((coord, i) => (meanPoint[i] += coord));
          });
  
          const totalPoints = assignedPoints.length;
  
          const meanCoords = meanPoint.map(coord => coord / totalPoints);
          const criteria = determineCriteria(meanCoords);
  
          return criteria;
        } else {
          return centroid;
        }
      });
  
      if (centroids.every((centroid, i) => arraysEqual(centroid, newCentroids[i]))) {
        break;
      }
  
      centroids = newCentroids;
      iterations++;
    }
  
    return {
      centroids,
      assignments
    };
  }
  
  function determineCriteria(meanCoords) {
    return meanCoords.map(coord => (coord > 5 ? "Sangat Layak" : coord > 3 ? "Layak" : "Tidak Layak"));
  }
  
  function euclideanDistance(point1, point2) {
    return Math.sqrt(
      point1.reduce((sum, coord, i) => sum + Math.pow(coord - point2[i], 2), 0)
    );
  }
  
  function arraysEqual(arr1, arr2) {
    return arr1.every((value, index) => value === arr2[index]);
  }
  