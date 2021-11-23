let token;

const clientID = "67d24e845d5e4399a8be009539002de8";
// const redirectURI = "http://localhost:3000/";
const redirectURI = "http://mac.surge.sh";


const Spotify = {
    getAccessToken() {
        if (token) return token;

        const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiryMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (tokenMatch && expiryMatch) {
            token = tokenMatch[1];
            let expiryTime = Number(expiryMatch[1]);

            window.setTimeout(() => token = "", expiryTime * 1000);
            window.history.pushState("Access Token", null, "/");

            return token;
        } else {
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        try {
            const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (response.ok) {
                const jsonResponse = await response.json();

                if (!jsonResponse.tracks) return [];
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            }
        } catch (error) {
            console.log(error)
        }
    },

    async savePlaylist(name, URIs) {
        if (!name || !URIs.length) return;

        const accessToken = token;
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;
        const url = "https://api.spotify.com/v1/me";

        try {
            const response = await fetch(url, { headers: headers });
            if (response.ok) {
                const jsonResponse = await response.json();
                userID = jsonResponse.id;
                const url = `https://api.spotify.com/v1/users/${userID}/playlists`

                try {
                    const response = await fetch(url, {
                        headers: headers,
                        method: "POST",
                        body: JSON.stringify({ name: name })
                    });
                    if (response.ok) {
                        const jsonResponse = await response.json();
                        const playlistID = jsonResponse.id;
                        const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

                        try {
                            const response = await fetch(url, {
                                headers: headers,
                                method: "POST",
                                body: JSON.stringify({ uris: URIs })
                            });
                            if (response.ok) {
                                const jsonResponse = await response.json();
                                console.log(jsonResponse);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
};

export default Spotify;




















// let accessToken;

// const clientId = '67d24e845d5e4399a8be009539002de8';
// // const  = '------------------------------';

// const redirectUri = 'http://localhost:3000/';



// const Spotify = {



//     getAccessToken() {

//         if (accessToken) {

//             return accessToken;

//         }

//         // check for token access first

//         const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);

//         const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);



//         if (accessTokenMatch && expiresInMatch) {

//             accessToken = accessTokenMatch[1];

//             const expiresIn = Number(expiresInMatch[1]);

//             // clears parameters and grabs new access token after previous one expires

//             window.setTimeout(() => accessToken = '', expiresIn * 1000);

//             window.history.pushState('Access Token', null, '/');

//             return accessToken;

//         } else {

//             const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

//             window.location.href = accessUrl;

//         }

//     },

//     search(term) {

//         const accessToken = Spotify.getAccessToken();

//         return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {

//             headers: {

//                 Authorization: `Bearer ${accessToken}`

//             }

//         }).then(response => {

//             return response.json();

//         }).then(jsonResponse => {

//             if (!jsonResponse.tracks) {

//                 return [];

//             }

//             return jsonResponse.tracks.items.map(track => ({

//                 id: track.id,

//                 name: track.name,

//                 artist: track.artists[0].name,

//                 album: track.album.name,

//                 uri: track.uri

//             }));

//         });

//     },

//     savePlaylist(name, trackUris) {

//         if (!name || !trackUris.length) {

//             return;

//         }

//         const accessToken = Spotify.getAccessToken();

//         const headers = { Authorization: `Bearer ${accessToken}` };

//         let userId;



//         return fetch('https://api.spotify.com/v1/me', { headers: headers }

//         ).then(response => response.json()

//         ).then(jsonResponse => {

//             userId = jsonResponse.id;

//             return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {

//                 headers: headers,

//                 method: 'POST',

//                 body: JSON.stringify({ name: name })

//             }).then(response => response.json()

//             ).then(jsonResponse => {

//                 const playlistId = jsonResponse.id;

//                 return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {

//                     headers: headers,

//                     method: 'POST',

//                     body: JSON.stringify({ uris: trackUris })

//                 })

//             })

//         })

//     }

// }

// export default Spotify;