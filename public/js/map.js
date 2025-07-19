document.addEventListener("DOMContentLoaded", () => {
  if (!listingCoordinates) {
    console.error("Invalid geometry:", listingCoordinates);
    return;
  }

  mapboxgl.accessToken = token;

  const map = new mapboxgl.Map({
    container: "map", // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/outdoors-v12", // style URL
    center: listingCoordinates, // starting position
    zoom: 13, // starting zoom
  });

  const marker = new mapboxgl.Marker({color : "red"}).setLngLat(listingCoordinates).setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h5 class='rounded'>You will be staying here!</h5>")).addTo(map);

  map.addControl(new mapboxgl.FullscreenControl());
});
