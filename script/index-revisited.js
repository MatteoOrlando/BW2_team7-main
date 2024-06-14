// friends btn
const friendsSection = document.getElementById("friends-section");
const sxSection = document.getElementById("sx-part");
const midSection = document.getElementById("mid-part");

// mid-banner dinamic
const midBanner = document.getElementById("bannerMid");
const myUrl = " https://striveschool-api.herokuapp.com/api/deezer/album";
let artistId = Math.floor(Math.random() * (756250 - 756150 + 1)) + 756150;

fetch(myUrl + "/" + artistId, {})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  })
  .then((artist) => {
    console.log(artist);
    createBanner(artist);
    savePlayerDataToLocalStorage(artist);
  })
  .catch((err) => {
    console.log(err);
  });

const createBanner = (data) => {
  const newBanner = document.createElement("div");
  newBanner.innerHTML = `
  <div class="row no-gutters">
              <div class="col-md-2">
                <img
                  src="${data.cover_medium}"
                  class="card-img rounded-0 ms-2 my-4"
                  alt="Card Image"
                />
              </div>
              <div class="col-md-10">
                <div
                  class="card-body py-3 d-flex flex-column justify-content-between h-100"
                >
                  <div class="d-flex justify-content-between">
                    <p class="fw-semibold">${data.record_type.toUpperCase()}</p>
                    <div
                      class="btn bg-grigino text-fontB rounded-5 fs-6"
                      id="hide-Banner-Btn"
                    >
                      NASCONDI ANNUNCI
                    </div>
                  </div>
                  <div class="mb-5">
                  <a href="./album.html?albumId=${
                    data.id
                  }" class="text-white Udiee">
                      <h5 class="card-title">${data.title}</h5>
                  </a>
                  <a href="./artisti.html?artistID=${
                    data.artist.id
                  }" class="text-white Udiee">
                    <p class="card-text">${data.artist.name}</p>
                    </a>
                    <p class="card-text">
                      <small>Ascolta il nuovo singolo di ${
                        data.artist.name
                      }</small>
                    </p>
                  </div>
                  <div >
                    <div
                      class="btn bg-primary text-light fw-semibold rounded-5 px-4 me-3" id="play-btn"
                    >
                      Play
                    </div>

                    <div
                      class="btn bg-black text-light fw-semibold rounded-5 border border-grigino px-4 me-3"
                    >
                      Salva
                    </div>
                    <i class="bi bi-three-dots"></i>
                 </div>
            </div>
      </div>
</div>
  `;
  // hide banner btn
  midBanner.appendChild(newBanner);
  document.getElementById("hide-Banner-Btn").addEventListener("click", () => {
    if (midBanner.style.display === "none") {
      midBanner.style.display = "block";
    } else {
      midBanner.style.display = "none";
    }
  });

  // player
  const playBtn = document.getElementById("play-btn");
  const audioElement = document.getElementById("audioDiv");
  const playerBar = document.getElementById("player-bar");
  const trackName = document.getElementById("song-name");
  const artistName = document.getElementById("artist-name");
  const albumCover = document.getElementById("album-cover");
  const playStopPlayer = document.getElementById("play-playerBar");

  audioElement.src = `${data.tracks.data[0].preview}`;

  trackName.textContent = `${data.title}`;
  artistName.textContent = `${data.artist.name}`;
  albumCover.src = `${data.cover_medium}`;

  // play-pause btn
  playStopPlayer.innerHTML = `
  <i class="bi bi-play-circle-fill"></i>`;

  playBtn.addEventListener("click", function () {
    if (audioElement.paused) {
      audioElement.play();
      playerBar.classList.remove("d-none");
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
  playStopPlayer.innerHTML = `
      <i class="bi bi-play-circle-fill"></i>
      `;

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

  // banner btn
  audioElement.addEventListener("click", function () {
    audioElement.pause();
    playerBar.classList.remove("d-none");
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
};

const savePlayerDataToLocalStorage = (data) => {
  const playerData = {
    trackName: data.title,
    artistName: data.artist.name,
    albumCover: data.cover_medium,
    audioElement: data.tracks.data[0].preview,
  };

  localStorage.setItem("playerData", JSON.stringify(playerData));
};
