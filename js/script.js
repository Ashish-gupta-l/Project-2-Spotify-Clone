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

// async function getsongs(folder) {
//     // let a = await fetch(`/${folder}/`);
//     // currfolder = folder;
//     // let response = await a.text();
//     // // console.log(response);
//     // let div = document.createElement('div');

//     // div.innerHTML = response;
//     // let as = div.getElementsByTagName('a');
//     // songs = []
//     // for (let index = 0; index < as.length; index++) {
//     //     const element = as[index];
//     //     if (element.href.endsWith(".mp3")) {
//     //         songs.push(element.href.split(`/${folder}/`)[1])
//     //     }

//     // }

//     let a = await fetch("/songs.json");
//     let data = await a.json();

//     currfolder = `songs/${folder}`;

//     songs = data[folder];


//     //show all the song in the playlist
//     let songUl = document.querySelector('.songlist').getElementsByTagName("ul")[0]
//     songUl.innerHTML = " "
//     for (const song of songs) {
//         songUl.innerHTML = songUl.innerHTML + `<li>
//                             <img class="invert" src="img/music.svg" alt="">
//                             <div class="info">
//                                 <div>${song.replaceAll("%20", " ")}</div>
//                                 <div>Ashish</div>
//                             </div>
//                             <div class="playnow">

//                                 <span>Play Now</span>
//                                 <img class="invert" src="img/play.svg" alt="">
//                             </div> </li>`;
//     }

//     //attach an eventListener to each song
//     Array.from(document.querySelector('.songlist').getElementsByTagName("li")).forEach((e) => {
//         e.addEventListener('click', (element) => {
//             // console.log(e.querySelector(".info").firstElementChild.innerHTML);
//             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
//         })
//     })
//     return songs;
// }

async function getsongs(folder) {

    let a = await fetch("/songs.json");
    let data = await a.json();

    currfolder = `songs/${folder}`;

    songs = data[folder];

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
    // let audio = new Audio('/songs/' + track);
    currentSong.src = `/${currfolder}/` + encodeURIComponent(track);
    if (!pause) {
        currentSong.play();
        play.src = 'img/pause.svg';
    }

    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00"
}

// async function displayAlbum() {
//     // let a = await fetch(`/songs/`);
//     let a = await fetch(`/songs.json`);
//     let response = await a.text();
//     // console.log(response);
//     let div = document.createElement('div');

//     div.innerHTML = response;
//     let anchor = div.getElementsByTagName('a');
//     let cardContainer = document.querySelector('.cardContainer')
//     let array = Array.from(anchor)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];


//         if (e.href.includes("/songs/")) {

//             let folder = e.href.split('/').slice(-1)[0];

//             //get metadata of folder
//             let a = await fetch(`/songs/${folder}/info.json`);
//             let response = await a.json();
//             // console.log(response);

//             cardContainer.innerHTML += `<div data-folder=${folder} class="card">
//                         <div class="play">
//                             <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
//                                 <circle cx="25" cy="25" r="25" fill="#1DB954" />

//                                 <path d="M20 16.5L36 25L20 33.5V16.5Z" fill="black" />
//                             </svg>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`

//         }
//         //Add event listner to Album
//         Array.from(document.getElementsByClassName("card")).forEach((e) => {
//             e.addEventListener('click', async item => {
//                 // console.log(item,item.currentTarget.dataset.folder)
//                 // songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
//                 songs = await getsongs(item.currentTarget.dataset.folder);
//                 playMusic(songs[0])
//             })
//         })

//     }
   

// }

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


    //list of song
    await getsongs('songs/first');
    playMusic(songs[0], true);
    // console.log(songs);

    //Display all album on page
    displayAlbum();

    //attach eventlistener on play,prev , next
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'img/pause.svg';
        } else {
            currentSong.pause();
            play.src = 'img/play.svg';
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

        //circle move
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add eventlistener to seekbar
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;

    })

    //Add eventListener on hamburger
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    })

    //Add eventListener on close
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-120%';
    })

    //Add eventListener on prev
    previous.addEventListener('click', () => {
        // console.log("prev clicked");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }

    })

    //Add eventListener on next
    next.addEventListener('click', () => {
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])

        // console.log(length);  //0
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);

        }
    })

    //Add event on volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        // console.log(e.target.value);
        currentSong.volume = (e.target.value) / 100;
    })

   //add event on volume to mute
   document.querySelector('.volume> img').addEventListener('click',e=>{
        // console.log(e.target.src);
        if(e.target.src.includes('volume.svg')){
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
            currentSong.volume = 0;
        }else{
            e.target.src = e.target.src.replace('mute.svg','volume.svg');
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10;
            currentSong.volume = .10;
        }
        
   })
}

main();
