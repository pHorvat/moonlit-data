// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'a76acd175e5f456fb50b35d2ad2d19b5';
const redirectUri = 'https://phorvat.github.io/moonlit-data/moonlit-player';
const scopes = [
    'streaming',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-email'
];


// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true&`;
}

// Set up the Web Playback SDK

window.onSpotifyPlayerAPIReady = () => {
    const player = new Spotify.Player({
        name: 'Web Playback SDK Template',
        getOAuthToken: cb => { cb(_token); }
    });

    // Error handling
    player.on('initialization_error', e => console.error(e));
    player.on('authentication_error', e => console.error(e));
    player.on('account_error', e => console.error(e));
    player.on('playback_error', e => console.error(e));

    // Playback status updates
    player.on('player_state_changed', state => {
        console.log(state)
        $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
        $('#current-track-name').text(state.track_window.current_track.name);
        $('#current-track-artist').text(state.track_window.current_track.artists[0].name);
        if(state.paused===true){
            document.getElementById("tglBtn").innerHTML = "PLAY";
        }
        else {
            document.getElementById("tglBtn").innerHTML = "STOP";
        }
    });

    // Ready
    player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);

        // Play a track using our new device ID
        play(data.device_id);
    });

    // Connect to the player!
    player.connect();

    document.getElementById("tglBtn").addEventListener("click", togglePly);

    function togglePly() {
        player.togglePlay().then(() => {
            console.log('Toggled playback!');
        });
    }

    player.getCurrentState().then(state => {
        if (!state) {
            console.log('User is not playing music through the Web Playback SDK');

            return;
        }


        let {
            current_track,
            next_tracks: [next_track]
        } = state.track_window;

        console.log('Currently Playing', current_track);
        console.log('Playing Next', next_track);

    });

    player.setVolume(0.3).then(() => {
        console.log('Default volume set');
    });


    var slider = document.getElementById("myRange");
    //var output = document.getElementById("demo");
    //output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        //output.innerHTML = this.value;
        player.setVolume((this.value)/100).then(() => {
            console.log('Volume updated!');
        });
    }

}

// Play a specified track on the Web Playback SDK's device ID
function play(device_id) {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
        type: "PUT",
        data: '{"uris": ["spotify:track:4uLU6hMCjMI75M1A2tKUQC"]}',
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
        success: function(data) {
            console.log(data)
        }
    });
}
