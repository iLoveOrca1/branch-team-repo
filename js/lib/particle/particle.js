// Warna aksen dari tema situs
// const accentColors = [
//   "rgba(88,166,255,", // --c0 biru
//   "rgba(255,123,114,", // --c1 merah
//   "rgba(242,204,96,", // --c2 kuning
//   "rgba(126,231,135,", // --c3 hijau
//   "rgba(210,168,255,", // --c4 ungu
// ];

const accentColors = ["rgba(35, 43, 59,"];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray;

// get mouse current position
let mouse = {
  x: undefined,
  y: undefined,
  radius: 120,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    // Simpan posisi asal untuk efek smooth return
    this.baseX = x;
    this.baseY = y;
  }

  // Method to draw individual particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    // Partikel dengan opacity berdasarkan ukuran (lebih besar = lebih terang)
    ctx.fillStyle = this.color + (0.3 + this.size * 0.1) + ")";
    ctx.fill();
  }

  // Check particle position, check mouse position, move the particle, draw the particle
  update() {
    // Check apakah particle diluar canvas. Bila iya, mantul
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Mouse collision detection — smooth repulsion
    if (mouse.x !== undefined && mouse.y !== undefined) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius + this.size) {
        // Hitung arah dari mouse ke partikel (menjauh)
        // Kekuatan makin besar kalau makin dekat
        let force = (mouse.radius - distance) / mouse.radius;
        let angle = Math.atan2(dy, dx);

        // Dorong partikel secara gradual, bukan lompat kasar
        this.x -= Math.cos(angle) * force * 3.5;
        this.y -= Math.sin(angle) * force * 3.5;
      }
    }

    // Move Particle — kecepatan lebih pelan supaya smooth
    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

// Create particle array
function init() {
  particleArray = [];
  const demultiplier = 40000;
  let numberOfParticles = (canvas.height * canvas.width) / demultiplier;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 4 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    // Kecepatan lebih pelan untuk gerakan yang halus
    let directionX = Math.random() * 1 - 0.5;
    let directionY = Math.random() * 1 - 0.5;

    // Pilih warna acak dari palet aksen
    let color = accentColors[Math.floor(Math.random() * accentColors.length)];

    particleArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }
  connect();
}

function connect() {
  const maxDistance = (canvas.width / 7) * (canvas.height / 7);

  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a + 1; b < particleArray.length; b++) {
      const lengthX = particleArray[a].x - particleArray[b].x;
      const lengthY = particleArray[a].y - particleArray[b].y;
      let distance = lengthX * lengthX + lengthY * lengthY;

      if (distance < maxDistance) {
        // Opacity yang memudar berdasarkan jarak — makin jauh makin pudar
        let opacity = 1 - distance / maxDistance;
        ctx.strokeStyle = "rgba(35, 43, 59, " + opacity + ")";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();


