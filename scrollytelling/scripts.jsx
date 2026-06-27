const steps = document.querySelectorAll(".story-step");
const layers = document.querySelectorAll(".visual-layer");
const progressNumber = document.querySelector(".progress-number");
const progressFill = document.querySelector(".progress-fill");

let activeIndex = 0;

function setActiveStep(index) {
  if (index === activeIndex) return;

  activeIndex = index;

  steps.forEach((step) => {
    const stepIndex = Number(step.dataset.step);
    step.classList.toggle("active", stepIndex === index);
  });

  layers.forEach((layer) => {
    const sceneIndex = Number(layer.dataset.scene);
    layer.classList.toggle("active", sceneIndex === index);
  });

  const current = String(index + 1).padStart(2, "0");
  progressNumber.textContent = current;

  const progress = ((index + 1) / steps.length) * 100;
  progressFill.style.width = `${progress}%`;
}

/*
  IntersectionObserver detecta cuál step está en la zona activa.
  rootMargin ajusta esa zona.

  "-45% 0px -45% 0px" significa:
  solo una franja central del viewport dispara el cambio.
*/

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Number(entry.target.dataset.step);
        setActiveStep(index);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "-45% 0px -45% 0px"
  }
);

steps.forEach((step) => observer.observe(step));

setActiveStep(0);