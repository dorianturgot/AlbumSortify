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

// ---------- UPDATING LIST -------------

var modal = document.getElementById("newListModal");

// Get the button that opens the modal
var btn = document.getElementById("newListBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  document.getElementById("newListName").value = ""
  document.getElementById("colorPicker").value = "";
}

confirmBtnUpdateList.onclick = function() {
  const newListName = document.getElementById("newListName").value;
  const colorPicker = document.getElementById("colorPicker").value;

  fetch("http://localhost:3000/albumlist/" + listID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        name: newListName,
        color: colorPicker,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          throw new Error("Server Error: " + response.statusText);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log("List updated:", data);
        alert("List updated successfully!");
        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error updating list:", error);
        alert("Error updating list.");
      });
    }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 