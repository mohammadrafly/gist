const mapContainer = document.getElementById('map-container');
const markerContainer = document.getElementById('marker-container');
const mapImage = document.getElementById('map');
const changeImageButton = document.getElementById('change-image-button');

let currentMarker = null;
let currentImageIndex = 0;

const images = ['assets/img/map.png', 'assets/img/map2.png'];

function placeMarker(event) {
  const mapRect = mapImage.getBoundingClientRect();
  const x = event.clientX - mapRect.left;
  const y = event.clientY - mapRect.top;

  if (x >= 0 && x <= mapRect.width && y >= 0 && y <= mapRect.height) {
    if (currentMarker) {
      markerContainer.removeChild(currentMarker);
    }

    const marker = document.createElement('img');
    marker.className = 'marker';
    marker.src = 'assets/img/placeholder.png';
    
    // Set posisi marker relatif terhadap gambar
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;

    markerContainer.appendChild(marker);

    currentMarker = marker;
  }

  // Enable the "Next" button whenever a marker is placed
  changeImageButton.disabled = false;
}


function changeImage() {
  if (currentImageIndex < images.length - 1) {
    currentImageIndex++;
    mapImage.src = images[currentImageIndex];
  } else {
    var listContainer = document.getElementById("list-container");
    if (listContainer.style.display === "none" || listContainer.style.display === "") {
      listContainer.style.display = "block";
    } else {
      listContainer.style.display = "none";
    }
    changeImageButton.disabled = true;
  }
}

changeImageButton.addEventListener('click', changeImage);