import { populateUI, fetchAlbums, fetchMoreAlbums, fetchProfile, fetchNewReleases, fetchTopArtists, fetchTopArtistsAlbums } from "./spotify.js";
import { openAddToListModal } from "./addtolist.js";

// --------------------- Start of Spotify API requirements --------------------- //

const clientId = "536df2957a654a26b8d6ca940d9390ea"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var token;
export var userIDSpotify;
var accessToken = localStorage.getItem('accessToken');

console.log(userIDSpotify)

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  console.log("logout");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userIDSpotify');
    window.location.href = "http://localhost:5173/home.html";
});

if (window.location.pathname === "/") {
  window.location.href = "/index.html";
}

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))


if(window.location.pathname === '/index.html') {
  if (!code && !accessToken) {
      redirectToAuthCodeFlow(clientId);
  } else {
      if (!accessToken) {
        accessToken = await getAccessToken(clientId, code);
        localStorage.setItem('accessToken', accessToken);
      }
      token = accessToken;
      const profile = await fetchProfile(accessToken);
      userIDSpotify = profile.id;
      localStorage.setItem('userIDSpotify', profile.id);
      populateUI(profile);
      await fetchLists(userIDSpotify, "DESC");
      const albums = await fetchAlbums(accessToken);
      getAlbums(albums);
      const moreAlbums = await fetchMoreAlbums(accessToken);
      
      moreAlbumsSaved(moreAlbums);
      const newReleases = await fetchNewReleases(accessToken);
      getLastReleases(newReleases);
      const topArtists = await fetchTopArtists(accessToken);
  
      getTopArtists(topArtists);
  }
} else if (window.location.pathname === '/home.html') {
    if (!accessToken) {
      window.location.href = "index.html";
    } else {
      window.location.href = "home.html";
    }
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/index.html");
    params.append("scope", "user-read-private user-read-email user-library-read user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/index.html");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

// --------------------- End of Spotify API requirements ---------------------

// --------------------- Start of Spotify API functions ---------------------


// Fetches the search from search bar
export async function fetchSearch(search) {
    const query = encodeURI(search);
    const result = await fetch("https://api.spotify.com/v1/search?query=" + query + "&type=album&offset=0&limit=6", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });

    return await result.json();
}

// Results from search and adds them to the page
export async function onSearch(search) {
  const results = await fetchSearch(searchBar.value);
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

    const albumArtist = document.createElement("h4");
    albumArtist.textContent = alb.artists[0].name;

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
      $("#addToListModal").modal('toggle');
      openAddToListModal(alb);
    });

    albumCard.appendChild(addAlbumBtn);
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumArtist);
    albumCard.appendChild(albumNbTracks);
    resultsContainer.appendChild(albumCard);
  });
}

// Fetches the search from search bar
export async function fetchSearchArtist(search) {
  const query = encodeURI(search);
  const result = await fetch("https://api.spotify.com/v1/search?query=" + query + "&type=artist&offset=0&limit=6", {
      method: "GET", headers: { Authorization: `Bearer ${token}`}
  });

  return await result.json();
}

// Results from searchArtist and adds them to the page
export async function onSearchArtist(search) {
  const results = await fetchSearchArtist(searchbarArtists.value);
  const resultsContainer = document.getElementById("resultsArtists");

  resultsContainer.innerHTML = "";

  results.artists.items.forEach((alb) => {
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
  albumTitle.textContent = alb.name;

  const artistBtn = document.createElement("button");
  const artistBtnLogo = document.createElement("i");
  artistBtn.innerText = "Albums";
  artistBtnLogo.classList.add("fas");
  artistBtnLogo.classList.add("fa-chevron-circle-down");
  artistBtnLogo.classList.add("mx-1");
  artistBtnLogo.style.color = "white";
  artistBtn.appendChild(artistBtnLogo);

  artistBtn.classList.add("btn");
  artistBtn.classList.add("btn-secondary");
  artistBtn.classList.add("artistBtn");

      
  artistBtn.addEventListener("click", async (event) => {
    $("#topArtistsModal").modal('toggle');
    var topArtistsAlbums = await fetchTopArtistsAlbums(accessToken, alb.id);
    getArtistAlbums(topArtistsAlbums);
  });

  albumCard.appendChild(artistBtn);
  albumCard.appendChild(albumImage);
  albumCard.appendChild(albumTitle);
  resultsContainer.appendChild(albumCard);
});
}

// // Search bar
const searchBar = document.getElementById("searchbar");
searchBar.addEventListener("input", onSearch);

// // Search bar artist
const searchbarArtists = document.getElementById("searchbarArtists");
searchbarArtists.addEventListener("input", onSearchArtist);

// Gets users's liked albums, displays them and adds them to the database if wanted
export function getAlbums(albums) {
  document.getElementById("albums").innerHTML = "";
  albums.items.forEach((alb) => {
      const albumCard = document.createElement("div");
      albumCard.classList.add("card");
      albumCard.classList.add("cardList");
      albumCard.classList.add("card-body");
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
      smallNbTracks.textContent = alb.album.total_tracks + " tracks - " + giveAlbumDuration(alb);
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
        $("#addToListModal").modal('toggle');
        openAddToListModal(alb.album);
      });

      albumCard.appendChild(addAlbumBtn);
      albumCard.appendChild(albumImage);
      albumCard.appendChild(albumTitle);
      albumCard.appendChild(albumArtist);
      albumCard.appendChild(albumNbTracks);
      

      document.getElementById("albums").appendChild(albumCard);
  });  
}

// Gets lasts releases from Spotify and displays them
export function getLastReleases(newAlbums) {
  document.getElementById("newReleases").innerHTML = "";
  newAlbums.albums.items.forEach((alb) => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("cardList");
    albumCard.classList.add("card");
    albumCard.classList.add("card-body");
    albumCard.classList.add("cardBodyScroll");

    const albumImage = document.createElement("img");
    albumImage.src = alb.images[0].url;
    albumImage.alt = alb.id;
    albumImage.addEventListener("click", () => {
      window.open(alb.external_urls.spotify, "_blank");
    });

    const albumTitle = document.createElement("h3");
    albumTitle.textContent = alb.name;

    const albumArtist = document.createElement("h4");
    albumArtist.textContent = alb.artists[0].name;

    const typeAlbum = document.createElement("h4");
    var trackStr = alb.total_tracks > 1 ? " tracks" : " track";
    typeAlbum.textContent = capitalizeFirstLetter(alb.album_type) + " - " + alb.total_tracks + trackStr;
    typeAlbum.classList.add("typeAlbum");

    // const hr = document.createElement("hr");
    // hr.classList.add("hr");

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
      $("#addToListModal").modal('toggle');
      openAddToListModal(alb);
    });

    albumCard.appendChild(addAlbumBtn);
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumArtist);
    //albumCard.appendChild(hr);
    albumCard.appendChild(typeAlbum);

    document.getElementById("newReleases").appendChild(albumCard);
  });
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Gets top artists from user profile and displays them
export function getTopArtists(topArtists) {
  document.getElementById("topArtists").innerHTML = "";
  topArtists.items.forEach((alb) => {
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
    albumTitle.textContent = alb.name;

    const artistBtn = document.createElement("button");
    const artistBtnLogo = document.createElement("i");
    artistBtn.innerText = "Albums";
    artistBtnLogo.classList.add("fas");
    artistBtnLogo.classList.add("fa-chevron-circle-down");
    artistBtnLogo.classList.add("mx-1");
    artistBtnLogo.style.color = "white";
    artistBtn.appendChild(artistBtnLogo);

    artistBtn.classList.add("btn");
    artistBtn.classList.add("btn-secondary");
    artistBtn.classList.add("artistBtn");

        
    artistBtn.addEventListener("click", async (event) => {
      $("#topArtistsModal").modal('toggle');
      var topArtistsAlbums = await fetchTopArtistsAlbums(accessToken, alb.id);
      getArtistAlbums(topArtistsAlbums);
      //openAddToListModal(topArtistsAlbums);
    });
  
    albumCard.appendChild(artistBtn);
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    

    document.getElementById("topArtists").appendChild(albumCard);
  });
}

// Gets top artists from user profile and displays them
export function getArtistAlbums(artistAlbums) {
  document.getElementById("topArtistsModalLabel").innerHTML = artistAlbums.items[0].artists[0].name + "'s albums";
  document.getElementById("topArtistsModalList").innerHTML = "";
  //console.log(artistAlbums);
  artistAlbums.items.forEach((alb) => {
    if(alb.total_tracks > 1)
    {
      const albumCard = document.createElement("div");
      albumCard.classList.add("card");
      albumCard.classList.add("cardList");
      albumCard.classList.add("card-body");
      albumCard.classList.add("savedAlbumsCard");
      albumCard.classList.add("cardBodyScroll");

      const albumImage = document.createElement("img");
      albumImage.src = alb.images[0].url;
      albumImage.alt = alb.id;
      albumImage.addEventListener("click", () => {
        window.open(alb.album.external_urls.spotify, "_blank");
      });

      const albumTitle = document.createElement("h3");
      albumTitle.classList.add("card-title");
      albumTitle.textContent = alb.name;

      const albumArtist = document.createElement("h4");
      albumArtist.textContent = alb.artists[0].name;

      const albumNbTracks = document.createElement("h4");
      albumNbTracks.textContent = alb.total_tracks + " Tracks";

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
        $("#addToListModal").modal('toggle');
        openAddToListModal(alb);
      });

      albumCard.appendChild(addAlbumBtn);
      albumCard.appendChild(albumImage);
      albumCard.appendChild(albumTitle);
      albumCard.appendChild(albumArtist);
      albumCard.appendChild(albumNbTracks);
      

      document.getElementById("topArtistsModalList").appendChild(albumCard);
    }
  });
}

// Gets every lists from the user
export async function fetchLists(userIDSpotify, sort) {
  fetch(`http://localhost:3000/albumlist/${userIDSpotify}` + '?sort=' + sort, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        getLists(data);
    });
}

// Displays every lists from the user
export function getLists(lists) {
  document.getElementById("lists").innerHTML = "";
  lists.forEach((albumlist) => {
    const listCard = document.createElement("div");
    listCard.classList.add("card");
    listCard.classList.add("listCard");

    const listCover = document.createElement("div");
    listCover.classList.add("listCover");
    listCover.classList.add("card-img-top");
    listCover.style.backgroundColor = albumlist.color;

    const linkPage = document.createElement("a");
    linkPage.href = "list.html?listID=" + albumlist.id + "&listName=" + albumlist.name;

    const listName = document.createElement("h5");
    listName.classList.add("card-title");
    listName.classList.add("display-1");
    listName.textContent = albumlist.name;

    linkPage.innerHTML = listCover.outerHTML;

    listCard.appendChild(linkPage);
    listCard.appendChild(listName);

    document.getElementById("lists").innerHTML += listCard.outerHTML;
  });
}


// Displays every lists from the user
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
    smallNbTracks.textContent = alb.album.total_tracks + " tracks - " + giveAlbumDuration(alb);
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
      $("#addToListModal").modal('toggle');
      openAddToListModal(alb.album);
    });

    albumCard.appendChild(addAlbumBtn);
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumArtist);
    albumCard.appendChild(albumNbTracks);
    

    document.getElementById("moreSavedAlbumsList").appendChild(albumCard);

  });
}

function giveAlbumDuration(alb) {
  //console.log(alb);
  let duration = 0;
  alb.album.tracks.items.forEach((track) => {
    duration += track.duration_ms;
  });
  // convert duration to H h M m S s
  let hours = Math.floor(duration / 3600000);
  let minutes = Math.floor((duration % 3600000) / 60000);
  let seconds = Math.floor(((duration % 360000) % 60000) / 1000);
  // only display hours if there are any
  if (hours > 0) {
    hours = hours + "h ";
  } else {
    hours = "";
  }
  duration = hours + minutes + "m " + seconds + "s";
  return duration;
}

var sortVar = "";

// Sort button listener for lists
document.getElementById("reverseSortBtn").addEventListener("click", () => {
  fetchLists(userIDSpotify, sortVar);
  if (sortVar === "DESC")
    sortVar = "";
  else
    sortVar = "DESC"; 
});