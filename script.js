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

tipDismiss.addEventListener("click", () => {
  tipBox.classList.remove("show");
});

const bgMusic = document.getElementById("bgMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const rewindBtn = document.getElementById("rewindBtn");
const forwardBtn = document.getElementById("forwardBtn");

playPauseBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    playPauseBtn.classList.add("playing");
  } else {
    bgMusic.pause();
    playPauseBtn.classList.remove("playing");
  }
});

bgMusic.addEventListener("timeupdate", () => {
  if (bgMusic.duration) {
    progressBar.value = (bgMusic.currentTime / bgMusic.duration) * 100;
  }
});

progressBar.addEventListener("input", () => {
  if (bgMusic.duration) {
    bgMusic.currentTime = (progressBar.value / 100) * bgMusic.duration;
  }
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
];

function startPhotoRain(container, sources) {
  const rain = document.createElement("div");
  rain.className = "rain-container";
  container.prepend(rain);

  const totalLanes = 8;
  let laneIndex = 0;

  const intervalId = setInterval(() => {
    const img = document.createElement("img");
    img.className = "falling-photo";
    img.src = sources[Math.floor(Math.random() * sources.length)];

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
      el.src = sources[Math.floor(Math.random() * sources.length)];
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

function startBackgroundRain(container) {
  const rain = document.createElement("div");
  rain.className = "rain-container";
  container.prepend(rain);

  const totalLanes = 12; // chia màn hình thành các "làn" để chữ xuất hiện đều hơn
  let laneIndex = 0;

  const intervalId = setInterval(() => {
    const el = document.createElement("span");
    el.className = "falling-text";
    el.textContent = rainWords[Math.floor(Math.random() * rainWords.length)];

    const lane = laneIndex % totalLanes;
    laneIndex++;
    const jitter = Math.random() * (100 / totalLanes) * 0.6;
    el.style.left = lane * (100 / totalLanes) + jitter + "%";

    el.style.fontSize = 14 + Math.random() * 16 + "px";

    const duration = 6 + Math.random() * 5;
    el.style.animationDuration = duration + "s";

    rain.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }, 260);

  return intervalId;
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
    readingPage.classList.remove("show");

    setTimeout(() => {
      readingPage.remove();
      goToClosingPage();
    }, 500);
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
        clearTimeout(idleTextTimeout); // tránh bị ghi đè chữ nếu bấm trước khi hết 2.5s
        envelope.classList.add("open");
        closingText.textContent = "Bấm vào lá thư để đọc...💌";
        closingLetterContent.textContent = "Gửi Piii";
      });

      closingLetterEl.addEventListener("click", () => {
        if (!envelope.classList.contains("open")) return;

        clearInterval(rainInterval);
        closingContainer.classList.remove("show");

        setTimeout(() => {
          closingContainer.remove();
          goToReadingPage();
        }, 500);
      });
    },
    700 + 650 + 650,
  );
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
  });

  const letterEl = envelopeContainer.querySelector(".letter");
  letterEl.addEventListener("click", () => {
    if (!envelope.classList.contains("open")) return;

    clearInterval(rainInterval);
    envelopeContainer.classList.remove("show");

    setTimeout(() => {
      envelopeContainer.remove();
      goToReadingPage();
    }, 500);
  });
}
