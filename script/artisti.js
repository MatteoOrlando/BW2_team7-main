// getting reference of elements to fill
const artistCover = document.getElementById("artist-cover");
const artistName = document.getElementById("artist-name");
const artistListeners = document.getElementById("nb-fan");
const tracksContainer = document.getElementById("traccia-album");
const artistCircular = document.getElementById("artist-circular");
const byArtist = document.getElementById("by-artist");
const numberOfLikes = document.getElementById("likes-num");
const moreButton = document.getElementById("visaulizza");

//funzione svuota col
const emptyCol = () => {
  tracksContainer.innerHTML = ``;
};
//funzione random mi piace
const randomLikes = () => {
  let likes = Math.ceil(Math.random() * 11);
  numberOfLikes.innerText = `${likes}`;
};

// FUNZIONE di Francesco per il minutaggio
function convertiSecondiAMinutiESecondi(secondi) {
  const minuti = Math.floor(secondi / 60);
  const restantiSecondi = secondi % 60;
  if (restantiSecondi > 59) {
    minuti += 1;
    restantiSecondi -= 60;
  }
  const formatoMinutiSecondi = `${minuti}:${
    restantiSecondi < 10 ? "0" : ""
  }${restantiSecondi}`;

  return formatoMinutiSecondi;
}
// funzione punto
const riproduzioniConIlPunto = function (numero) {
  const numeroFormattato = numero.toLocaleString();
  console.log(numeroFormattato);
  return numeroFormattato;
};

//funzione tracklist
const gettingTracks = (tracks) => {
  tracks.forEach((track, i) => {
    // emptyCol();
    const newRow = document.createElement("div");
    newRow.classList.add("row", "align-items-center", "g-3", "my-3");
    newRow.innerHTML = `
                <div class="col-2 col-md-1">
                <h5>${i + 1}</h5>
                </div>
                <div class="col-2 col-md-1">
                <img src="${
                  track.album.cover_small
                }" class="img-thumbnail" alt="album-cover">
                <source src="${track.preview}" type="audio/mp3" />
              </div>
              <div class="col-4 col-md-6">
                <h5>${track.title_short}</h5>
              </div>
              <div class="col-4 d-md-none">
                <i class="bi bi-three-dots-vertical text-fontB50 fs-1"></i>
              </div>
              <div class="col-12 flex-grow-1 d-flex justify-content-center col-md-2 d-md-block">
                <h6 class="fw-light">${riproduzioniConIlPunto(track.rank)}</h6>
              </div>
              <div class="col col-md-2 d-none d-md-block">
                <h6 class="fw-light">${convertiSecondiAMinutiESecondi(
                  track.duration
                )}</h6>
              </div>`;
    tracksContainer.appendChild(newRow);
    if (i > 9) {
      newRow.classList.add("d-none");
    }
    console.log("track.preview", track.preview);

    moreButton.addEventListener("click", () => {
      newRow.classList.toggle("d-none");
    });
  });
};
// // //funzione playing music
// const playButton = document.getElementById("play button");
// console.log(playButton);
// const playingMusic = (tracks) => {
//   playButton.addEventListener("click", () => {
//     play(tracks[0].preview);
//   });
// };

const playButton = document.getElementById("play-btn");

// riempio dinamicamente la pagina
const artistURL = "https://striveschool-api.herokuapp.com/api/deezer/artist";
const addressBar = new URLSearchParams(location.search);
const artistID = addressBar.get("artistID");
// const artistID = 418;
fetch(artistURL + "/" + artistID)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  })
  .then((artist) => {
    console.log(artist);
    //condizione bg-img con media queries
    // if (window.innerWidth <= 576) {
    //   artistCover.style.backgroundImage = `url(${artist.picture_medium})`;
    // } else {
    // }
    artistCover.style.backgroundImage = `url(${artist.picture_xl})`;
    artistCover.style.backgroundRepeat = "no-repeat";
    artistCover.style.backgroundSize = "cover";
    artistCover.classList.add("img-fluid");
    artistName.innerText = `${artist.name}`;
    artistListeners.innerText = riproduzioniConIlPunto(artist.nb_fan);
    artistCircular.src = `${artist.picture}`;
    byArtist.innerText = `di ${artist.name}`;
    //richaimo funzione per dare like a random
    randomLikes();

    // faccio fetch dell'api nell'api
    const artistTracklist = artist.tracklist;
    console.log(artistTracklist);
    fetch(artistTracklist)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      //ora posso lavorare con l'array delle tracce
      .then((tracklist) => {
        console.log(tracklist.data);
        console.log(tracklist.data.preview);
        gettingTracks(tracklist.data);
        // playingMusic(tracklist.data);
        //   playButton.addEventListener("click", () => {
        //     playerBarLogic(tracklist.data[0].preview, tracklist.data[0])
        //     ;
        //   });
        // });
        console.log(tracklist);
        const tracks = tracklist.data;

        let currentTrackIndex = 0;

        const playerBar = document.getElementById("player-bar");

        playButton.addEventListener("click", function () {
          playerBar.classList.remove("d-none");

          const audio = tracks[currentTrackIndex].preview;

          playerBarLogic(audio, tracks[currentTrackIndex]);
        });

        const nextBtn = document.getElementById("next-btn");
        const prevBtn = document.getElementById("prev-btn");
        nextBtn.addEventListener("click", function () {
          currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
          const audio = tracks[currentTrackIndex].preview;
          console.log(currentTrackIndex);
          playerBarLogic(audio, tracks[currentTrackIndex]);
        });

        prevBtn.addEventListener("click", function () {
          currentTrackIndex =
            (currentTrackIndex - 1 + tracks.length) % tracks.length;
          console.log(currentTrackIndex);
          const audio = tracks[currentTrackIndex].preview;

          playerBarLogic(audio, tracks[currentTrackIndex]);
        });
      });
  })

  // qui gestisco l'errore che ho'gettato' nell'else
  .catch((err) => {
    alert(err);
  });

// funzione per player
const playerBarLogic = (sourceAudio, data) => {
  const audioElement = document.getElementById("audioDiv");
  const trackName = document.getElementById("song-name");
  const artistName = document.getElementById("artist-name-player");
  console.log(artistName);
  const albumCover = document.getElementById("album-cover");
  const playStopPlayer = document.getElementById("play-playerBar");

  audioElement.src = sourceAudio;

  audioElement.play();

  // dinamic text and img
  trackName.textContent = `${data.title}`;
  artistName.textContent = `${data.artist.name}`;
  albumCover.src = `${data.album.cover_medium}`;

  // play-pause btn
  playStopPlayer.innerHTML = ` <i class="bi bi-pause-circle-fill"></i>`;
  playStopPlayer.addEventListener("click", function () {
    if (audioElement.paused) {
      audioElement.play();
      playStopPlayer.innerHTML = `
        <i class="bi bi-pause-circle-fill"></i>
      `;
    } else {
      audioElement.pause();
      playStopPlayer.innerHTML = `
        <i class="bi bi-play-circle-fill"></i>
      `;
    }
  });

  // progress bar
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");

  const updateProgressBar = () => {
    const duration = audioElement.duration;
    const currentTime = audioElement.currentTime;
    const progressPercentage = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  };

  const setAudioProgress = (e) => {
    const clickX = e.clientX - progressContainer.getBoundingClientRect().left;
    const containerWidth = progressContainer.clientWidth;
    const progressPercentage = (clickX / containerWidth) * 100;
    audioElement.currentTime =
      (progressPercentage / 100) * audioElement.duration;
  };

  audioElement.addEventListener("timeupdate", updateProgressBar);
  progressContainer.addEventListener("click", setAudioProgress);

  let isDragging = false;

  progressContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    setAudioProgress(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      setAudioProgress(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  audioElement.addEventListener("timeupdate", updateProgressBar);

  // time left
  const timeLeft = document.getElementById("time-left");
  const time = document.getElementById("time");

  audioElement.addEventListener("loadedmetadata", function () {
    const duration = audioElement.duration;
    time.textContent = formatTime(duration);
  });

  audioElement.addEventListener("timeupdate", function () {
    const currentTime = audioElement.currentTime;
    timeLeft.textContent = formatTime(currentTime);
  });

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // mute btn
  const muteBtn = document.getElementById("mute-Unmute");
  muteBtn.innerHTML = `
    <i class="bi bi-volume-up"></i>
  `;
  muteBtn.addEventListener("click", () => {
    if (audioElement.muted) {
      audioElement.muted = false;
      muteBtn.innerHTML = `
      <i class="bi bi-volume-up"></i>
      `;
    } else {
      audioElement.muted = true;
      muteBtn.innerHTML = `
      <i class="bi bi-volume-mute"></i>
      `;
    }
  });

  // volume slider
  const volumeSlider = document.getElementById("volumeSlider");

  volumeSlider.addEventListener("input", () => {
    audioElement.volume = volumeSlider.value;

    if (volumeSlider.value <= 0.6) {
      muteBtn.innerHTML = `<i class="bi bi-volume-down fs-4 "></i>`;
    } else {
      muteBtn.innerHTML = `
      <i class="bi bi-volume-up"></i>
      `;
    }
  });
};
