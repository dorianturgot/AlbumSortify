import {fetchMoreAlbums} from "./spotify.js";

const userIDSpotify = localStorage.getItem('userIDSpotify');
const albumListDiv = document.querySelector("#album-list");

const queryParams = new URLSearchParams(window.location.search);
const listID = queryParams.get('listID');

const urlParams = new URLSearchParams(window.location.search);
const MyListName = urlParams.get('listName');

console.log('userIDSpotify = ' + userIDSpotify);

var yourLists = document.getElementById('YourLists');
yourLists.innerHTML += MyListName;

// Default case : sort by last added to the list
showAlbums('date_created');

let currentSortOrder = "asc";

const moreAlbums = await fetchMoreAlbums(localStorage.getItem('accessToken'));
moreAlbumsSaved(moreAlbums);

if (userIDSpotify == null) {
  console.log('user not connected');
  document.getElementById('newListBtn').style.display = 'none';
  document.getElementById('deleteBtn').style.display = 'none';
}

document.getElementById("logoutBtnList").addEventListener("click", () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userIDSpotify');
  window.location.href = "https://albumsortify.fr/home.html";
});

document.getElementById("refreshBtnList").addEventListener("click", () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userIDSpotify');
  window.location.href = "https://albumsortify.fr/index.html";
});

document.getElementById('confirmDeleteListBtn').addEventListener('click', () => {
  deleteAllAlbumFromList(listID);
  deleteList(listID);
});

// Sort by name
document.getElementById('sortNameBtn').addEventListener('click', () => {
  document.getElementById('sortArtistBtn').classList.remove('active');
  document.getElementById('sortNameBtn').classList.add('active');
  document.getElementById('sortReleaseBtn').classList.remove('active');
  clearList();

  currentSortOrder = toggleSortOrder(currentSortOrder);

  showAlbums("name");
});

// Sort by artist
document.getElementById('sortArtistBtn').addEventListener('click', () => {
  document.getElementById('sortArtistBtn').classList.add('active');
  document.getElementById('sortNameBtn').classList.remove('active');
  document.getElementById('sortReleaseBtn').classList.remove('active');
  clearList();

  currentSortOrder = toggleSortOrder(currentSortOrder);

  showAlbums("artist");
});

// Sort by release date
document.getElementById('sortReleaseBtn').addEventListener('click', () => {
  document.getElementById('sortArtistBtn').classList.remove('active');
  document.getElementById('sortNameBtn').classList.remove('active');
  document.getElementById('sortReleaseBtn').classList.add('active');
  clearList();

  currentSortOrder = toggleSortOrder(currentSortOrder);

  showAlbums("releaseDate DESC");
});

function clearList() {
  document.getElementById('albumList').innerHTML = "";
}

function toggleSortOrder(currentSortOrder) {
  return currentSortOrder === "asc" ? "desc" : "asc";
}

function sortAlbums(sortBy, data) {
  var sortedAlbums = [];
  if (sortBy == "artist") {
    sortedAlbums = data.sort((a, b) => {
      if (a.artist < b.artist) {
        return currentSortOrder === "asc" ? -1 : 1;
      }
      if (a.artist > b.artist) {
        return currentSortOrder === "asc" ? 1 : -1;
      }
    });
  }
  else if (sortBy == "date_created") {
    sortedAlbums = data.sort((a, b) => {
      if (a.date_created < b.date_created) {
        return currentSortOrder === "asc" ? 1 : -1;
      }
      if (a.date_created > b.date_created) {
        return currentSortOrder === "asc" ? -1 : 1;
      }
    });
  }
  else if (sortBy == "name") {
    sortedAlbums = data.sort((a, b) => {
      if (a.name < b.name) {
        return currentSortOrder === "asc" ? -1 : 1;
      }
      if (a.name > b.name) {
        return currentSortOrder === "asc" ? 1 : -1;
      }
    });
  }
  else if (sortBy == "releaseDate DESC") {
    sortedAlbums = data.sort((a, b) => {
      if (a.releaseDate < b.releaseDate) {
        return currentSortOrder === "asc" ? 1 : -1;
      }
      if (a.releaseDate > b.releaseDate) {
        return currentSortOrder === "asc" ? -1 : 1;
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

        var deleteDiv = document.createElement('div');
  
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

        deleteDiv.appendChild(deleteBtn);
  
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
        
    
        listCard.appendChild(deleteDiv);
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
    //alert("Error deleting list.");
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
  month = month.charAt(0).toUpperCase() + month.slice(1);
  var day = date.getDate();
  var year = date.getFullYear();
  return day + " " + month + " " + year;
}

// -------- SEARCH BAR --------------- //

const searchBar = document.getElementById("searchbar");
searchBar.addEventListener("input", onSearchList);

// Fetches the search from search bar
export async function fetchSearchList(search) {
  const query = encodeURI(search);
  const result = await fetch("https://api.spotify.com/v1/search?query=" + query + "&type=album&offset=0&limit=3", {
      method: "GET", headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`}
  });

  return await result.json();
}

// Results from search and adds them to the page
export async function onSearchList(search) {
const results = await fetchSearchList(searchBar.value);
const resultsContainer = document.getElementById("results");

resultsContainer.innerHTML = "";

results.albums.items.forEach((alb) => {
  const albumCard = document.createElement("div");
  albumCard.classList.add("card");
  albumCard.classList.add("cardList");
  albumCard.classList.add("card-body");
  albumCard.classList.add("cardBodyScroll");

  const albumImage = document.createElement("img");
  albumImage.src = alb.images[0].url;
  albumImage.alt = alb.id;
  albumImage.addEventListener("click", () => {
    window.open(alb.external_urls.spotify, "_blank");
  });

  const albumTitle = document.createElement("h3");
  albumTitle.classList.add("card-title");
  albumTitle.textContent = alb.name;

  const albumArtistText = document.createElement("h4");
  albumArtistText.textContent = alb.artists[0].name;
  const albumArtist = document.createElement("a");
  albumArtist.href = alb.artists[0].external_urls.spotify;
  albumArtist.target = "_blank";
  albumArtist.classList.add("artistLink");
  albumArtist.appendChild(albumArtistText);


  const albumNbTracks = document.createElement("p");
  albumNbTracks.classList.add("card-text");
  albumNbTracks.classList.add("artistYear");
  albumNbTracks.classList.add("text-center");
  albumNbTracks.classList.add("smallNbTracks");

  const smallNbTracks = document.createElement("small");
  smallNbTracks.classList.add("text-muted");
  var trackStr = alb.total_tracks > 1 ? " tracks" : " track";
  smallNbTracks.textContent = alb.total_tracks + trackStr;
  albumNbTracks.appendChild(smallNbTracks);

  const addAlbumBtn = document.createElement("button");
  const plus = document.createElement("i");
  plus.classList.add("fa");
  plus.classList.add("fa-plus");
  plus.style.color = "white";
  addAlbumBtn.appendChild(plus);

  addAlbumBtn.classList.add("btn");
  addAlbumBtn.classList.add("btn-success");
  addAlbumBtn.classList.add("addBtn");
  addAlbumBtn.addEventListener("click", (event) => {
    //$("#addToListModal").modal('toggle');
    addAlbumToCurrentList(listID, userIDSpotify, alb);
    //addtolist.openAddToListModal(alb);
  });

  
  albumCard.appendChild(albumImage);
  albumCard.appendChild(addAlbumBtn);
  albumCard.appendChild(albumTitle);
  albumCard.appendChild(albumArtist);
  albumCard.appendChild(albumNbTracks);
  resultsContainer.appendChild(albumCard);
});
}

const delay = ms => new Promise(res => setTimeout(res, ms));

export function addAlbumToCurrentList(ListID, userIDSpotify, alb)
{
      // Make POST request to add the album to the album list
      fetch("https://albumsortify.fr:3000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userIDSpotify,
          name: alb.name,
          artist: alb.artists[0].name,
          picture_url: alb.images[0].url,
          url: alb.external_urls.spotify,
          releaseDate: alb.release_date,
          spotifyID: alb.id,
          listID: ListID,
          total_tracks: alb.total_tracks,
        }),
      })
        .then((response) => {
          if (response.status === 500) {
            throw new Error("Server Error");
          }
          return response.json();
        })
        .then(async (data) => {
          // Show to the user the success with an alert
          console.log("New album added to list:", data);
          document.getElementById("successAlert").classList.remove("d-none");
          document.getElementById("failedAlert").classList.add("d-none");
          await delay(500);
          document.getElementById("successAlert").classList.add("d-none");
          location.reload();
        })
        .catch((error) => {
          // Show to the user the error with an alert
          console.error("Error adding new album to list:", error);
          document.getElementById("failedAlert").classList.remove("d-none");
          document.getElementById("successAlert").classList.add("d-none");
        });
}

export function moreAlbumsSaved(lists) {
  document.getElementById("moreSavedAlbumsList").innerHTML = "";
  lists.items.forEach((alb) => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("card");
    albumCard.classList.add("cardList");
    albumCard.classList.add("card-body");
    albumCard.classList.add("savedAlbumsCard");
    albumCard.classList.add("cardBodyScroll");

    const albumImage = document.createElement("img");
    albumImage.src = alb.album.images[0].url;
    albumImage.alt = alb.album.id;
    albumImage.addEventListener("click", () => {
      window.open(alb.album.external_urls.spotify, "_blank");
    });

    const albumTitle = document.createElement("h3");
    albumTitle.classList.add("card-title");
    albumTitle.textContent = alb.album.name;

    const albumArtist = document.createElement("h4");
    albumArtist.textContent = alb.album.artists[0].name;

    const albumNbTracks = document.createElement("p");
    albumNbTracks.classList.add("card-text");
    albumNbTracks.classList.add("artistYear");
    albumNbTracks.classList.add("text-center");
    albumNbTracks.classList.add("smallNbTracks");

    const smallNbTracks = document.createElement("small");
    smallNbTracks.classList.add("text-muted");
    smallNbTracks.textContent = alb.album.total_tracks + " tracks (" + alb.album.release_date.substring(0, 4) + ")";
    albumNbTracks.appendChild(smallNbTracks);

    const addAlbumBtn = document.createElement("button");
    const plus = document.createElement("i");
    plus.classList.add("fa");
    plus.classList.add("fa-plus");
    plus.style.color = "white";
    addAlbumBtn.appendChild(plus);

    addAlbumBtn.classList.add("btn");
    addAlbumBtn.classList.add("btn-success");
    addAlbumBtn.classList.add("addBtn");
    addAlbumBtn.classList.add("addBtn");

    addAlbumBtn.setAttribute("data-bs-dismiss", "modal");

    addAlbumBtn.addEventListener("click", (event) => { 
      addAlbumToCurrentList(listID, userIDSpotify, alb.album);
    });

    
    albumCard.appendChild(albumImage);
    albumCard.appendChild(addAlbumBtn);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumArtist);
    albumCard.appendChild(albumNbTracks);
    

    document.getElementById("moreSavedAlbumsList").appendChild(albumCard);

  });
}