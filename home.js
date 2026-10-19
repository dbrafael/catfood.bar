const homeLink = document.getElementById("home-link");
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

isOnHomeNetwork().then((reachable) => {
  if (!reachable) return;
  homeLink.href = homeUrl;
  homeLink.removeAttribute("aria-disabled");
  homeLink.removeAttribute("title");
});
