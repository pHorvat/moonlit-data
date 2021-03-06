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
var devID;



var artistsIDs=[];

window.onSpotifyPlayerAPIReady = () => {
    const player = new Spotify.Player({
        name: 'Moonlit Web Player',
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


        var i=0;

        let artistsArr=[];
        while(state.track_window.current_track.artists.length!==i){
            artistsArr[i]=state.track_window.current_track.artists[i].name;
            i++;
        }
        var artistsJoined = artistsArr.join(', ');
        $('#current-track-artist').text(artistsJoined);



        //const artistLink = document.getElementById("current-track-artist");
        while(state.track_window.current_track.artists.length!==i){                 //Used for clickable artists, not currently working
           artistsArr[i]=state.track_window.current_track.artists[i].name;
           artistsIDs[i]=state.track_window.current_track.artists[i].uri;
           i++;

        }
        if(state.track_window.current_track.name !== document.getElementById("current-track-name").innerText){  //same as the comment above
            //requestArists(artistsIDs);
        }

        $('#current-track').attr('src', state.track_window.current_track.album.images[2].url);
        $('#current-track-name').text(state.track_window.current_track.name);


        //var artistsJoined = artistsArr.join(', ');
        //$('#current-track-artist').text(artistsJoined);
        //console.log(document.getElementById("current-track-name").innerText);



        document.getElementById("optionalCurrent").style.visibility = "visible";
        document.getElementById("optionalCurrent2").style.visibility = "visible";
        if(state.paused===true){
            document.getElementById("tglBtn").innerHTML = "PLAY <i class=\"fas fa-play\"></i>";
        }
        else {
            document.getElementById("tglBtn").innerHTML = "STOP <i class=\"fas fa-pause\"></i>";
        }

       /* player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID is not ready for playback', device_id);
            window.location.reload(true);
        });  */

    });

    // Ready
    player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);

        // Play a track using our new device ID


        setVol();
        devID=data.device_id;
        setTimeout(function (){
            play(data.device_id);
        } ,100);
        setTimeout(function (){
            suffle(data.device_id)
        } ,3000);

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

    function setVol() {
        player.setVolume(0.3).then(() => {
            console.log('Default volume set');
        });
    }


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

    setInterval(function(){
        player.getVolume().then(volume => {
            let volume_percentage = volume * 100;
            console.log(`The volume of the player is ${volume_percentage}%`);
            document.getElementById("myRange").value = volume_percentage;
        });
    }, 5000);

    document.getElementById("nxtBtn").addEventListener("click", nextSong);

    function nextSong(){
        //reset_animation();
        function reset_animation() {
            var el = document.getElementById('current-track');
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = null;
        }
        player.nextTrack().then(() => {

            console.log('Skipped to next track!');

        });

    }
}

var SpotifyURIs = [
    "spotify:track:3fg5irwtRekQSIOL1UjOId",
    "spotify:track:6EqPTDiCxs198Udt3prQg7",
    "spotify:track:7FCG2wIYG1XvGRUMACC2cD",
    "spotify:track:5WnPPuttuxYw0jyFnQYpcp",
    "spotify:track:4uLU6hMCjMI75M1A2tKUQC",
    "spotify:track:61ZM92T2zaXIVsqncThQzC",
    "spotify:track:4XdaaDFE881SlIaz31pTAG",
    "spotify:track:4LpqyPjeGvDbeHthlyk7xa",
    "spotify:track:2Nv0zFXjH4tYS7O1OGpvt7",
    "spotify:track:4qDHt2ClApBBzDAvhNGWFd",
    "spotify:track:118vbJqycPASVgrYnCzb9F",
    "spotify:track:55dTgpMdgmZoWUxXtJwGve",
    "spotify:track:30OzfackGMWBpHsRpvtAq6",
    "spotify:track:57724RmJKfjECtItkTmVZI",
    "spotify:track:74ddFVQ0oLkvm20NXddkfi",
    "spotify:track:1T2VdmzHeR9i5tpPJi5DHH",

]

// Play a specified track on the Web Playback SDK's device ID
function play(device_id) {

    axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
        params:{
            'device_id': device_id
        },
        data:{
           'uris': SpotifyURIs
        },
        headers: {
            'Authorization': 'Bearer '+ _token,
            //'Content-Type': 'application/json'
        }
    }).then(function (response){



    })

}


function suffle(device_id) {
    axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/shuffle\n',
        params: {
         'state': 'true',
         'device_id': device_id
        },
        headers: {
            'Authorization': 'Bearer '+ _token
        }
    })  .then(function (response) {
        //console.log(response.data);
        //console.log(response.status);
        //console.log(response.statusText);
        //console.log(response.headers);
        console.log(response.config);
    });

}

function requestArists(tempIDs){

    var i =0;
    var IDs = [];
    while (tempIDs.length !== i){
        var temp = tempIDs[i].split(':');
        IDs[i]=temp[2];
        //console.log(IDs[i]);
        i++;
    }

    //console.log(tempIDs.length);
    //console.log(tempIDs);
    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/artists',
        params: {
            'ids': IDs.join()
        },
        headers: {
            'Authorization': 'Bearer '+ _token
        }
    }).then(function (response){
        var artistData = response;
        console.log(artistData);
        //console.log(response.config);

        //document.getElementById('current-track-artist').innerHTML = "";
        artistsElement = document.getElementById('current-track-artist');
        //$("current-track-artist").empty()
        while (artistsElement.innerHTML !== "")
        {
            $("current-track-artist").empty()
            console.log("trying to empty")

        }



            let i = 0;
            while (IDs.length !== i) {

                var elementID = "artistLink" + i;
                var a = document.createElement('a');
                var link = document.createTextNode(artistData.data.artists[i].name + "    ");
                a.appendChild(link);
                //a.title = artistsArr[i];
                a.href = "#";
                a.id = elementID;
                a.classList.add("major");
                a.style = "text-decoration: none; font-weight: bold";
                const artistLink = document.getElementById("current-track-artist");
                var parentDiv = document.getElementById("parentElement");
                //parentDiv.insertBefore(a, artistLink.nextSibling);
                document.getElementById('current-track-artist').appendChild(a);
                i++;


            }

            document.getElementById("artistLink" + 1).addEventListener("click", artistImage);

            function artistImage() {
                $('#current-track').attr('src', response.data.artists[0].images[0].url);
            }

    })
artistsIDs = [];
}


/*
$.ajax({
     url: "https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=" + device_id,
     type: "PUT",
     data: '',
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
     },
     success: function (data) {
         console.log(data)

     }
 });
*/



