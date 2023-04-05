const clientId = "536df2957a654a26b8d6ca940d9390ea"; // Replace with your client ID

export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchAlbums(token) {
    const result = await fetch("https://api.spotify.com/v1/me/albums", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchNewReleases(token) {
    const result = await fetch("https://api.spotify.com/v1/browse/new-releases?offset=0&limit=20", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    const profileImage = new Image(50, 50);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar").appendChild(profileImage);
}
