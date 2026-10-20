const homeLink = document.getElementById("home-link");
const cat = document.getElementById("cat");
const eyes = cat.querySelectorAll(".eye");
const snore = cat.querySelector(".snore");
const bowl = document.getElementById("bowl");
const food = bowl.querySelector(".food");
const mealsLabel = document.getElementById("meals");
const homeUrl = "https://home.catfood.bar/";
const purrs = ["prrr", "<3", "mrrp", "prrr <3", "*purr*"];
const foodStages = [".:.:.", ".:.: ", " :.: ", "  .  ", "     "];
const mealsPerMinuteLimit = 5;

let happyUntil = 0;
let snoreTimer;
let eating = false;
let recentMeals = [];
let meals = readMeals();

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

function readMeals() {
  try {
    return Number(localStorage.getItem("meals")) || 0;
  } catch {
    return 0;
  }
}

function saveMeals() {
  try {
    localStorage.setItem("meals", String(meals));
  } catch {}
}

function renderMeals() {
  if (meals === 0) return;
  mealsLabel.textContent = `meals served: ${meals}`;
  mealsLabel.hidden = false;
}

function isAwake() {
  return "awake" in cat.dataset;
}

function setEyes(character) {
  eyes.forEach((eye) => (eye.textContent = character));
}

function beHappy(duration) {
  happyUntil = Date.now() + duration;
  setEyes("^");
  setTimeout(() => {
    if (Date.now() > happyUntil) setEyes("o");
  }, duration + 50);
}

function mumble(text, duration) {
  snore.textContent = text;
  clearTimeout(snoreTimer);
  snoreTimer = setTimeout(() => (snore.textContent = "ZZZzz"), duration);
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

function floatText(text) {
  const bubble = document.createElement("span");
  bubble.className = "purr";
  bubble.textContent = text;
  bubble.style.left = `${20 + Math.random() * 60}%`;
  bubble.addEventListener("animationend", () => bubble.remove());
  cat.append(bubble);
}

function pet() {
  floatText(purrs[Math.floor(Math.random() * purrs.length)]);
  if (isAwake()) beHappy(1200);
  else mumble("prrrr", 1500);
}

function feed() {
  if (eating) return;
  const now = Date.now();
  recentMeals = recentMeals.filter((time) => now - time < 60000);
  if (recentMeals.length >= mealsPerMinuteLimit) {
    floatText("full. mrrp.");
    return;
  }
  recentMeals.push(now);
  eating = true;
  food.textContent = foodStages[0];
  const eatingDuration = 700 + (foodStages.length - 1) * 450;
  if (isAwake()) beHappy(eatingDuration);
  else mumble("sniff", eatingDuration);

  let stage = 0;
  setTimeout(function eat() {
    stage += 1;
    food.textContent = foodStages[stage];
    floatText("nom");
    if (stage < foodStages.length - 1) {
      setTimeout(eat, 450);
      return;
    }
    eating = false;
    meals += 1;
    saveMeals();
    renderMeals();
  }, 700);
}

cat.addEventListener("click", pet);
bowl.addEventListener("click", feed);
renderMeals();

isOnHomeNetwork().then((reachable) => {
  if (!reachable) return;
  cat.dataset.awake = "";
  homeLink.href = homeUrl;
  homeLink.removeAttribute("aria-disabled");
  homeLink.removeAttribute("title");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) blink();
});
