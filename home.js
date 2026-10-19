const homeLink = document.getElementById("home-link");
const cat = document.getElementById("cat");
const eyes = cat.querySelectorAll(".eye");
const homeUrl = "https://home.catfood.bar/";

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

function blink() {
  eyes.forEach((eye) => (eye.textContent = "-"));
  setTimeout(() => eyes.forEach((eye) => (eye.textContent = "o")), 180);
  setTimeout(blink, 2500 + Math.random() * 4000);
}

isOnHomeNetwork().then((reachable) => {
  if (!reachable) return;
  cat.dataset.awake = "";
  homeLink.href = homeUrl;
  homeLink.removeAttribute("aria-disabled");
  homeLink.removeAttribute("title");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) blink();
});
