const keys = document.querySelectorAll(".key");
const dots = document.querySelectorAll(".password-dots span");
const deleteButton = document.getElementById("deleteButton");
const errorMessage = document.getElementById("errorMessage");
const correctPassword = "290103";

const tipBox = document.getElementById("tipBox");
const tipDismiss = document.getElementById("tipDismiss");

setTimeout(() => {
  tipBox.classList.add("show");
}, 600);

const factBox = document.getElementById("factBox");
const factDismiss = document.getElementById("factDismiss");

setTimeout(() => {
  factBox.classList.add("show");
}, 1100);

const reminderBox = document.getElementById("reminderBox");
const reminderClose = document.getElementById("reminderClose");

setTimeout(() => {
  reminderBox.classList.add("show");
}, 850);

const memoryBox = document.getElementById("memoryBox");
const memoryDismiss = document.getElementById("memoryDismiss");

setTimeout(() => {
  memoryBox.classList.add("show");
}, 1350);

const trickBox = document.getElementById("trickBox");
const trickDismiss = document.getElementById("trickDismiss");

setTimeout(() => {
  trickBox.classList.add("show");
}, 950); // chen giữa thời điểm TIP (600ms) và REMINDER (850ms) một chút để không dồn cục

const promiseBox = document.getElementById("promiseBox");
const promiseDismiss = document.getElementById("promiseDismiss");

setTimeout(() => {
  promiseBox.classList.add("show");
}, 1600);

const wishBox = document.getElementById("wishBox");
const wishDismiss = document.getElementById("wishDismiss");

setTimeout(() => {
  wishBox.classList.add("show");
}, 1250);

const allNotes = [
  { box: tipBox, dismissedManually: false },
  { box: factBox, dismissedManually: false },
  { box: reminderBox, dismissedManually: false },
  { box: memoryBox, dismissedManually: false },
  { box: trickBox, dismissedManually: false },
  { box: promiseBox, dismissedManually: false }, // thêm
  { box: wishBox, dismissedManually: false }, // thêm
];

// Đánh dấu "đã tắt thủ công" khi bấm đúng nút Bỏ qua/bít ời của từng note
tipDismiss.addEventListener("click", () => {
  tipBox.classList.remove("show");
  allNotes.find((n) => n.box === tipBox).dismissedManually = true;
});

factDismiss.addEventListener("click", () => {
  factBox.classList.remove("show");
  allNotes.find((n) => n.box === factBox).dismissedManually = true;
});

reminderClose.addEventListener("click", () => {
  reminderBox.classList.remove("show");
  allNotes.find((n) => n.box === reminderBox).dismissedManually = true;
});

memoryDismiss.addEventListener("click", () => {
  memoryBox.classList.remove("show");
  allNotes.find((n) => n.box === memoryBox).dismissedManually = true;
});

trickDismiss.addEventListener("click", () => {
  trickBox.classList.remove("show");
  allNotes.find((n) => n.box === trickBox).dismissedManually = true;
});

promiseDismiss.addEventListener("click", () => {
  promiseBox.classList.remove("show");
  allNotes.find((n) => n.box === promiseBox).dismissedManually = true;
});

wishDismiss.addEventListener("click", () => {
  wishBox.classList.remove("show");
  allNotes.find((n) => n.box === wishBox).dismissedManually = true;
});

// Nút tim — chu kỳ 5
let heartPhase = 0; // 0 -> 1 -> 2 -> 3 -> 4 -> 0 (hoặc rút gọn 1 -> 0 nếu không có note nào bị tắt tay)

dismissAllNotesBtn.addEventListener("click", () => {
  const dismissedCount = allNotes.filter((n) => n.dismissedManually).length;

  if (heartPhase === 0) {
    // Bước 1: tắt hết những note ĐANG hiển thị
    allNotes.forEach((n) => n.box.classList.remove("show"));
    heartPhase = 1;
  } else if (heartPhase === 1) {
    // Bước 2: hiện lại đúng những note chưa từng bị tắt thủ công
    allNotes.forEach((n) => {
      if (!n.dismissedManually) n.box.classList.add("show");
    });
    // Nếu không có note nào bị tắt tay -> vừa hiện là đã đủ full rồi,
    // quay thẳng về bước 0 (tạo thành chu kỳ 2 bước như case đơn giản)
    heartPhase = dismissedCount > 0 ? 2 : 0;
  } else if (heartPhase === 2) {
    // Bước 3: hiện đầy đủ, kể cả những note đã bị tắt thủ công
    allNotes.forEach((n) => n.box.classList.add("show"));
    heartPhase = 3;
  } else if (heartPhase === 3) {
    // Bước 4: tắt hết + reset toàn bộ cờ "đã tắt thủ công"
    allNotes.forEach((n) => {
      n.box.classList.remove("show");
      n.dismissedManually = false;
    });
    heartPhase = 4;
  } else if (heartPhase === 4) {
    // Bước 5: hiện đầy đủ (giờ là trạng thái gốc vì cờ đã reset hết)
    allNotes.forEach((n) => n.box.classList.add("show"));
    heartPhase = 0; // quay về gốc, sẵn sàng cho chu kỳ tiếp theo
  }
});

const bgMusic = document.getElementById("bgMusic");

bgMusic.addEventListener("play", () => {
  playPauseBtn.classList.add("playing");
});

bgMusic.addEventListener("pause", () => {
  playPauseBtn.classList.remove("playing");
});

const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const rewindBtn = document.getElementById("rewindBtn");
const forwardBtn = document.getElementById("forwardBtn");

let hasSelectedSong = false; // true khi người dùng đã tự chọn 1 bài trong danh sách

playPauseBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    if (!hasSelectedSong) {
      bgMusic.src = songs[0].src; // chưa chọn gì -> mặc định phát bài số 1
      hasSelectedSong = true;
    }
    bgMusic.play().catch((err) => {
      console.warn("Trình duyệt chặn tự động phát nhạc:", err);
    });
  } else {
    bgMusic.pause();
  }
});
function updateProgressFill() {
  const percent = progressBar.value;
  progressBar.style.background = `linear-gradient(to right, #000 0%, #000 ${percent}%, rgba(0,0,0,0.35) ${percent}%, rgba(0,0,0,0.35) 100%)`;
}

bgMusic.addEventListener("timeupdate", () => {
  if (bgMusic.duration) {
    progressBar.value = (bgMusic.currentTime / bgMusic.duration) * 100;
    updateProgressFill();
  }
});

bgMusic.addEventListener("ended", () => {
  const currentIndex = songs.findIndex((s) => bgMusic.src.endsWith(s.src));
  const nextIndex =
    currentIndex === -1 || currentIndex >= songs.length - 1
      ? 0
      : currentIndex + 1;

  bgMusic.src = songs[nextIndex].src;
  hasSelectedSong = true;
  bgMusic.play();

  // nếu danh sách đang mở, cập nhật lại để bài mới hiện đúng trạng thái "active"
  if (songListOpen) renderSongWindow();
});

progressBar.addEventListener("input", () => {
  if (bgMusic.duration) {
    bgMusic.currentTime = (progressBar.value / 100) * bgMusic.duration;
  }
  updateProgressFill(); // thêm dòng này để kéo tay cũng cập nhật màu ngay lập tức
});

rewindBtn.addEventListener("click", () => {
  bgMusic.currentTime = Math.max(0, bgMusic.currentTime - 10);
});

forwardBtn.addEventListener("click", () => {
  bgMusic.currentTime = Math.min(
    bgMusic.duration || 0,
    bgMusic.currentTime + 10,
  );
});

/*
  Danh sách bài hát để chọn. Thêm/bớt bao nhiêu bài tuỳ ý,
  cơ chế cuộn theo nhóm 2 bài sẽ tự khớp theo độ dài mảng này.
*/
const songs = [
  { name: "Bài hát 1", src: "assets/music1.mp3" },
  { name: "Bài hát 2", src: "assets/music2.mp3" },
  { name: "Bài hát 3", src: "assets/music3.mp3" },
  { name: "Bài hát 4", src: "assets/music4.mp3" },
  { name: "Bài hát 5", src: "assets/music5.mp3" },
  { name: "Bài hát 6", src: "assets/music6.mp3" },
  { name: "Bài hát 7", src: "assets/music7.mp3" },
  { name: "Bài hát 8", src: "assets/music8.mp3" },
  { name: "Bài hát 9", src: "assets/music9.mp3" },
  { name: "Bài hát 10", src: "assets/music10.mp3" },
  { name: "Bài hát 11", src: "assets/music11.mp3" },
  { name: "Bài hát 12", src: "assets/music12.mp3" },
];

const songDropdownBtn = document.getElementById("songDropdownBtn");
const songList = document.getElementById("songList");

let songWindowStart = 0;
let songListOpen = false;

const songItemsEl = document.getElementById("songItems");
const songScrollbar = document.getElementById("songScrollbar");
const songScrollbarThumb = document.getElementById("songScrollbarThumb");
const musicPlayerEl = document.querySelector(".music-player");

const VISIBLE_COUNT = 3;

function maxWindowStart() {
  return Math.max(songs.length - VISIBLE_COUNT, 0);
}

function renderSongWindow() {
  songItemsEl.innerHTML = "";

  songs
    .slice(songWindowStart, songWindowStart + VISIBLE_COUNT)
    .forEach((song) => {
      const item = document.createElement("div");
      item.className = "song-item";
      item.textContent = song.name;

      if (bgMusic.src.endsWith(song.src)) item.classList.add("active");

      item.addEventListener("click", () => {
        bgMusic.src = song.src;
        bgMusic.currentTime = 0;
        bgMusic.play();
        hasSelectedSong = true;
        closeSongList();
      });

      songItemsEl.appendChild(item);
    });

  updateScrollbarThumb();
}

function updateScrollbarThumb() {
  const max = maxWindowStart();
  const trackHeight = songScrollbar.clientHeight;
  const ratioVisible = Math.min(VISIBLE_COUNT / songs.length, 1);
  const thumbHeight = Math.max(trackHeight * ratioVisible, 16);

  songScrollbarThumb.style.height = thumbHeight + "px";

  const progress = max > 0 ? songWindowStart / max : 0;
  const thumbTop = (trackHeight - thumbHeight) * progress;
  songScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;

  songScrollbar.style.visibility = max > 0 ? "visible" : "hidden";
}

function setWindowStartFromRatio(ratio) {
  const max = maxWindowStart();
  const clamped = Math.min(Math.max(ratio, 0), 1);
  songWindowStart = Math.round(clamped * max);
  renderSongWindow();
}

// Click trực tiếp lên track (không phải thumb) -> nhảy tới vị trí đó
songScrollbar.addEventListener("click", (e) => {
  if (e.target === songScrollbarThumb) return;
  const rect = songScrollbar.getBoundingClientRect();
  const ratio = (e.clientY - rect.top) / rect.height;
  setWindowStartFromRatio(ratio);
});

// Kéo thumb bằng chuột
let draggingThumb = false;

songScrollbarThumb.addEventListener("mousedown", (e) => {
  draggingThumb = true;
  songScrollbarThumb.classList.add("dragging");
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (!draggingThumb) return;
  const rect = songScrollbar.getBoundingClientRect();
  const ratio = (e.clientY - rect.top) / rect.height;
  setWindowStartFromRatio(ratio);
});

window.addEventListener("mouseup", () => {
  draggingThumb = false;
  songScrollbarThumb.classList.remove("dragging");
});

function openSongList() {
  songListOpen = true;
  songDropdownBtn.classList.add("open");
  songList.classList.add("show");
  musicPlayerEl.classList.add("list-open"); // thêm dòng này
  renderSongWindow();
}

function closeSongList() {
  songListOpen = false;
  songDropdownBtn.classList.remove("open");
  songList.classList.remove("show");
  musicPlayerEl.classList.add("list-open"); // thêm dòng này
}

songDropdownBtn.addEventListener("click", () => {
  if (songListOpen) {
    closeSongList();
  } else {
    songWindowStart = 0;
    openSongList();
  }
});

// Cuộn chuột bên trong danh sách -> lùi/tiến 2 bài, giữ lại 1 bài cuối của lượt trước
songList.addEventListener(
  "wheel",
  (e) => {
    if (!songListOpen) return;
    e.preventDefault();

    if (e.deltaY > 0) {
      songWindowStart = Math.min(
        songWindowStart + 2,
        Math.max(songs.length - 3, 0),
      );
    } else {
      songWindowStart = Math.max(songWindowStart - 2, 0);
    }

    renderSongWindow();
  },
  { passive: false },
);

let password = "";

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const number = key.dataset.number;
    if (password.length >= 6) return;

    password += number;
    updateDots();

    if (password.length === 6) {
      checkPassword();
    }
  });
});

deleteButton.addEventListener("click", () => {
  if (password.length === 0) return;
  password = password.slice(0, -1);
  updateDots();
});

function updateDots() {
  dots.forEach((dot, index) => {
    if (index < password.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

function checkPassword() {
  if (password === correctPassword) {
    errorMessage.classList.remove("show");

    const card = document.querySelector(".password-card");
    card.classList.add("hide");

    setTimeout(() => {
      document.querySelector(".password-page").style.display = "none"; // thêm dòng này
      showEnvelope();
    }, 150);
  } else {
    errorMessage.classList.add("show");

    const card = document.querySelector(".password-card");
    card.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 350 },
    );

    setTimeout(() => {
      password = "";
      updateDots();
    }, 500);
  }
}

/*
  Nội dung thư, chia nhỏ theo từng "trang" trong chồng thư.
*/
const letterPages = [
  "Gửi em,\n\nAnh không giỏi nói những lời hoa mỹ, nhưng có vài điều anh muốn nói với em...",
  "Có những buổi chiều anh chỉ ước có em ở bên, cùng nhau đi dạo và trò chuyện về những điều nhỏ nhặt nhất.",
  "Cảm ơn em vì đã xuất hiện, vì đã là em của hiện tại và cả sau này.",
  "Mong rằng chặng đường phía trước, mình sẽ luôn có nhau. 🤍",
];

/*
  Sticker dùng để trộn cùng chữ nổi ở trang mở/đóng thư.
  Điền đúng tên file bạn đã lưu vào assets/ ở đây.
*/
const stickerSources = [
  "assets/sticker1.webp",
  "assets/sticker2.webp",
  "assets/sticker3.webp",
  "assets/sticker4.webp",
  "assets/sticker5.webp",
  "assets/sticker6.webp",
  "assets/sticker7.webp",
  "assets/sticker8.webp",
  "assets/sticker9.webp",
  "assets/sticker10.webp",
  "assets/sticker11.webp",
  "assets/sticker12.webp",
];

function startBackgroundRain(container) {
  const rain = document.createElement("div");
  rain.className = "rain-container";
  container.prepend(rain);

  const totalLanes = 12;
  let laneIndex = 0;

  function spawn(kind) {
    let el;

    if (kind === "sticker") {
      el = document.createElement("img");
      el.className = "floating-sticker";
      el.src =
        stickerSources[Math.floor(Math.random() * stickerSources.length)];
      const size = 70 + Math.random() * 50;
      el.style.width = size + "px";
      el.style.height = size + "px";
    } else {
      el = document.createElement("span");
      el.className = "falling-text";
      el.textContent = rainWords[Math.floor(Math.random() * rainWords.length)];
      el.style.fontSize = 14 + Math.random() * 16 + "px";
    }

    const lane = laneIndex % totalLanes;
    laneIndex++;
    const jitter = Math.random() * (100 / totalLanes) * 0.6;
    el.style.left = lane * (100 / totalLanes) + jitter + "%";

    const duration = 6 + Math.random() * 5;
    el.style.animationDuration = duration + "s";

    rain.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  // chữ nổi — giữ nguyên mật độ như cũ
  const textIntervalId = setInterval(() => spawn("text"), 260);

  // sticker — thưa hơn chữ 1 chút để không rối mắt, chỉnh số này để dày/thưa
  const stickerIntervalId = setInterval(() => spawn("sticker"), 500);

  return [textIntervalId, stickerIntervalId];
}

/*
  Chữ dùng cho hiệu ứng rơi ở nền, màu neon hồng.
  Muốn đổi nội dung thì sửa mảng này.
*/
const rainWords = [
  "❤",
  "♥",
  "Piii",
  "luv",
  "💗",
  "xinh yêu",
  "✨",
  "y phựn",
  "ntkp",
];

/*
  Ảnh dùng cho hiệu ứng rơi sau khi đọc hết thư.
  Điền đường dẫn ảnh thật của bạn vào đây.
*/
const photoSources = [
  "assets/crush1.jpg",
  "assets/crush2.jpg",
  "assets/crush3.jpg",
  "assets/crush4.jpg",
  "assets/crush5.jpg",
  "assets/crush6.jpg",
  "assets/crush7.jpg",
  "assets/crush8.jpg",
  "assets/crush9.jpg",
  "assets/crush10.jpg",
];

function createShuffledPicker(items) {
  let pool = [];

  function reshuffle() {
    pool = [...items];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  return function pick() {
    if (pool.length === 0) reshuffle();
    return pool.pop();
  };
}

const pickPhoto = createShuffledPicker(photoSources);

function startPhotoRain(container, sources) {
  const rain = document.createElement("div");
  rain.className = "rain-container";
  container.prepend(rain);

  const totalLanes = 8;
  let laneIndex = 0;

  const intervalId = setInterval(() => {
    const img = document.createElement("img");
    img.className = "falling-photo";
    img.src = pickPhoto(); // trước: sources[Math.floor(Math.random() * sources.length)]

    const lane = laneIndex % totalLanes;
    laneIndex++;
    const jitter = Math.random() * (100 / totalLanes) * 0.5;
    img.style.left = lane * (100 / totalLanes) + jitter + "%";

    const size = 70 + Math.random() * 50;
    img.style.width = size + "px";
    img.style.height = size * 1.2 + "px";

    const duration = 7 + Math.random() * 5;
    img.style.animationDuration = duration + "s";

    rain.appendChild(img);
    setTimeout(() => img.remove(), duration * 1000 + 200);
  }, 420); // giảm từ 550ms -> 420ms để dày & đều hơn

  return intervalId;
}

/*
  Hiệu ứng gõ chữ nhảy ra từng ký tự.
  Dùng Array.from để tách đúng từng ký tự tiếng Việt có dấu.
*/
function typeText(el, text, speed = 28, onComplete) {
  el.textContent = "";
  const chars = Array.from(text);
  let i = 0;

  const id = setInterval(() => {
    el.textContent += chars[i];
    i++;
    if (i >= chars.length) {
      clearInterval(id);
      el._typeInterval = null;
      if (onComplete) onComplete();
    }
  }, speed);

  el._typeInterval = id;
  return id;
}

function startHeartRain(container) {
  const rain = document.createElement("div");
  rain.className = "rain-container";
  container.prepend(rain);

  const intervalId = setInterval(() => {
    const el = document.createElement("span");
    el.className = "falling-heart";
    el.textContent = "❤";
    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = 16 + Math.random() * 14 + "px";

    const duration = 5 + Math.random() * 4;
    el.style.animationDuration = duration + "s";

    rain.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }, 300);

  return intervalId;
}

function startMixedRain(container, sources) {
  const rain = document.createElement("div");
  rain.className = "rain-container";
  container.prepend(rain);

  const totalLanes = 10;
  let laneIndex = 0;

  function spawn(kind) {
    let el;

    if (kind === "photo") {
      el = document.createElement("img");
      el.className = "falling-photo";
      el.src = pickPhoto(); // trước: sources[Math.floor(Math.random() * sources.length)]
      const size = 70 + Math.random() * 50;
      el.style.width = size + "px";
      el.style.height = size * 1.2 + "px";
    } else {
      el = document.createElement("span");
      el.className = "falling-heart";
      el.textContent = "❤";
      el.style.fontSize = 16 + Math.random() * 14 + "px";
    }

    const lane = laneIndex % totalLanes;
    laneIndex++;
    const jitter = Math.random() * (100 / totalLanes) * 0.6;
    el.style.left = lane * (100 / totalLanes) + jitter + "%";

    const duration = 6 + Math.random() * 5;
    el.style.animationDuration = duration + "s";

    rain.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  // giữ nguyên mật độ ảnh hiện tại (tương đương tỉ lệ bạn đang ưng ý)
  const photoIntervalId = setInterval(() => spawn("photo"), 400);

  // tim dày hơn hẳn — muốn dày/thưa hơn nữa thì chỉnh số này (nhỏ hơn = dày hơn)
  const heartIntervalId = setInterval(() => spawn("heart"), 200);

  return [photoIntervalId, heartIntervalId];
}

function clearRain(ids) {
  if (!ids) return;
  ids.forEach((id) => clearInterval(id));
}

function goToReadingPage() {
  const readingPage = document.createElement("div");
  readingPage.className = "reading-page";

  readingPage.innerHTML = `
    <div class="stack-progress" id="stackProgress"></div>
    <div class="letter-stack" id="letterStack"></div>
    <div class="stack-hint" id="stackHint">Chạm vào thư để đọc tiếp →</div>
    <div class="end-actions" id="endActions">
      <button class="close-letter-btn" id="closeLetterBtn">Đóng thư</button>
    </div>
  `;

  document.body.appendChild(readingPage);

  requestAnimationFrame(() => {
    readingPage.classList.add("show");
  });

  let rainInterval = startMixedRain(readingPage, photoSources);

  const stack = readingPage.querySelector("#letterStack");
  const progress = readingPage.querySelector("#stackProgress");
  const hint = readingPage.querySelector("#stackHint");
  const endActions = readingPage.querySelector("#endActions");
  const closeBtn = readingPage.querySelector("#closeLetterBtn");

  let current = 0;
  let slideDir = "left";
  let isTransitioning = false; // thêm dòng này
  const cardEls = new Map();
  const typedIndices = new Set();

  function createCard(index) {
    const card = document.createElement("div");
    card.className = "stack-card";
    card.dataset.typingDone = "false";
    card.addEventListener("click", () => {
      if (
        index === current &&
        card.dataset.typingDone === "true" &&
        !isTransitioning
      ) {
        isTransitioning = true;
        nextPage();
      }
    });
    return card;
  }

  function layout() {
    const visibleIndices = [];
    for (let offset = 0; offset <= 2; offset++) {
      const idx = current + offset;
      if (idx < letterPages.length) visibleIndices.push(idx);
    }

    for (const [idx, el] of cardEls) {
      if (!visibleIndices.includes(idx)) {
        if (el._typeInterval) clearInterval(el._typeInterval);
        el.remove();
        cardEls.delete(idx);
      }
    }

    visibleIndices.forEach((idx, offset) => {
      let el = cardEls.get(idx);
      if (!el) {
        el = createCard(idx);
        cardEls.set(idx, el);
      }
      el.classList.remove("behind-1", "behind-2");
      if (offset === 1) el.classList.add("behind-1");
      if (offset === 2) el.classList.add("behind-2");

      // Lá phía sau (offset 1, 2) giữ trang trắng hoàn toàn,
      // chỉ gõ chữ đúng lúc lá đó trở thành lá đang đọc (offset 0)
      if (offset === 0 && !typedIndices.has(idx)) {
        typedIndices.add(idx);
        if (el._typeInterval) clearInterval(el._typeInterval);
        el.dataset.typingDone = "false";
        typeText(el, letterPages[idx], 28, () => {
          el.dataset.typingDone = "true";
        });
      }
    });

    visibleIndices
      .slice()
      .reverse()
      .forEach((idx) => stack.appendChild(cardEls.get(idx)));

    progress.textContent = `${current + 1} / ${letterPages.length}`;
  }

  function nextPage() {
    const topEl = cardEls.get(current);
    if (!topEl) return;

    const isLast = current >= letterPages.length - 1;
    const leavingClass = slideDir === "left" ? "leaving-left" : "leaving-right";
    slideDir = slideDir === "left" ? "right" : "left";

    if (topEl._typeInterval) clearInterval(topEl._typeInterval);
    topEl.classList.add(leavingClass);

    setTimeout(() => {
      topEl.remove();
      cardEls.delete(current);

      if (isLast) {
        finishReading();
      } else {
        current++;
        layout();
      }
      isTransitioning = false; // mở khoá lại
    }, 400);
  }

  function finishReading() {
    progress.remove();
    hint.remove();

    requestAnimationFrame(() => {
      endActions.classList.add("show");
    });
  }

  closeBtn.addEventListener("click", () => {
    clearRain(rainInterval);

    // Lớp phủ trắng-hồng, hiện sẵn (đang che toàn màn hình) rồi tan dần
    const flyOverlay = document.createElement("div");
    flyOverlay.className = "scene-overlay show";
    flyOverlay.style.transition = "none";
    document.body.appendChild(flyOverlay);
    void flyOverlay.offsetHeight; // ép trình duyệt "chốt" trạng thái show trước khi gỡ transition:none
    flyOverlay.style.transition = "";

    // Lá thư bay ngược trở lại (dùng animation-direction: reverse ở CSS)
    const flyingLetter = document.createElement("div");
    flyingLetter.className = "letter-flyback";
    flyingLetter.innerHTML = '<div class="letter-content">Gửi Piii</div>';
    document.body.appendChild(flyingLetter);

    readingPage.classList.remove("show");

    requestAnimationFrame(() => {
      flyOverlay.classList.remove("show"); // bắt đầu tan lớp phủ, đồng bộ với lúc thư thu nhỏ
    });

    setTimeout(() => {
      readingPage.remove();
      flyOverlay.remove();
      flyingLetter.remove();
      goToClosingPage();
    }, 1100); // khớp đúng 1.1s của animation
  });

  layout();
}

function goToClosingPage() {
  const closingContainer = document.createElement("div");
  closingContainer.className = "envelope-container";

  closingContainer.innerHTML = `
    <div class="envelope open" id="closingEnvelope">

    <div class="envelope-flap">
  <svg viewBox="0 0 464 126" preserveAspectRatio="none">
    <polygon points="0,0 464,0 464,26 232,126 0,26" fill="#f47ab0" />
    <path
      d="M 0,0 L 0,26 L 232,126 L 464,26 L 464,0"
      fill="none"
      stroke="#2b2b2b"
      stroke-width="2"
      stroke-linejoin="miter"
    />
  </svg>
  <div class="seal-back seal-back--flap"></div>
</div>

<div class="envelope-flap-static">
  <svg viewBox="0 0 464 126" preserveAspectRatio="none">
    <polygon points="0,126 464,126 464,100 232,0 0,100" fill="#f47ab0" />
    <path
      d="M 0,126 L 0,100 L 232,0 L 464,100 L 464,126"
      fill="none"
      stroke="#2b2b2b"
      stroke-width="2"
      stroke-linejoin="miter"
    />
  </svg>
  <div class="seal-back seal-back--static"></div>
</div>

      <div class="letter-window">
        <div class="letter">
          <div class="letter-content" id="closingLetterContent"></div>
        </div>
      </div>

      <div class="envelope-pocket"></div>

      <div class="heart-seal no-action" id="closingHeart">♥</div>
      <div class="heart-seal-back"></div>
    </div>

    <p class="envelope-text" id="closingText">Đang cất thư vào phong bì...💌</p>
    <button class="exit-btn" id="closingExitBtn">thoát raaaaaa</button>
    <div class="scene-overlay" id="closingSceneOverlay"></div>
  `;

  document.body.appendChild(closingContainer);

  setTimeout(() => {
    closingContainer.classList.add("show");
  }, 50);

  const rainInterval = startBackgroundRain(closingContainer);

  const envelope = closingContainer.querySelector("#closingEnvelope");
  const closingText = closingContainer.querySelector("#closingText");
  const closingHeart = closingContainer.querySelector("#closingHeart");
  const closingLetterContent = closingContainer.querySelector(
    "#closingLetterContent",
  );
  const closingLetterEl = closingContainer.querySelector(".letter");
  const closingSceneOverlay = closingContainer.querySelector(
    "#closingSceneOverlay",
  ); // thêm dòng này

  // Giai đoạn 1: cho người xem thấy phong bì đang mở 1 nhịp, rồi bắt đầu rút thư xuống
  setTimeout(() => {
    envelope.classList.remove("open");
    envelope.classList.add("closing-letter");
  }, 700);

  // Giai đoạn 2: thư đã rút xong -> gập nắp lại
  setTimeout(() => {
    envelope.classList.remove("closing-letter");
    envelope.classList.add("closing-flap");
  }, 700 + 650);

  // Xong xuôi: đổi chữ báo đã đóng, mở khoá tim để có thể bấm mở lại (loop)
  setTimeout(
    () => {
      envelope.classList.remove("closing-flap");
      closingText.textContent = "Thư đã được cất giữ an toàn 💌";

      closingHeart.classList.remove("no-action");

      const idleTextTimeout = setTimeout(() => {
        closingText.textContent = "Bấm vào trái tim để mở thư 💌";
      }, 1500);

      closingHeart.addEventListener("click", () => {
        clearTimeout(idleTextTimeout);
        envelope.classList.add("open");
        closingText.textContent = "Bấm vào lá thư để đọc...💌";
        closingLetterContent.textContent = "Gửi Piii";
      });

      const closingLetterWindowEl =
        closingContainer.querySelector(".letter-window"); // thêm dòng này

      closingLetterEl.addEventListener("click", () => {
        if (!envelope.classList.contains("open")) return;
        if (closingLetterEl.classList.contains("letter-launching")) return;

        clearInterval(rainInterval);

        closingLetterWindowEl.classList.add("window-launching");
        closingContainer.classList.add("container-launching");
        closingLetterEl.classList.add("letter-launching");
        closingSceneOverlay.classList.add("show"); // thêm dòng này

        setTimeout(() => {
          closingContainer.remove();
          goToReadingPage();
        }, 1100); // khớp thời lượng animation mới, xem phần dưới
      });
    },
    700 + 650 + 650,
  );
  const closingExitBtn = closingContainer.querySelector("#closingExitBtn");
  closingExitBtn.addEventListener("click", () => {
    location.reload();
  });
}

function showEnvelope() {
  const envelopeContainer = document.createElement("div");
  envelopeContainer.className = "envelope-container";

  envelopeContainer.innerHTML = `
    <div class="envelope">

      <div class="envelope-flap">
  <svg viewBox="0 0 464 126" preserveAspectRatio="none">
    <polygon points="0,0 464,0 464,26 232,126 0,26" fill="#f47ab0" />
    <path
      d="M 0,0 L 0,26 L 232,126 L 464,26 L 464,0"
      fill="none"
      stroke="#2b2b2b"
      stroke-width="2"
      stroke-linejoin="miter"
    />
  </svg>
  <div class="seal-back seal-back--flap"></div>
</div>

<div class="envelope-flap-static">
  <svg viewBox="0 0 464 126" preserveAspectRatio="none">
    <polygon points="0,126 464,126 464,100 232,0 0,100" fill="#f47ab0" />
    <path
      d="M 0,126 L 0,100 L 232,0 L 464,100 L 464,126"
      fill="none"
      stroke="#2b2b2b"
      stroke-width="2"
      stroke-linejoin="miter"
    />
  </svg>
  <div class="seal-back seal-back--static"></div>
</div>

      <div class="letter-window">
        <div class="letter">
          <div class="letter-content">
            Gửi Piii
          </div>
        </div>
      </div>

      <div class="envelope-pocket"></div>

      <div class="heart-seal">♥</div>
      <div class="heart-seal-back"></div>
    </div>

    <p class="envelope-text">
      Bấm vào trái tim để mở thư 💌
    </p>
    <button class="exit-btn" id="exitBtn">thoát raaaaaa</button>
    <div class="scene-overlay" id="sceneOverlay"></div>
  `;

  document.body.appendChild(envelopeContainer);

  setTimeout(() => {
    envelopeContainer.classList.add("show");
  }, 50);

  const rainInterval = startBackgroundRain(envelopeContainer);

  const envelope = envelopeContainer.querySelector(".envelope");
  const envelopeText = envelopeContainer.querySelector(".envelope-text");

  const heartSeal = envelopeContainer.querySelector(".heart-seal");
  heartSeal.addEventListener("click", () => {
    envelope.classList.add("open");
    envelopeText.textContent = "Bấm vào lá thư để đọc...💌";
    // Tự động phát nhạc khi mở thư
    if (bgMusic.paused) {
      hasSelectedSong = true;
      bgMusic.play().catch((err) => {
        console.warn("Trình duyệt chặn tự động phát nhạc:", err);
      });
    }
  });

  const letterEl = envelopeContainer.querySelector(".letter");
  const letterWindowEl = envelopeContainer.querySelector(".letter-window"); // thêm dòng này
  const sceneOverlay = envelopeContainer.querySelector("#sceneOverlay"); // thêm dòng này

  letterEl.addEventListener("click", () => {
    if (!envelope.classList.contains("open")) return;
    if (letterEl.classList.contains("letter-launching")) return;

    clearRain(rainInterval);

    letterWindowEl.classList.add("window-launching");
    envelopeContainer.classList.add("container-launching");
    letterEl.classList.add("letter-launching");
    sceneOverlay.classList.add("show"); // thêm dòng này

    setTimeout(() => {
      envelopeContainer.remove();
      goToReadingPage();
    }, 1100);
  });

  const exitBtn = envelopeContainer.querySelector("#exitBtn");
  exitBtn.addEventListener("click", () => {
    location.reload();
  });
}
