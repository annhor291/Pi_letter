const keys = document.querySelectorAll(".key");
const dots = document.querySelectorAll(".password-dots span");
const deleteButton = document.getElementById("deleteButton");
const errorMessage = document.getElementById("errorMessage");
const correctPassword = "270603";

const tipBox = document.getElementById("tipBox");
const tipDismiss = document.getElementById("tipDismiss");
setTimeout(() => showNoteAnimated(tipBox), 600);

const factBox = document.getElementById("factBox");
const factDismiss = document.getElementById("factDismiss");
setTimeout(() => showNoteAnimated(factBox), 1100);

const reminderBox = document.getElementById("reminderBox");
const reminderClose = document.getElementById("reminderClose");
setTimeout(() => showNoteAnimated(reminderBox), 850);

const memoryBox = document.getElementById("memoryBox");
const memoryDismiss = document.getElementById("memoryDismiss");
setTimeout(() => showNoteAnimated(memoryBox), 1350);

const trickBox = document.getElementById("trickBox");
const trickDismiss = document.getElementById("trickDismiss");
setTimeout(() => showNoteAnimated(trickBox), 950);

const promiseBox = document.getElementById("promiseBox");
const promiseDismiss = document.getElementById("promiseDismiss");
setTimeout(() => showNoteAnimated(promiseBox), 1600);

const wishBox = document.getElementById("wishBox");
const wishDismiss = document.getElementById("wishDismiss");
setTimeout(() => showNoteAnimated(wishBox), 1250);

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
  hideNoteAnimated(tipBox);
  allNotes.find((n) => n.box === tipBox).dismissedManually = true;
});

factDismiss.addEventListener("click", () => {
  hideNoteAnimated(factBox);
  allNotes.find((n) => n.box === factBox).dismissedManually = true;
});

reminderClose.addEventListener("click", () => {
  hideNoteAnimated(reminderBox);
  allNotes.find((n) => n.box === reminderBox).dismissedManually = true;
});

memoryDismiss.addEventListener("click", () => {
  hideNoteAnimated(memoryBox);
  allNotes.find((n) => n.box === memoryBox).dismissedManually = true;
});

trickDismiss.addEventListener("click", () => {
  hideNoteAnimated(trickBox);
  allNotes.find((n) => n.box === trickBox).dismissedManually = true;
});

promiseDismiss.addEventListener("click", () => {
  hideNoteAnimated(promiseBox);
  allNotes.find((n) => n.box === promiseBox).dismissedManually = true;
});

wishDismiss.addEventListener("click", () => {
  hideNoteAnimated(wishBox);
  allNotes.find((n) => n.box === wishBox).dismissedManually = true;
});

// Nút tim — chu kỳ 5
let heartPhase = 0; // 0 -> 1 -> 2 -> 3 -> 4 -> 0 (hoặc rút gọn 1 -> 0 nếu không có note nào bị tắt tay)

dismissAllNotesBtn.addEventListener("click", () => {
  const dismissedCount = allNotes.filter((n) => n.dismissedManually).length;

  if (heartPhase === 0) {
    allNotes.forEach((n) => hideNoteAnimated(n.box));
    heartPhase = 1;
  } else if (heartPhase === 1) {
    allNotes.forEach((n) => {
      if (!n.dismissedManually) showNoteAnimated(n.box);
    });
    heartPhase = dismissedCount > 0 ? 2 : 0;
  } else if (heartPhase === 2) {
    allNotes.forEach((n) => showNoteAnimated(n.box));
    heartPhase = 3;
  } else if (heartPhase === 3) {
    allNotes.forEach((n) => {
      hideNoteAnimated(n.box);
      n.dismissedManually = false;
    });
    heartPhase = 4;
  } else if (heartPhase === 4) {
    allNotes.forEach((n) => showNoteAnimated(n.box));
    heartPhase = 0;
  }
});

const NOTE_ARC_HEIGHT = 160;
const NOTE_ARC_DURATION = 650;

function getHeartCenter() {
  const rect = dismissAllNotesBtn.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

// Lấy mẫu 14 điểm trên đường cong parabol từ (x0,y0) -> (x1,y1), cao "height"
function arcPoints(x0, y0, x1, y1, height, steps = 14) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t - height * Math.sin(Math.PI * t);
    pts.push({ x, y });
  }
  return pts;
}

function showNoteAnimated(el) {
  if (el.classList.contains("show")) return;

  el.getAnimations().forEach((a) => a.cancel());
  el.classList.add("show");
  el.style.transition = "none";
  void el.offsetHeight; // ép trình duyệt "chốt" ngay vị trí/góc nghiêng cuối cùng

  const rect = el.getBoundingClientRect();
  const finalX = rect.left + rect.width / 2;
  const finalY = rect.top + rect.height / 2;
  const heart = getHeartCenter();

  const pts = arcPoints(
    heart.x - finalX,
    heart.y - finalY,
    0,
    0,
    NOTE_ARC_HEIGHT,
  );
  const keyframes = pts.map((p, i) => ({
    transform: `translate(${p.x}px, ${p.y}px) scale(${0.25 + 0.75 * (i / pts.length)})`,
    opacity: i === 0 ? 0 : 1,
  }));

  const anim = el.animate(keyframes, {
    duration: NOTE_ARC_DURATION,
    easing: "linear",
    fill: "forwards",
  });

  anim.onfinish = () => {
    el.style.transition = "";
    anim.cancel(); // trả quyền lại cho CSS -> note đứng đúng góc nghiêng/vị trí gốc
  };
}

function hideNoteAnimated(el) {
  if (!el.classList.contains("show")) return;

  el.getAnimations().forEach((a) => a.cancel());

  const rect = el.getBoundingClientRect();
  const curX = rect.left + rect.width / 2;
  const curY = rect.top + rect.height / 2;
  const heart = getHeartCenter();

  const pts = arcPoints(0, 0, heart.x - curX, heart.y - curY, NOTE_ARC_HEIGHT);
  const keyframes = pts.map((p, i) => ({
    transform: `translate(${p.x}px, ${p.y}px) scale(${1 - 0.75 * (i / pts.length)})`,
    opacity: i === pts.length ? 0 : 1,
  }));

  const anim = el.animate(keyframes, {
    duration: NOTE_ARC_DURATION,
    easing: "linear",
    fill: "forwards",
  });

  anim.onfinish = () => {
    el.classList.remove("show");
    anim.cancel();
  };
}

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

/*rewindBtn.addEventListener("click", () => {
  bgMusic.currentTime = Math.max(0, bgMusic.currentTime - 10);
});

forwardBtn.addEventListener("click", () => {
  bgMusic.currentTime = Math.min(
    bgMusic.duration || 0,
    bgMusic.currentTime + 10,
  );
});*/

rewindBtn.addEventListener("click", () => {
  const currentIndex = songs.findIndex((s) => bgMusic.src.endsWith(s.src));

  const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;

  bgMusic.src = songs[prevIndex].src;
  bgMusic.currentTime = 0;
  hasSelectedSong = true;

  bgMusic.play().catch((err) => {
    console.warn("Không thể phát bài trước:", err);
  });
});

forwardBtn.addEventListener("click", () => {
  const currentIndex = songs.findIndex((s) => bgMusic.src.endsWith(s.src));

  const nextIndex =
    currentIndex === -1 || currentIndex >= songs.length - 1
      ? 0
      : currentIndex + 1;

  bgMusic.src = songs[nextIndex].src;
  bgMusic.currentTime = 0;
  hasSelectedSong = true;

  bgMusic.play().catch((err) => {
    console.warn("Không thể phát bài tiếp theo:", err);
  });
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
  "Gửi Phượng.\nTrước tiên thì sau khoảng gần 3 năm tính từ lần đầu tiên gặp Phượng, lần đầu gặp là mê luôn mà, dính bùa yêu từ lần đầu nhìn thấy luôn á nghe hơi bốc phét nhưng mà thật đó. Rồi may sao được chung nhóm nữa chứ trời ơi quá đãaa.",

  "Nên trong lòng An chất chứa nhiều thứ lắm nhưng mà không biết phải thổ lộ như thế nào. Nên An dành hết tâm huyết, dồn hết tâm tư vào cái web này với hy vọng Phượng sẽ thích nó hoặc ít nhất thì nó sẽ làm Phượng vui hơn. Và giúp An nói bày tỏ lòng mình nữa.",

  "Thú thật thì An cũng biết bây giờ Phượng vẫn chưa muốn có người yêu hay chưa nghĩ tới chuyện yêu đương vì mọi thứ hiện tại chưa ổn định. Có lẽ Phượng đang ưu tiên phát triển công việc, ưu tiên dành thời gian cho bạn bè và gia đình hơn. Hoặc có lẽ đơn giản là không phải An. An cũng hiểu sau vài lần thổ lộ và biết có thổ lộ thêm bao nhiêu lần nữa thì kết quả cũng như vậy.",

  "An biết mà. Dù chưa nghe Phượng trả lời nhưng An cũng cũng biết Phượng muốn nói gì rồi. Mà cũng khó ha, vừa khó để nói thẳng ra mà cũng vừa khó chịu khi phải im lặng. Đúng hong có khó chịu hong??? Mà An thì cũng không muốn Phượng phải khó xử, cũng không muốn tụi mình phải cứ né nhau hoài nên là thôi An cũng nói hết cho Phượng biết luôn. Mà tính ra chắc có mỗi Phượng né chứ An có né đâu.",

  "An như vậy là do thích Phượng lắm, mê cực kì luôn á. Mà cứ sợ nói xong lại được rồi lại cũng không thể nói chuyện như bạn bè nữa, mà không nói thì lại cứ lấn cấn trong lòng á nên mấy lúc không kìm được là lại thổ lộ luôn à. Mà An cũng thấy cứ tiếp tục như vậy thì cũng hoài thì không phải là cách và tốt nhất là An nên ngừng mấy cái đó lại, không cố chấp nữa.",

  "An nghĩ một phần cũng do An chưa đủ chủ động ,chưa đủ nhiệt tình, chưa theo đuổi Phượng một cách rõ ràng. Bây giờ chưa phải thời điểm và An cũng chưa phải là mẫu người để Phượng có thể thích vì hiện tại An cũng dùng hết bài vở mà An có rồi mà thấy cũng không xi nhê gì hết \n:(((((((",

  "Nhưng mà An cũng không bỏ chạy đâu nhe, An lì đòn chịu đau dữ lắm, dính bùa mê nữa thì càng lì :)))) Nhưng cũng sẽ không thổ lộ thêm nữa. Ít nhất là cho đến khi mọi thứ ổn định hơn với cả hai đứa, khi mà An đã hoàn thiện bản thân mình hơn hiện tại. Lúc đó An sẽ trở lại để tiếp tục tìm kiếm thêm cơ hội, theo đuổi Phượng một cách rõ ràng với nhiều chiêu mạnh hơn. Để coi lúc đó còn cứng nổi không nhóooo.",

  'Hy vọng đọc xong Phượng sẽ hiểu được những gì trong lòng An dành cho Phượng. Móa nó sến vô cùng tận :)))) Nhưng mà phải nhớ là : "Lúc nào cũng phải thật hạnh phúc nha mom" 🤍',
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
/*function typeText(el, text, speed = 28, onComplete) {
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
}*/

/*
  ✨ MAGIC TYPING
  Đỏ đô → đỏ nhạt → cam đỏ → đen
  + tàn lửa sau mỗi ký tự
*/
function typeText(el, text, speed = 65, onComplete) {
  el.innerHTML = "";

  const chars = Array.from(text);
  const charElements = [];

  /*
    QUAN TRỌNG:
    - Ký tự bình thường → span riêng để animate
    - Space / newline → text node bình thường

    Nhờ vậy trình duyệt vẫn wrap text tự nhiên
    theo chiều rộng của lá thư.
  */
  chars.forEach((char) => {
    if (char === " " || char === "\n") {
      el.appendChild(document.createTextNode(char));
      return;
    }

    const span = document.createElement("span");

    span.className = "magic-char";
    span.textContent = char;

    el.appendChild(span);
    charElements.push(span);
  });

  let i = 0;

  const id = setInterval(() => {
    if (i >= charElements.length) {
      clearInterval(id);
      el._typeInterval = null;

      if (onComplete) {
        onComplete();
      }

      return;
    }

    playMagicCharacter(charElements[i]);

    i++;
  }, speed);

  el._typeInterval = id;

  return id;
}

/*
  ✨ Xử lý một ký tự
*/
function playMagicCharacter(charEl) {
  // Reset animation
  charEl.classList.remove("magic-char-glow");

  // Ép browser reflow để animation chạy lại
  void charEl.offsetWidth;

  // Bắt đầu phép thuật
  charEl.classList.add("magic-char-glow");

  /*
    Chờ chữ gần hoàn tất rồi mới tạo
    tàn lửa.
  */
  setTimeout(() => {
    createEmbers(charEl);
  }, 260);
}

/*
  🔥 TẠO TÀN LỬA
*/
function createEmbers(charEl) {
  const rect = charEl.getBoundingClientRect();

  /*
    Nếu ký tự đã biến mất khỏi màn hình
    thì không tạo particle.
  */
  if (rect.width === 0 || rect.height === 0) {
    return;
  }

  // 1–2 hạt là đủ, tránh thành pháo hoa
  const amount = 1 + Math.floor(Math.random() * 2);

  for (let i = 0; i < amount; i++) {
    const ember = document.createElement("span");

    ember.className = "magic-ember";

    /*
      Bắt đầu ngay quanh ký tự
    */
    const startX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 5;

    const startY = rect.top + rect.height * 0.45;

    ember.style.left = `${startX}px`;
    ember.style.top = `${startY}px`;

    /*
      Hướng bay ngẫu nhiên:
      chủ yếu bay lên, hơi lệch trái/phải.
    */
    const moveX = (Math.random() - 0.5) * 20;

    const moveY = -(7 + Math.random() * 22);

    ember.style.setProperty("--ember-x", `${moveX}px`);

    ember.style.setProperty("--ember-y", `${moveY}px`);

    const size = 1.5 + Math.random() * 2.5;

    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;

    document.body.appendChild(ember);

    /*
      Tự xóa sau animation
    */
    ember.addEventListener(
      "animationend",
      () => {
        ember.remove();
      },
      { once: true },
    );
  }
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

  const STACK_DEPTH = 4; // số lớp tối đa phía sau lá đang đọc

  function layout() {
    const visibleIndices = [];
    for (let offset = 0; offset <= STACK_DEPTH; offset++) {
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
      el.classList.remove("behind-1", "behind-2", "behind-3", "behind-4");
      if (offset === 1) el.classList.add("behind-1");
      if (offset === 2) el.classList.add("behind-2");
      if (offset === 3) el.classList.add("behind-3");
      if (offset === 4) el.classList.add("behind-4");

      // Lá phía sau (offset 1, 2) giữ trang trắng hoàn toàn,
      // chỉ gõ chữ đúng lúc lá đó trở thành lá đang đọc (offset 0)
      if (offset === 0 && !typedIndices.has(idx)) {
        typedIndices.add(idx);
        if (el._typeInterval) clearInterval(el._typeInterval);
        el.dataset.typingDone = "false";
        hint.textContent = "đợi xí nhaaaaa"; // thêm dòng này
        /*typeText(el, letterPages[idx], 28, () => {*/
        typeText(el, letterPages[idx], 65, () => {
          el.dataset.typingDone = "true";
          hint.textContent = "Chạm vào thư để đọc tiếp →"; // thêm dòng này
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

    const zoomOverlay = document.createElement("div");
    zoomOverlay.className = "scene-overlay";
    document.body.appendChild(zoomOverlay);

    const zoomLetter = document.createElement("div");
    zoomLetter.className = "letter-zoomout";
    zoomLetter.innerHTML = '<div class="letter-content">Gửi Piii</div>';
    document.body.appendChild(zoomLetter);

    readingPage.classList.remove("show");

    requestAnimationFrame(() => {
      zoomOverlay.classList.add("show");
    });

    const PHASE_A_DURATION = 600;

    setTimeout(() => {
      readingPage.remove();
      zoomOverlay.remove(); // cắt cứng, không fade ra
      zoomLetter.remove();
      goToClosingPage({ skipInitialLetter: true });
    }, PHASE_A_DURATION);
  });

  layout();
}

function goToClosingPage({ skipInitialLetter = false } = {}) {
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
      stroke-width="5"
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
      stroke-width="5"
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
  closingLetterContent.textContent = "Gửi Piii";
  const closingLetterEl = closingContainer.querySelector(".letter");
  if (skipInitialLetter) {
    closingLetterEl.classList.add("pre-flyback"); // ẩn tạm thư thật
  }
  const closingSceneOverlay = closingContainer.querySelector(
    "#closingSceneOverlay",
  ); // thêm dòng này

  function attachClosingHandlers(idleTextTimeout) {
    closingHeart.addEventListener("click", () => {
      clearTimeout(idleTextTimeout);
      closingLetterEl.classList.remove("pre-flyback", "landing-fade"); // thêm dòng này — dọn sạch trạng thái cũ
      envelope.classList.add("open");
      closingText.textContent = "Bấm vào lá thư để đọc...💌";
      /*closingLetterContent.textContent = "Gửi Piii";*/
    });

    const closingLetterWindowEl =
      closingContainer.querySelector(".letter-window");

    closingLetterEl.addEventListener("click", () => {
      if (!envelope.classList.contains("open")) return;
      if (closingLetterEl.classList.contains("letter-launching")) return;

      clearInterval(rainInterval);

      closingLetterWindowEl.classList.add("window-launching");
      closingContainer.classList.add("container-launching");
      closingLetterEl.classList.add("letter-launching");
      closingSceneOverlay.classList.add("show");

      setTimeout(() => {
        closingContainer.remove();
        goToReadingPage();
      }, 1100);
    });
  }

  if (skipInitialLetter) {
    // Hiện phong bì NGAY LẬP TỨC, không qua fade riêng nào nữa
    closingContainer.style.transition = "none";
    closingContainer.classList.add("show");
    void closingContainer.offsetHeight;
    closingContainer.style.transition = "";

    const PHASE_B_DURATION = 550;
    const CROSSFADE_DURATION = 220;

    const flyingLetterIn = document.createElement("div");
    flyingLetterIn.className = "letter-flyback-in";
    flyingLetterIn.innerHTML = '<div class="letter-content">Gửi Piii</div>';
    document.body.appendChild(flyingLetterIn);

    // Đúng lúc còn 220ms cuối hành trình -> bắt đầu crossfade 2 chiều
    setTimeout(() => {
      closingLetterEl.classList.add("landing-fade");
      closingLetterEl.classList.remove("pre-flyback"); // 0 -> 1
      flyingLetterIn.classList.add("arriving"); // 1 -> 0
    }, PHASE_B_DURATION - CROSSFADE_DURATION);

    setTimeout(() => {
      flyingLetterIn.remove();
      closingLetterContent.textContent = "Gửi Piii"; // thêm dòng này
      envelope.classList.add("open");

      setTimeout(() => {
        envelope.classList.remove("open");
        envelope.classList.add("closing-letter");

        setTimeout(() => {
          envelope.classList.remove("closing-letter");
          envelope.classList.add("closing-flap");

          setTimeout(() => {
            envelope.classList.remove("closing-flap");
            closingText.textContent = "Thư đã được cất giữ an toàn 💌";
            closingHeart.classList.remove("no-action");

            const idleTextTimeout = setTimeout(() => {
              closingText.textContent = "Bấm vào trái tim để mở thư 💌";
            }, 1500);

            attachClosingHandlers(idleTextTimeout);
          }, 550); // trước: 650
        }, 500); // trước: 650
      }, 250); // trước: 700 -> giảm mạnh, chỉ đủ để mắt "chấp nhận" thư đã tới rồi rút liền
    }, PHASE_B_DURATION);
  } else {
    // ...giữ nguyên y hệt nhánh else cũ...
  }
  const closingExitBtn = closingContainer.querySelector("#closingExitBtn");

  closingExitBtn.addEventListener("click", () => {
    clearInterval(rainInterval);
    closingContainer.remove();

    // Quay lại trang nhập PIN
    const passwordPage = document.querySelector(".password-page");
    const passwordCard = document.querySelector(".password-card");

    passwordPage.style.display = "";
    passwordCard.classList.remove("hide");

    // Reset ô PIN
    password = "";
    updateDots();

    // Xóa thông báo lỗi nếu có
    errorMessage.classList.remove("show");
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
      stroke-width="5"
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
      stroke-width="5"
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
    clearRain(rainInterval);
    envelopeContainer.remove();

    // Quay lại trang nhập PIN
    const passwordPage = document.querySelector(".password-page");
    const passwordCard = document.querySelector(".password-card");

    passwordPage.style.display = "";
    passwordCard.classList.remove("hide");

    // Reset ô PIN
    password = "";
    updateDots();

    // Xóa thông báo lỗi nếu có
    errorMessage.classList.remove("show");
  });
}
