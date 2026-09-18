console.log("Hello Ashish");
let songs;
let currentSong = new Audio();
let currfolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return String(minutes).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0');
}

function normalizeFolder(folder) {
    return String(folder || '').replace(/^\/+/, '').replace(/\/+$/, '').replace(/^songs\//, '');
}

async function getsongs(folder) {

    let a = await fetch("/songs.json");
    let data = await a.json();

    const cleanFolder = normalizeFolder(folder);
    currfolder = `songs/${cleanFolder}`;

    songs = data[cleanFolder];

    if (!Array.isArray(songs)) {
        console.error("No songs found for folder:", cleanFolder, data);
        songs = [];
    }

    let songUl = document.querySelector('.songlist').getElementsByTagName("ul")[0];

    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Ashish</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(songUl.getElementsByTagName("li")).forEach((e) => {
        e.addEventListener('click', () => {
            playMusic(
                e.querySelector(".info").firstElementChild.innerHTML.trim()
            );
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + encodeURIComponent(track);
    if (!pause) {
        currentSong.play();
        play.src = 'img/pause.svg';
    }

    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00"
}

async function displayAlbum() {

    let a = await fetch("/songs.json");
    let data = await a.json();

    let cardContainer = document.querySelector('.cardContainer');

    for (const folder of Object.keys(data)) {

        let a = await fetch(`/songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += `<div data-folder="${folder}" class="card">

            <div class="play">
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill="#1DB954" />
                    <path d="M20 16.5L36 25L20 33.5V16.5Z" fill="black" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">

            <h2>${response.title}</h2>
            <p>${response.description}</p>

        </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach((e) => {

        e.addEventListener('click', async (item) => {

            songs = await getsongs(
                item.currentTarget.dataset.folder
            );

            playMusic(songs[0]);
        });

    });
}

async function main() {

    await getsongs('first');
    playMusic(songs[0], true);

    displayAlbum();

    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'img/pause.svg';
        } else {
            currentSong.pause();
            play.src = 'img/play.svg';
        }
    })

    currentSong.addEventListener('timeupdate', () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    })

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-120%';
    })

    previous.addEventListener('click', () => {
        let currentTrack = decodeURIComponent(currentSong.src.split('/').slice(-1)[0]);
        let index = songs.indexOf(currentTrack);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    next.addEventListener('click', () => {
        let currentTrack = decodeURIComponent(currentSong.src.split('/').slice(-1)[0]);
        let index = songs.indexOf(currentTrack);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    // Volume slider and mute button
    const volumeInput = document.querySelector('.range input[type="range"]');
    const volumeIcon = document.querySelector('.volume > img');
    let lastVolume = 0.1;

    currentSong.volume = lastVolume;
    volumeInput.value = lastVolume * 100;

    volumeInput.addEventListener('input', (e) => {
        const volume = Number(e.target.value) / 100;
        currentSong.volume = volume;
        currentSong.muted = volume === 0;

        if (volume > 0) {
            lastVolume = volume;
            volumeIcon.src = 'img/volume.svg';
        } else {
            volumeIcon.src = 'img/mute.svg';
        }
    });

    volumeIcon.addEventListener('click', () => {
        if (currentSong.muted || currentSong.volume === 0) {
            currentSong.muted = false;
            currentSong.volume = lastVolume || 0.1;
            volumeInput.value = currentSong.volume * 100;
            volumeIcon.src = 'img/volume.svg';
        } else {
            lastVolume = currentSong.volume;
            currentSong.muted = true;
            volumeInput.value = 0;
            volumeIcon.src = 'img/mute.svg';
        }
    });
}

main();
