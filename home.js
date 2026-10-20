const homeLink = document.getElementById("home-link");
const cat = document.getElementById("cat");
const eyes = cat.querySelectorAll(".eye");
const snore = cat.querySelector(".snore");
const homeUrl = "https://home.catfood.bar/";
const purrs = ["prrr", "<3", "mrrp", "prrr <3", "*purr*"];

let happyUntil = 0;
let snoreTimer;

async function isOnHomeNetwork() {
  try {
    await fetch(homeUrl, {
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    return true;
  } catch {
    return false;
  }
}

function setEyes(character) {
  eyes.forEach((eye) => (eye.textContent = character));
}

function blink() {
  if (Date.now() > happyUntil) {
    setEyes("-");
    setTimeout(() => {
      if (Date.now() > happyUntil) setEyes("o");
    }, 180);
  }
  setTimeout(blink, 2500 + Math.random() * 4000);
}

function floatPurr() {
  const purr = document.createElement("span");
  purr.className = "purr";
  purr.textContent = purrs[Math.floor(Math.random() * purrs.length)];
  purr.style.left = `${20 + Math.random() * 60}%`;
  purr.addEventListener("animationend", () => purr.remove());
  cat.append(purr);
}

function pet() {
  floatPurr();
  if ("awake" in cat.dataset) {
    happyUntil = Date.now() + 1200;
    setEyes("^");
    setTimeout(() => {
      if (Date.now() > happyUntil) setEyes("o");
    }, 1250);
  } else {
    snore.textContent = "prrrr";
    clearTimeout(snoreTimer);
    snoreTimer = setTimeout(() => (snore.textContent = "ZZZzz"), 1500);
  }
}

cat.addEventListener("click", pet);

isOnHomeNetwork().then((reachable) => {
  if (!reachable) return;
  cat.dataset.awake = "";
  homeLink.href = homeUrl;
  homeLink.removeAttribute("aria-disabled");
  homeLink.removeAttribute("title");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) blink();
});
