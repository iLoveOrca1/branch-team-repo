import { initSmoothScroll } from "./modules/smoothScrolling.js";
import { initNavbar } from "./modules/navbar.js";
import { typeEffect } from "./modules/typeEffect.js";
import { initCustomCursor } from "./modules/customCursor.js";
import { initProgressScroll } from "./modules/progressScroll.js";

let nav = document.getElementById('nav');;

function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
initCustomCursor();

document.addEventListener("DOMContentLoaded", () => {  
  initNavbar();
  initProgressScroll();
  initSmoothScroll();
});

const roles = [
  "We're Branch Team",
  "I Made Gilang Pradnyananda",
  "I Ketut Dharmawan",
  // "Ignatius Raka Satria Dewa | Ilkom",
  "I Kadek Oka Santika",
  "Kadek Keisya Vinanda",
];

typeEffect(roles);