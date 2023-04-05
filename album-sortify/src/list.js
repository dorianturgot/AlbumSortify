const userIDSpotify = localStorage.getItem('userIDSpotify');
const albumListDiv = document.querySelector("#album-list");

const queryParams = new URLSearchParams(window.location.search);
const listID = queryParams.get('listID');

console.log('userIDSpotify = ' + userIDSpotify);

fetch("http://localhost:3000/list/" + listID + "?userID=" + userIDSpotify, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
.then(response => {
  return response.json();
})
.then(data => {
  const albumList = document.getElementById('albumList');
  data.forEach(album => {
    const albumDiv = document.createElement('div');
    albumDiv.innerHTML = `<h3>${album.name} - ${album.artist}</h3>
                          <a href="${album.url}"><img src="${album.picture_url}" alt="${album.name}"></a>
                          <h4>${album.releaseDate}</h4>`;
    albumList.appendChild(albumDiv);
  });
})
.catch(error => console.error(error));
  