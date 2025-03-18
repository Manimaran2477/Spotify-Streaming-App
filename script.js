const CLIENT_ID = "your_spotify_client_id";
const CLIENT_SECRET = "your_spotify_client_secret";

async function getToken() {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
}

async function searchSongs() {
    const searchQuery = document.getElementById("searchInput").value;
    if (!searchQuery) return;

    const token = await getToken();

    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    displayResults(data.tracks.items);
}

function displayResults(tracks) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    tracks.forEach((track) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song");

        songDiv.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}">
            <div>
                <h3>${track.name}</h3>
                <p>${track.artists[0].name}</p>
                <audio controls src="${track.preview_url}"></audio>
            </div>
        `;

        resultsDiv.appendChild(songDiv);
    });
}
