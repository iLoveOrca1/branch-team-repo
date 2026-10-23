import { initSmoothScroll } from "./modules/smoothScrolling.js";
import { initNavbar } from "./modules/navbar.js";
import { typeEffect } from "./modules/typeEffect.js";
import { initCustomCursor } from "./modules/customCursor.js";

let nav = document.getElementById('nav');;

function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
initCustomCursor();

document.addEventListener("DOMContentLoaded", () => {  
  initNavbar();
  initSmoothScroll();
});

typeEffect();