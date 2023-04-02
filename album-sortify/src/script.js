import { getAlbums, populateUI, fetchAlbums, fetchProfile } from "./spotify.js";

const clientId = "536df2957a654a26b8d6ca940d9390ea"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var token;

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    token = accessToken;
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
    const albums = await fetchAlbums(accessToken);
    console.log(albums);
    getAlbums(albums);
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
    const result = await fetch("https://api.spotify.com/v1/search?query=" + query + "&type=album&offset=0&limit=20", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });

    return await result.json();
}

export async function onSearch(search)
{
    const results = await fetchSearch(searchBar.value);
    //const searchResults = document.getElementById("searchResults");
    //const cards = document.getElementsByClassName("card");

    document.getElementById("results").innerHTML = "";
    console.log(results.albums.items[0].name);
    console.log(search);

    results.albums.items.forEach((alb) => {
        const resultsHtml = `
        <div class="card">
            <a href="${alb.external_urls.spotify}"><img src="${alb.images[0].url}" alt=${alb.id} /></a>
            <h3>${alb.name}</h3>
            <h4>${alb.artists[0].name}</h4>
        </div>
      `
        document.getElementById("results").innerHTML += resultsHtml;
    });
}
console.log("yooo!!")
const searchBar = document.getElementById("searchbar");
searchBar.addEventListener("input", onSearch);
