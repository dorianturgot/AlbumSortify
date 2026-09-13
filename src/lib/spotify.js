import { prisma } from "./prisma";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

async function refreshAccessToken(refreshToken) {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return response.json();
}

export async function getValidSpotifyToken(userId) {
  const account = await prisma.account.findFirst({
    where: { userId: userId, provider: "spotify" },
  });

  if (!account) throw new Error("No Spotify account linked");

  const now = Math.floor(Date.now() / 1000);
  if (account.expires_at && account.expires_at < now) {
    const refreshedTokens = await refreshAccessToken(account.refresh_token);

    if (!refreshedTokens.error) {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: refreshedTokens.access_token,
          expires_at: now + refreshedTokens.expires_in,
          refresh_token: refreshedTokens.refresh_token ?? account.refresh_token, 
        },
      });
      return refreshedTokens.access_token;
    }
  }

  return account.access_token;
}

async function fetchWebApi(userId, endpoint, method = "GET") {
  const token = await getValidSpotifyToken(userId);
  const res = await fetch(`${SPOTIFY_API_URL}/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchSavedAlbums(userId, limit = 20) {
  return fetchWebApi(userId, `me/albums?offset=0&limit=${limit}`);
}

export async function fetchNewReleases(userId, limit = 20) {
  return fetchWebApi(userId, `browse/new-releases?offset=0&limit=${limit}`);
}

export async function fetchTopArtists(userId) {
  return fetchWebApi(userId, `me/top/artists`);
}

export async function fetchArtistAlbums(userId, artistId) {
  return fetchWebApi(userId, `artists/${artistId}/albums?limit=50&include_groups=album`);
}

export async function fetchArtist(userId, artistId) {
  return fetchWebApi(userId, `artists/${artistId}`);
}

export async function searchSpotify(userId, query, type = "album", limit = 10) {
  return fetchWebApi(userId, `search?query=${encodeURIComponent(query)}&type=${type}&offset=0&limit=${limit}`);
}

export async function fetchCurrentlyPlaying(userId) {
  const token = await getValidSpotifyToken(userId);
  const res = await fetch(`${SPOTIFY_API_URL}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 204) return null; // Nothing playing
  if (!res.ok) throw new Error("Failed to fetch currently playing");
  return res.json();
}
