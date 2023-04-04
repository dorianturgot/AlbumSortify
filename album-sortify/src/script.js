import { populateUI, fetchAlbums, fetchProfile } from "./spotify.js";

const clientId = "536df2957a654a26b8d6ca940d9390ea"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var token;
export var userIDSpotify;

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    token = accessToken;
    const profile = await fetchProfile(accessToken);
    userIDSpotify = profile.id;
    localStorage.setItem('userIDSpotify', profile.id);
    populateUI(profile);
    const albums = await fetchAlbums(accessToken);
    getAlbums(albums);
    await fetchLists(userIDSpotify);
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-library-read");
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
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

export async function fetchSearch(search) {
    const query = encodeURI(search);
    const result = await fetch("https://api.spotify.com/v1/search?query=" + query + "&type=album&offset=0&limit=6", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });

    return await result.json();
}

export async function onSearch(search) {
  const results = await fetchSearch(searchBar.value);
  const resultsContainer = document.getElementById("results");

  resultsContainer.innerHTML = "";

  results.albums.items.forEach((alb) => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("card");

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

    const addAlbumBtn = document.createElement("button");
    addAlbumBtn.textContent = "Add";
    addAlbumBtn.addEventListener("click", (event) => {
      const albumCard = event.target.closest(".card");
      const albumName = albumCard.querySelector("h3").textContent;
      const albumId = albumCard.querySelector("img").alt;

      fetch("http://localhost:3000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userIDSpotify,
          name: albumName,
          artist: alb.artists[0].name,
          picture_url: alb.images[0].url,
          url: alb.external_urls.spotify,
          releaseDate: alb.release_date,
          spotifyID: alb.id,
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
          console.log("New album added:", data);
          alert("Album added successfully!");
        })
        .catch((error) => {
          console.error("Error adding new album:", error);
          alert("Error adding album.");
        });
    });

    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumArtist);
    albumCard.appendChild(addAlbumBtn);
    resultsContainer.appendChild(albumCard);
  });
}

const searchBar = document.getElementById("searchbar");
searchBar.addEventListener("input", onSearch);


export function getAlbums(albums) {
  albums.items.forEach((alb) => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("card");

    const albumImage = document.createElement("img");
    albumImage.src = alb.album.images[0].url;
    albumImage.alt = alb.album.id;
    albumImage.addEventListener("click", () => {
      window.open(alb.album.external_urls.spotify, "_blank");
    });

    const albumTitle = document.createElement("h3");
    albumTitle.textContent = alb.album.name;

    const albumArtist = document.createElement("h4");
    albumArtist.textContent = alb.album.artists[0].name;

    const addAlbumBtn = document.createElement("button");
    addAlbumBtn.textContent = "Add";
    addAlbumBtn.addEventListener("click", (event) => {
      const albumCard = event.target.closest(".card");
      const albumName = albumCard.querySelector("h3").textContent;
      const albumId = albumCard.querySelector("img").alt; 

      fetch("http://localhost:3000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userIDSpotify,
          name: albumName,
          artist: alb.album.artists[0].name,
          picture_url: alb.album.images[0].url,
          url: alb.album.external_urls.spotify,
          releaseDate: alb.album.release_date,
          spotifyID: alb.album.id,
        }),
      })
        .then((response) => {
          if (response.status === 500) {
            throw new Error("Server Error");
          }
          return response.json();
        })
        .then((data) => {
          console.log("New album added:", data);
          alert("Album added successfully!");
        })
        .catch((error) => {
          console.error("Error adding new album:", error);
          alert("Error adding album.");
        });
    });

    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumArtist);
    albumCard.appendChild(addAlbumBtn);

    document.getElementById("albums").appendChild(albumCard);
  });
}

export async function fetchLists(userIDSpotify) {
  fetch(`http://localhost:3000/albumlist/${userIDSpotify}`, {
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

export function getLists(lists) {
  document.getElementById("lists").innerHTML = "";
  console.log(lists);
  lists.forEach((albumlist) => {
    const listCard = document.createElement("div");
    listCard.classList.add("listCard");

    const listCover = document.createElement("div");
    listCover.setAttribute("class", "listCover");
    listCover.style.backgroundColor = albumlist.color;
    listCover.addEventListener("click", () => {
      window.open("list.html", "_blank");
    });

    const listName = document.createElement("h3");
    listName.textContent = albumlist.name;

    listCard.appendChild(listCover);
    listCard.appendChild(listName);

    document.getElementById("lists").innerHTML += listCard.outerHTML;
    //document.getElementById("lists").appendChild(listCard);
  });
}

