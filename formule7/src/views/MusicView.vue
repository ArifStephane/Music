<template>
  <div class="img-blur" :style="{ background: 'url(' + current.img + ')' }">
    <div
      class="
        bg-content
        d-flex
        align-items-center
        justify-content-center
      "
    >
      <div
        v-if="!music"
        class="player d-flex flex-column justify-content-center"
      >
        <div class="details__player d-flex flex-column justify-content-center">
          <div
            class="
              px-3
              about__player
              d-flex
              flex-row
              align-items-center
              justify-content-between
            "
          >
            <div class="arrow-bottom"><i class="bx bx-chevron-down"></i></div>
            <div
              class="
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
            >
              <div class="from__track">Lecture depuis</div>
              <div class="from__track-title">
                <a
                  class="link_album"
                  href="https://www.twitter.com/loicfarel"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Arif Stephane</a
                >
              </div>
            </div>
            <div class="dot"><i class="bx bx-dots-vertical-rounded"></i></div>
          </div>
          <div
            @dblclick="likeDislike"
            class="track__image align-self-center px-2"
            :style="{ background: 'url(' + current.img + ')' }"
            title="Double click pour liker ou disliker"
          ></div>
        </div>
        <div class="details__track mt-3">
          <div @click="like" v-if="!current.like" class="like" title="Like">
            <i class="bx bx-heart"></i>
          </div>
          <div @click="dislike" v-else class="like" title="Dislike">
            <i class="bx bxs-heart"></i>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <div class="track__name">{{ current.title }}</div>
            <div class="track__artiste">{{ current.artist }}</div>
          </div>
          <div @click="playlist" class="playlist" title="Playlist">
            <i class="bx bxs-playlist"></i>
          </div>
        </div>
        <div class="px-4 mt-5 time__slide__player d-flex flex-column">
          <input
            v-model="piste"
            @change="setPiste"
            class="time__slider"
            type="range"
            min="0"
            max="100"
            name="time"
          />
          <div class="mt-2 d-flex flex-row justify-content-between">
            <div class="current__time">{{ current_duree }}</div>
            <div class="total__time">{{ total_duree }}</div>
          </div>
        </div>

        <div class="buttons__player mt-3 px-2">
          <div v-if="boucle === 'ordre'" @click="ordre" class="repeat">
            <i class="bx bx-transfer"></i>
          </div>
          <div v-else-if="boucle === 'all'" @click="repeatAll" class="repeat">
            <i class="bx bx-refresh"></i>
          </div>
          <div v-else @click="repeatOne" class="repeat">
            <i class="bx bx-reset"></i>
          </div>
          <div @click="prev" class="prev" title="Prev">
            <i class="bx bx-skip-previous"></i>
          </div>
          <div v-if="!isPlaying" @click="playe" class="pause-play" title="Play">
            <i class="bx bx-play-circle"></i>
          </div>
          <div v-else @click="pause" class="pause-play" title="Pause">
            <i class="bx bx-pause-circle"></i>
          </div>
          <div @click="next" class="next" title="Next">
            <i class="bx bx-skip-next"></i>
          </div>
          <div class="shuffle"><i class="bx bx-shuffle"></i></div>
        </div>
        <div
          class="
            volume__player
            mt-3
            d-flex
            align-items-center
            justify-content-center
          "
        >
          <i v-if="volume == 0" class="bx bx-volume-mute"></i>
          <i v-else class="bx bx-volume-low"></i>
          <input
            v-model="volume"
            @change="setVolume"
            type="range"
            min="0"
            max="100"
            name="volume"
            class="mx-3 volume__slider"
          />
          <i class="bx bx-volume-full"></i>
        </div>
        <!-- <div
        class="
          number__tracks
          d-flex
          align-items-center
          justify-content-center
        "
      >
        <span>{{ index + 1 }}/{{ songs.length }}</span>
      </div> -->
      </div>
      <!-- v-if="!seePlaylist" -->
      <transition name="slide">
        <div
          v-if="!seePlaylist"
          class="list__player d-flex flex-column justify-content-center"
        >
          <div
            class="
              py-2
              list__player-header
              d-flex
              align-items-center
              justify-content-between
            "
          >
            <div @click="playlist" class="arrow__back">
              <i class="bx bx-left-arrow-alt"></i>
            </div>
            <div class="title">File de lecture</div>
            <div class="dots"><i class="bx bx-dots-vertical-rounded"></i></div>
          </div>
          <div class="list_player-body overflow__scroll">
            <div
              v-for="(song, indexe) in this.songs"
              :key="indexe"
              :class="
                song.src === current.src && isPlaying
                  ? 'track__execute_play'
                  : song.src === current.src
                  ? 'track__execute'
                  : ''
              "
              class="list__track d-flex justify-content-between"
            >
              <div
                @click="playClick(song, indexe)"
                class="d-flex align-items-center"
              >
                <div
                  class="img-track"
                  :style="{ background: 'url(' + song.img + ')' }"
                ></div>
                <div class="d-flex flex-column mt-2">
                  <div class="name__track">{{ song.title }}</div>
                  <div class="artist__track">{{ song.artist }}</div>
                </div>
              </div>
              <div
                v-if="!song.like"
                @click="likeListe(indexe)"
                class="button__like align-self-center pe-2"
              >
                <i class="bx bx-heart"></i>
              </div>
              <div
                v-else
                @click="dislikeListe(indexe)"
                class="button__like align-self-center pe-2"
              >
                <i class="bx bxs-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      iconeCurrent: require("../assets/utils/audio.svg"),
      seePlaylist: true,
      music: false,
      current: {},
      index: 0,
      isPlaying: false,
      songs: [
        {
          title: "Afsana",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Afsana.mp3"),
          like: false,
        },

        {
          title: "Alliance",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Alliance.mp3"),
          like: false,
        },
        {
          title: "Bakalos",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Bakalos.mp3"),
          like: false,
        },
        {
          title: "Centième dossier",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Centième dossier.mp3"),
          like: false,
        },
        {
          title: "Coeur Amoureux",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Coeur Amoureux.mp3"),
          like: false,
        },
        {
          title: "Date d anniversaire",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Date d anniversaire.mp3"),
          like: false,
        },
        {
          title: "SL",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/SL.mp3"),
          like: false,
        },
        {
          title: "Noctambule",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Noctambule.mp3"),
          like: false,
        },
        {
          title: "Mutzig Class",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Mutzig Class.mp3"),
          like: false,
        },
        {
          title: "MH",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/MH.mp3"),
          like: false,
        },
        {
          title: "Mal accompagné",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Mal accompagné.mp3"),
          like: false,
        },
        {
          title: "Mayday",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Mayday.mp3"),
          like: false,
        },
        {
          title: "Honorable",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Honorable.mp3"),
          like: false,
        },
        {
          title: "Éternité",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Éternité.mp3"),
          like: false,
        },
        {
          title: "Formule 7",
          artist: "Fally Ipupa",
          img: require("../assets/img/music/Cover.jpg"),
          src: require("../assets/file/Formule 7.mp3"),
          like: false,
        },
      ],
      player: new Audio(),
      update_duree: null,
      current_duree: "00:00",
      total_duree: "00:00",
      repetition: 0,
      boucle: "ordre",
      OneRepeate: false,
      volume: 60,
      piste: 0,
      i: 0,
    };
  },
  methods: {
    playlist() {
      if (this.seePlaylist == true) {
        this.music = true;
        this.seePlaylist = false;
      } else {
        this.seePlaylist = true;
        this.music = false;
      }
    },

    createSong() {
      if (JSON.parse(localStorage.getItem("piste"))) {
        this.index = JSON.parse(localStorage.getItem("piste"));
      } else {
        this.index = 0;
      }
      this.current = this.songs[this.index];
      this.player.src = this.current.src;
    },

    stockageFavoris() {
      localStorage.setItem("favoris", JSON.stringify(this.songs));
    },
    stockagePiste() {
      localStorage.setItem("piste", JSON.stringify(this.index));
    },

    random_bg_color() {
      // Get a number between 64 to 256 (for getting lighter colors)
      let red = Math.floor(Math.random() * 256) + 64;
      let green = Math.floor(Math.random() * 256) + 64;
      let blue = Math.floor(Math.random() * 256) + 64;
      let bgColor = "rgb(" + red + "," + green + "," + blue + "," + "0.6" + ")";
      console.log(bgColor);

      // Set the background to that color
      // document.querySelector(".bg-content").style.backgroundColor = bgColor;
    },

    repeterList(repetition, option) {
      if (option === "prev") {
        if (repetition === 0) {
          this.index = 0;
        } else if (repetition === 1) {
          this.index = this.songs.length - 1;
        } else {
          this.index = this.songs.length - 1;
        }
      } else {
        if (repetition === 0) {
          this.index = this.songs.length - 1;
        } else if (repetition === 1) {
          this.index = 0;
        } else {
          this.index = 0;
        }
      }
    },

    ordre() {
      this.repetition = 1;
      this.boucle = "all";
    },

    repeatAll() {
      this.OneRepeate = true;
      this.repetition = 3;
      this.boucle = "repeatOne";
    },

    repeatOne() {
      this.OneRepeate = false;
      this.repetition = 0;
      this.boucle = "ordre";
    },

    formatTime(seconds) {
      let minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);

      let output = minutes >= 10 ? `${minutes}` : `0${minutes}`;
      output += seconds >= 10 ? `:${seconds}` : `:0${seconds}`;
      return output;
    },

    listenersWhenPlay() {
      this.player.addEventListener("timeupdate", () => {
        if (!isNaN(this.player.duration)) {
          this.current_duree = this.formatTime(this.player.currentTime);
          this.total_duree = this.formatTime(this.player.duration);
          let seekPosition =
            this.player.currentTime * (100 / this.player.duration);
          this.piste = seekPosition;
        }
      });
      this.player.addEventListener("ended", () => {
        this.next();
      });
    },

    playe(song) {
      if (typeof song.src !== "undefined") {
        this.index = this.songs.indexOf(song);
        this.current = song;
        this.player.src = this.current.src;
        this.random_bg_color();
      }
      this.listenersWhenPlay();

      this.player.play();
      this.isPlaying = true;
      this.stockagePiste();
    },

    playClick(song, index) {
      this.index = index;
      if (typeof song.src !== "undefined") {
        this.current = song;
        this.player.src = this.current.src;
        this.random_bg_color();
      }

      this.player.play();
      this.isPlaying = true;
      this.listenersWhenPlay();
      this.stockagePiste();
    },

    pause() {
      this.player.pause();
      this.isPlaying = false;
    },

    prev() {
      // this.index = this.songs.indexOf(this.current);
      this.index--;
      if (this.index < 0) {
        this.repeterList(this.repetition, "prev");
      }
      this.current = this.songs[this.index];
      this.playe(this.current);
      this.random_bg_color();
      this.stockagePiste();
    },

    next() {
      this.index++;
      if (this.index > this.songs.length - 1) {
        this.repeterList(this.repetition, "next");
      }
      this.current = this.songs[this.index];
      this.playe(this.current);
      this.random_bg_color();
      this.stockagePiste();
    },

    setVolume() {
      this.player.volume = this.volume / 100;
    },

    setPiste() {
      this.player.currentTime = this.player.duration * (this.piste / 100);
    },

    like() {
      this.current.like = true;
      this.stockageFavoris();
    },

    likeListe(index) {
      this.songs[index].like = true;
      this.stockageFavoris();
    },

    dislikeListe(index) {
      this.songs[index].like = false;
      this.stockageFavoris();
    },

    dislike() {
      this.current.like = false;
      this.stockageFavoris();
    },

    likeDislike() {
      if (this.current.like == false) {
        this.like();
      } else {
        this.dislike();
      }
    },
  },

  mounted() {
    if (JSON.parse(localStorage.getItem("favoris"))) {
      this.songs = JSON.parse(localStorage.getItem("favoris"));
    }
    this.createSong();
  },
};
</script>

<style scoped>
.img-blur {
  width: 100%;
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  position: absolute;
  z-index: 0;
  overflow-x: hidden;
  color: hsl(228, 20%, 95%) !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: center !important;
  transition: background 300ms ease;
}
img {
  width: 100%;
  height: auto;
}
.bg-content {
  background: linear-gradient(
    130deg,
    rgba(251, 251, 254, 0.2),
    rgba(0, 0, 0, 0.5)
  );
  backdrop-filter: blur(5px);
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  width: 100%;
  z-index: 100;
  gap: 5px;
}
.player {
  height: 100vh;
  min-width: 280px;
  transition: all 0.4s ease;
  z-index: 100;
  /* display: none !important; */
}
.about__player {
  font-size: 1rem;
}

.link_album {
  text-decoration: none;
  color: hsl(228, 20%, 95%);
  font-size: 1rem;
}
.track__image {
  /* background: url("../assets/img/a1.jpg"); */
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
  margin: 1rem;
  height: 300px;
  width: 300px;
  background-size: cover !important;
  border-radius: 0.5rem;
  cursor: pointer;
}
.track__name {
  font-size: 1rem;
  font-weight: 600;
}
.track__artiste,
.from__track {
  font-size: 0.8rem;
}
.from__track-title,
.dot,
.arrow-bottom {
  font-size: 1rem;
  font-weight: 600;
}
.buttons__player,
.details__track {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.dot,
.arrow-bottom,
.like,
.pause-play,
.playlist,
.repeat,
.prev,
.next,
.shuffle {
  cursor: pointer;
  opacity: 0.8s;
  transition: opacity 0.2s;
}
.like,
.playlist {
  font-size: 1.5rem;
}
.bxs-heart {
  color: rgb(179, 23, 23);
}
.prev,
.next {
  font-size: 2rem;
}
.shuffle,
.repeat {
  font-size: 1.5rem;
}
.pause-play {
  font-size: 3rem;
}

input[type="range"] {
  -webkit-appearance: none;
  border-radius: 5px;
  height: 3px;
}

input[type="range"]::-webkit-progress-bar {
  background: hsl(228, 0%, 95%) !important;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 3px;
  height: 3px;
  background: hsla(228, 20%, 15%, 50%);
  border: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: hsl(228, 0%, 95%);
  /* background: transparent; */
  margin-top: -5px;
  cursor: pointer;
}
.current__time,
.total__time {
  font-size: 0.8rem;
}
.list__player {
  height: 100vh;
  min-width: 290px;
  z-index: 100;
  margin-bottom: 15px;
}
.list__player-header {
  border-bottom: 1px solid rgb(88, 81, 81);
}
.title,
.arrow__back,
.dots {
  font-size: 1.5rem;
  cursor: pointer;
}
.title {
  font-size: 1.2rem;
}
.list_player-body {
  transition: all 0.5s;
  max-height: 100vh;
}

.list__track:hover {
  /* font-weight: 800; */
  background-color: rgba(243, 236, 236, 0.452);
  cursor: pointer;
  border-radius: 0.5rem;
  /* transition: transform 0.2s ease; */
}
.track__execute_play {
  background: url("../assets/utils/audio.svg") no-repeat;
  background-size: 15px;
  background-position-x: 200px;
  background-position-y: 12px;
  background-color: rgba(243, 236, 236, 0.37);
  border-radius: 0.5rem;
}

.track__execute {
  background-color: rgba(243, 236, 236, 0.37);
  border-radius: 0.5rem;
}
.list__track:hover {
  transition: all ease 0.2s;
  padding: 0.2rem;
}
.overflow__scroll {
  max-height: 100vh;
  overflow-y: auto;
}
.list__track {
  margin-top: 1rem;
}
.img-track {
  /* background: url("../assets/img/a1.jpg"); */
  margin: 0.5rem;
  margin-top: 1rem;
  height: 35px;
  width: 35px;
  background-size: cover !important;
  border-radius: 0.2rem;
}
.track__infos {
  height: 35px;
}
.name__track {
  font-size: 0.8rem;
  font-weight: 500;
}
.artist__track {
  font-size: 0.7rem;
  font-weight: 500;
}
.button__like,
.img-track {
  cursor: pointer;
}

/*========== SCROLL BAR ==========*/
::-webkit-scrollbar {
  color: black;
  width: 3px;
}

::-webkit-scrollbar-thumb {
  color: black;
  width: 5px;
}

.display__none {
  display: none !important;
}
.display__block {
  display: block !important;
}

/* Transition ====================================== */
.slide-enter-active {
  transition: opacity 0.4s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>