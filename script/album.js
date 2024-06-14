// * Qui dichiariamo all'interno di js TUTTI GLI ELEMENTI HTML
const imgAlbumTopSection = document.getElementById("imgAlbumTopSection");
const img2AlbumTopSection = document.getElementById("img2AlbumTopSection");
const titoloAlbumTopSection = document.getElementById("titoloAlbumTopSection");
const nomeArtistaTopSection = document.getElementById("nomeArtistaTopSection");
const annoTopSection = document.getElementById("annoTopSection");

const numeroBraniAlbumTopSection = document.getElementById(
  "numeroBraniAlbumTopSection"
);
const totMinutiTopSection = document.getElementById("totMinutiTopSection");
const containerRowSongs = document.getElementById("containerRowSongs");
const myURL = "https://striveschool-api.herokuapp.com/api/deezer/album";

// * INIZIO ACQUISIZIONE ID URL
const addressBarContent = new URLSearchParams(location.search);
console.log(addressBarContent);
const albumId = addressBarContent.get("albumId");
console.log(albumId);
// * FINE ACQUISIZIONE ID URL

const annoRandom = function () {
  const anno = Math.floor(Math.random() * (2025 - 1990 + 1) + 1990);
  return anno;
};

// * INZIO FUNZIONE PER CONVERTIRE I BELLISSIMI NUMERI DI JAVASCRIPT IN MINUTI E SECONDI SENSATI parte riassunto album
function convertiSecondiAMinutiESecondiTop(secondi) {
  const minuti = Math.floor(secondi / 60);
  const restantiSecondi = secondi % 60;

  if (restantiSecondi > 59) {
    minuti += 1;
    restantiSecondi -= 60;
  }
  const formatoMinutiSecondi = `${minuti} min ${
    restantiSecondi < 10 ? "0" : ""
  }${restantiSecondi} sec.`;

  return formatoMinutiSecondi;
}
// * FINE FUNZIONE PER CONVERTIRE I BELLISSIMI NUMERI DI JAVASCRIPT IN MINUTI E SECONDI SENSATI parte riassunto album

// * INZIO FUNZIONE PER CONVERTIRE I BELLISSIMI NUMERI DI JAVASCRIPT IN MINUTI E SECONDI SENSATI parte canzoni
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
// * FINE FUNZIONE PER CONVERTIRE I BELLISSIMI NUMERI DI JAVASCRIPT IN MINUTI E SECONDI SENSATI parte canzoni

const riproduzioniConIlPunto = function (numero) {
  const numeroFormattato = numero.toLocaleString();
  console.log(numeroFormattato);
  return numeroFormattato;
};

// * INIZIO FETCH
fetch(myURL + "/" + albumId)
  .then((response) => {
    // * Ora controlliamo che la risposta da parte del server sia "ok"; se ok, chiediamo di servirci tutti i dati in file json
    if (response.ok) {
      return response.json();
    }
    // * ALTRIMENTI, IN BASE ALL'ERRORE ANDIAMO A FINIRE NEL CATCH
    else {
      throw new Error("Errore nella chiamata");
    }
  })
  .then((album) => {
    console.log(album);
    document
      .getElementsByClassName("section1")[0]
      // * INIZIO REMOVE DELLA CLASSE "bg-primary"
      .classList.remove("bg-primary");
    // * FINE REMOVE DELLA CLASSE "bg-primary"
    // * INIZIO REMOVE DELLA CLASSE "PLACEHOLDER"
    imgAlbumTopSection.classList.remove("placeholder");
    img2AlbumTopSection.classList.remove("placeholder");
    titoloAlbumTopSection.classList.remove("placeholder");
    nomeArtistaTopSection.classList.remove("placeholder");
    annoTopSection.classList.remove("placeholder");
    numeroBraniAlbumTopSection.classList.remove("placeholder");
    totMinutiTopSection.classList.remove("placeholder");
    // * FINE REMOVE DELLA CLASSE "PLACEHOLDER"

    imgAlbumTopSection.src = `${album.cover_medium}`;
    img2AlbumTopSection.src = `${album.cover_small}`;
    applyBackgroundColorToContainer(album.cover_medium);
    titoloAlbumTopSection.innerText = `${album.title}`;
    nomeArtistaTopSection.innerText = `${album.artist.name} ·`;
    annoTopSection.innerText = `${annoRandom()} ·`;
    numeroBraniAlbumTopSection.innerText = `${album.tracks.data.length} brani ·`;
    totMinutiTopSection.innerText = `${convertiSecondiAMinutiESecondiTop(
      album.duration
    )} `;

    album.tracks.data.forEach((element, i) => {
      const rowSongDinamic = document.createElement("div");
      rowSongDinamic.classList.add("row", "g-0");
      rowSongDinamic.innerHTML = `    
        <div class="row g-1 g-md-0">
          <div class="col col-1 d-none d-md-block text-fontB50">${i + 1}</div>
          <div class="col col-12 col-md-6">
            <p class="mb-0 text-fontB fs-5 fw-medium">${element.title}</p>
            <a href="./artisti.html?artistID=${
              element.artist.id
            }" class="Udiee">
            <p class="mt-0 text-fontB50 opacity-50 Udiee ">${
              element.artist.name
            }</p>
            </a>
          </div>
          <div class="col col-4 d-none d-md-block">
            <p class="text-fontB50 ">${riproduzioniConIlPunto(element.rank)}</p>
          </div>
          <div class="col col-1 d-none d-md-block text-fontB50">${convertiSecondiAMinutiESecondi(
            element.duration
          )}</div>
        </div>`;
      containerRowSongs.appendChild(rowSongDinamic);
    });

    // audio e avanti e indietro funzioni
    const tracks = album.tracks.data;

    let currentTrackIndex = 0;

    const playBtnAlbum = document.getElementById("play-album-btn");
    const playerBar = document.getElementById("player-bar");

    playBtnAlbum.addEventListener("click", function () {
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
// * FINE FETCH

// * INIZIO DELLE FUNZIONI PER OTTENERE IL COLORO DI BACKGROUND IN BASE AL MIX COLORI DELL'IMMAGINE DELL'ALBUM
// Funzione per ottenere il colore dominante dall'immagine
function getDominantColor(imageUrl, callback) {
  // Crea un elemento immagine invisibile
  const img = document.createElement("img");
  img.crossOrigin = "Anonymous"; // Per consentire il caricamento di immagini da origini diverse

  // Aggiungi un evento al caricamento dell'immagine
  img.onload = function () {
    // Crea un canvas per estrarre i dati dell'immagine
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Imposta le dimensioni del canvas
    canvas.width = img.width;
    canvas.height = img.height;

    // Disegna l'immagine sul canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Estrai i dati dell'immagine
    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

    // Calcola il colore dominante
    let totalR = 0,
      totalG = 0,
      totalB = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      totalR += imageData[i];
      totalG += imageData[i + 1];
      totalB += imageData[i + 2];
    }

    const averageR = Math.round(totalR / (imageData.length / 4));
    const averageG = Math.round(totalG / (imageData.length / 4));
    const averageB = Math.round(totalB / (imageData.length / 4));

    // Restituisci il colore dominante sotto forma di stringa "rgb(r, g, b)"
    const dominantColor = `rgb(${averageR}, ${averageG}, ${averageB})`;

    // Richiama la callback con il colore dominante
    callback(dominantColor);
  };

  // Imposta la sorgente dell'immagine
  img.src = imageUrl;
}

// Funzione per applicare il colore di sfondo al contenitoreImgAlbum
function applyBackgroundColorToContainer(imageUrl) {
  getDominantColor(imageUrl, function (dominantColor) {
    // Seleziona l'elemento con id "contenitoreImgAlbum"
    const containerImgAlbum = document.getElementById("contenitoreImgAlbum");

    // Applica il colore di sfondo
    containerImgAlbum.style.backgroundColor = dominantColor;
  });
}

// * FINE DELLE FUNZIONI PER OTTENERE IL COLORO DI BACKGROUND IN BASE AL MIX COLORI DELL'IMMAGINE DELL'ALBUM

// logic for player bar

const playerBarLogic = (sourceAudio, data) => {
  const audioElement = document.getElementById("audioDiv");
  const trackName = document.getElementById("song-name");
  const artistName = document.getElementById("artist-name");
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
