const root = document.documentElement;

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;

let currentX = targetX;
let currentY = targetY;

const ease = 0.08;

window.addEventListener("pointermove", (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
});

function animate() {
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  root.style.setProperty("--x", `${currentX}px`);
  root.style.setProperty("--y", `${currentY}px`);

  requestAnimationFrame(animate);
}

animate();