const clientId = "536df2957a654a26b8d6ca940d9390ea"; // Replace with your client ID

export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchAlbums(token) {
    const result = await fetch("https://api.spotify.com/v1/me/albums?offset=0&limit=20", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


export async function fetchMoreAlbums(token) {
    const result = await fetch("https://api.spotify.com/v1/me/albums?offset=0&limit=50", {
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

export async function fetchTopArtists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchTopArtistsAlbums(token, artistID) {
    const result = await fetch("https://api.spotify.com/v1/artists/" + artistID + "/albums", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export function populateUI(profile) {
    if (!profile.display_name)
    {
        document.getElementById("displayName").innerText = "You are not connected.";
    }
    else {
        document.getElementById("displayName").innerText = "Welcome " + profile.display_name;
        if(profile.images.length > 0)
        {
            const profileImage = new Image(50, 50);
            profileImage.src = profile.images[0].url;
            document.getElementById("avatar").innerHTML = profileImage.outerHTML;
        }
    }
}
