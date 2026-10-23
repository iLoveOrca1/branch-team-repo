import { initNavbar } from "./modules/navbar.js";
import { typeEffect } from "./modules/typeEffect.js";
import { initCustomCursor } from "./modules/customCursor.js";

let nav = document.getElementById('nav');

function onScroll() {
  if (!nav) nav = document.getElementById('nav');
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
initCustomCursor();

document.addEventListener("DOMContentLoaded", () => {  
  initNavbar();
});

const defaultRoles = [
  "We're Branch Team",
  "I Made Gilang Pradnyananda",
  "I Ketut Dharmawan",
  // "Ignatius Raka Satria Dewa | Ilkom",
  "I Kadek Oka Santika",
  "Kadek Keisya Vinanda",
];

const typedEl = document.getElementById("typed");
let roles = defaultRoles;

if (typedEl && typedEl.dataset.roles) {
  try {
    roles = JSON.parse(typedEl.dataset.roles);
  } catch (e) {
    roles = defaultRoles;
  }
} else if (window.customRoles && Array.isArray(window.customRoles)) {
  roles = window.customRoles;
}

if (typedEl) {
  typeEffect(roles);
}