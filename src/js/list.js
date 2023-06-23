const userIDSpotify = localStorage.getItem('userIDSpotify');
const albumListDiv = document.querySelector("#album-list");

const queryParams = new URLSearchParams(window.location.search);
const listID = queryParams.get('listID');

const urlParams = new URLSearchParams(window.location.search);
const MyListName = urlParams.get('listName');

console.log('userIDSpotify = ' + userIDSpotify);

var yourLists = document.getElementById('YourLists');
yourLists.innerHTML += MyListName;

showAlbums('name');

document.getElementById("logoutBtnList").addEventListener("click", () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userIDSpotify');
  window.location.href = "https://albumsortify.fr/home.html";
});

document.getElementById('confirmDeleteListBtn').addEventListener('click', () => {
  deleteAllAlbumFromList(listID);
  deleteList(listID);
});

document.getElementById('sortNameBtn').addEventListener('click', () => {
  document.getElementById('sortArtistBtn').classList.remove('active');
  document.getElementById('sortNameBtn').classList.add('active');
  document.getElementById('sortReleaseBtn').classList.remove('active');
  clearList();
  showAlbums("name");
});

document.getElementById('sortArtistBtn').addEventListener('click', () => {
  document.getElementById('sortArtistBtn').classList.add('active');
  document.getElementById('sortNameBtn').classList.remove('active');
  document.getElementById('sortReleaseBtn').classList.remove('active');
  clearList();
  showAlbums("artist");
});

document.getElementById('sortReleaseBtn').addEventListener('click', () => {
  document.getElementById('sortArtistBtn').classList.remove('active');
  document.getElementById('sortNameBtn').classList.remove('active');
  document.getElementById('sortReleaseBtn').classList.add('active');
  clearList();
  showAlbums("releaseDate DESC");
});

function clearList() {
  document.getElementById('albumList').innerHTML = "";
}

function sortAlbums(sortBy, data) {
  var sortedAlbums = [];
  if (sortBy == "artist") {
    sortedAlbums = data.sort((a, b) => {
      if (a.artistName < b.artistName) {
        return -1;
      }
      if (a.artistName > b.artistName) {
        return 1;
      }
    });
  }
  // sortedAlbums = sort data per album's name
  else if (sortBy == "name") {
    sortedAlbums = data.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
    });
  }
  // sortedAlbums = sort data per release date
  else if (sortBy == "releaseDate DESC") {
    sortedAlbums = data.sort((a, b) => {
      if (a.releaseDate < b.releaseDate) {
        return 1;
      }
      if (a.releaseDate > b.releaseDate) {
        return -1;
      }
    });
  }
  return sortedAlbums;
}

function showAlbums(sortBy) {
  fetch("https://albumsortify.fr:3000/list/" + listID,{
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
    var sortedAlbums = sortAlbums(sortBy, data); // sort data

    sortedAlbums.forEach((album) => {
        const listCard = document.createElement("div");
        listCard.classList.add("card");
        listCard.classList.add("mb-3");
        listCard.classList.add("albumCard");
        listCard.classList.add("cardList");
        listCard.classList.add("text-center");
    
        const listCover = document.createElement("img");
        listCover.classList.add("albumCover");
        listCover.classList.add("albumCoverList");
        listCover.classList.add("card-img-top");
        listCover.src = album.picture_url;
    
        const linkPage = document.createElement("a");
        linkPage.href = album.url;
        linkPage.classList.add("albumCover");
  
        //
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("albumCard");
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.classList.add("albumCardBody");
     
        const listName = document.createElement("h5");
        listName.classList.add("card-title");
        listName.classList.add("albumName");
        listName.textContent = album.name;
  
        const listArtist = document.createElement("p");
        listArtist.classList.add("card-text");
        listArtist.classList.add("display-1");
        listArtist.classList.add("artistName");
        listArtist.textContent = album.artist;
  
        const listYear = document.createElement("p");
        listYear.classList.add("card-text");
        listYear.classList.add("artistYear");
  
        const smallYear = document.createElement("small");
        smallYear.classList.add("text-muted");
        smallYear.textContent = convertReleaseDate(album.releaseDate);
  
        listYear.appendChild(smallYear);
  
        const albumNbTracks = document.createElement("p");
        albumNbTracks.classList.add("card-text");
        albumNbTracks.classList.add("artistYear");
  
        const smallAlbumNbTracks = document.createElement("small");
        smallAlbumNbTracks.classList.add("text-muted");
        smallAlbumNbTracks.textContent = album.total_tracks + " Tracks";
  
        albumNbTracks.appendChild(smallAlbumNbTracks);
  
        var deleteBtn = document.createElement('button');
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("btn-danger");
        deleteBtn.classList.add("deleteBtn");
        const plus = document.createElement("i");
        plus.classList.add("fa");
        plus.classList.add("fa-minus");
        plus.style.color = "white";
        deleteBtn.appendChild(plus);
  
        deleteBtn.addEventListener("click", () => {
          deleteAlbum(album.id);
        });
  
        var listenInSpotify = document.createElement('button');
        listenInSpotify.classList.add("btn");
        listenInSpotify.classList.add("btn-success");
        listenInSpotify.classList.add("listenInSpotify");
        const spotify = document.createElement("i");
        spotify.classList.add("fab");
        spotify.classList.add("fa-spotify");
        listenInSpotify.appendChild(spotify);
  
        listenInSpotify.addEventListener("click", () => {
          console.log(album.spotifyID);
          window.open("spotify:album:" + album.spotifyID, '_blank');
        });
  
        linkPage.innerHTML = listCover.outerHTML;
  
        cardBody.appendChild(listName);
        cardBody.appendChild(listArtist);
        cardBody.appendChild(listYear);
        cardBody.appendChild(albumNbTracks);
        
        
        card.appendChild(listenInSpotify);
        card.appendChild(cardBody);
        
    
        listCard.appendChild(deleteBtn);
        listCard.appendChild(linkPage);
        
        listCard.appendChild(card);
    
        albumList.append(listCard);
      });
    });  
}

function deleteAlbum (albumID) {
  fetch("https://albumsortify.fr:3000/albums/" + albumID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.status === 500) {
      throw new Error("Server Error: " + response.statusText);
    } else {
      return response.json();
    }
  })
  .then(data => {
    console.log("Album deleted:", data);
    document.getElementById("deletedAlert").classList.remove("d-none");
    window.location.href = "list.html?listID=" + listID + "&listName=" + MyListName;
  })
  .catch(error => {
    console.error("Error deleting album:", error);
    alert("Error deleting album.");
  });
}

// ---------- UPDATING LIST -------------

var modal = document.getElementById("newListModal");

document.getElementById("newListName").value = MyListName;

var confirmBtnUpdateList = document.getElementById("confirmBtnNewList");

confirmBtnUpdateList.onclick = function() {
  const newListName = document.getElementById("newListName").value;
  const colorPicker = document.getElementById("colorPicker").value;

  if(newListName === "") {
    alert("Please enter a name for the list.");
    return;
  }

  fetch("https://albumsortify.fr:3000/albumlist/" + listID, {
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
        document.getElementById("updatedAlert").classList.remove("d-none");
      })
      .catch((error) => {
        console.error("Error updating list:", error);
        alert("Error updating list.");
      });
}

// ---------- DELETING LIST -------------

function deleteList() {
  fetch("https://albumsortify.fr:3000/albumlist/" + listID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.status === 500) {
      throw new Error("Server Error: " + response.statusText);
    } else {
      return response.json();
    }
  })
  .then(data => {
    console.log("List deleted:", data);
    window.location.href = "index.html";
  })
  .catch(error => {
    console.error("Error deleting list:", error);
    alert("Error deleting list.");
  });
}

function deleteAllAlbumFromList() {
  fetch("https://albumsortify.fr:3000/album/" + listID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.status === 500) {
      throw new Error("Server Error: " + response.statusText);
    } else {
      return response.json();
    }
  })
  .then(data => {
    console.log("All album from list deleted:", data);
    window.location.href = "index.html";
  })
  .catch(error => {
    console.error("Error deleting all albums from list:", error);
  });
}

// ----------------------------------- //
function convertReleaseDate(releaseDate)
{
  // convert string YYYY-MM-DD to Month Day, Year
  var date = new Date(releaseDate);
  var month = date.toLocaleString('default', { month: 'long' });
  var day = date.getDate();
  var year = date.getFullYear();
  return month + " " + day + ", " + year;
}
