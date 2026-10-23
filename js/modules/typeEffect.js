let reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function typeEffect() {
  const roles = [
    "We're Branch Team",
    "I Made Gilang Pradnyananda",
    "I Ketut Dharmawan",
    // "Ignatius Raka Satria Dewa | Ilkom",
    "I Kadek Oka Santika",
    "Kadek Keisya Vinanda",
  ];
  let el = document.getElementById("typed");
  console.log(el);
  if (reduce) {
    el.textContent = roles[0];
  } else {
    let ri = 0,
      ci = 0,
      del = false;
    (function tick() {
      let w = roles[ri];
      ci += del ? -1 : 1;
      el.textContent = w.slice(0, ci);
      let d = del ? 35 : 70;
      if (!del && ci === w.length) {
        d = 1400;
        del = true;
      } else if (del && ci === 0) {
        del = false;
        ri = (ri + 1) % roles.length;
        d = 300;
      }
      setTimeout(tick, d);
    })();
  }
}
