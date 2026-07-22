const root = document.documentElement;
const body = document.body;

const config = {
  ease: 0.08,
  pulseDecay: 0.92,
  pulseBaseSize: 8,
  pulseExtraSize: 42,
  pulseMaxAlpha: 0.65
};

const state = {
  targetX: 50,
  targetY: 50,

  currentX: 50,
  currentY: 50,

  pulse: 0,
  isPointerActive: false
};

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
};

const cssCache = new Map();

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let animationFrameId = null;
let isAnimationRunning = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateViewport() {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
}

function getPointerPercent(clientX, clientY) {
  return {
    x: clamp((clientX / viewport.width) * 100, 0, 100),
    y: clamp((clientY / viewport.height) * 100, 0, 100)
  };
}

function setCSSVar(name, value, unit = "%", precision = 2) {
  const formattedValue = `${Number(value).toFixed(precision)}${unit}`;

  if (cssCache.get(name) === formattedValue) {
    return;
  }

  cssCache.set(name, formattedValue);
  root.style.setProperty(name, formattedValue);
}

function setCSSNumber(name, value, precision = 3) {
  const formattedValue = Number(value).toFixed(precision);

  if (cssCache.get(name) === formattedValue) {
    return;
  }

  cssCache.set(name, formattedValue);
  root.style.setProperty(name, formattedValue);
}

function updateTargetPosition(clientX, clientY) {
  const position = getPointerPercent(clientX, clientY);

  state.targetX = position.x;
  state.targetY = position.y;
}

function triggerPulse(clientX, clientY) {
  const position = getPointerPercent(clientX, clientY);

  setCSSVar("--pulse-x", position.x);
  setCSSVar("--pulse-y", position.y);

  state.targetX = position.x;
  state.targetY = position.y;

  if (!reducedMotionQuery.matches) {
    state.pulse = 1;
  }

  body.classList.toggle("is-active");
}

function updateGradientVariables() {
  const offsetX = state.currentX - 50;
  const offsetY = state.currentY - 50;

  const x1 = 50 + offsetX * 1.0;
  const y1 = 50 + offsetY * 1.0;

  const x2 = 50 + offsetX * 0.55;
  const y2 = 50 + offsetY * 0.55;

  const x3 = 50 + offsetX * -0.35;
  const y3 = 50 + offsetY * -0.35;

  const normalizedX = offsetX / 50;
  const normalizedY = offsetY / 50;

  const r1x = 55 + normalizedX * 10;
  const r1y = 45 + normalizedY * 8;

  const r2x = 65 - normalizedX * 8;
  const r2y = 55 + normalizedY * 6;

  const r3x = 75 + normalizedY * 10;
  const r3y = 60 - normalizedX * 8;

  setCSSVar("--x1", x1);
  setCSSVar("--y1", y1);

  setCSSVar("--x2", x2);
  setCSSVar("--y2", y2);

  setCSSVar("--x3", x3);
  setCSSVar("--y3", y3);

  setCSSVar("--r1x", r1x);
  setCSSVar("--r1y", r1y);

  setCSSVar("--r2x", r2x);
  setCSSVar("--r2y", r2y);

  setCSSVar("--r3x", r3x);
  setCSSVar("--r3y", r3y);
}

function updatePulseVariables() {
  if (reducedMotionQuery.matches) {
    state.pulse = 0;
  } else {
    state.pulse *= config.pulseDecay;
  }

  const pulseSize = config.pulseBaseSize + state.pulse * config.pulseExtraSize;
  const pulseAlpha = state.pulse * config.pulseMaxAlpha;

  setCSSVar("--pulse-size", pulseSize);
  setCSSNumber("--pulse-alpha", pulseAlpha);
}

function animate() {
  const ease = reducedMotionQuery.matches ? 1 : config.ease;

  state.currentX += (state.targetX - state.currentX) * ease;
  state.currentY += (state.targetY - state.currentY) * ease;

  updateGradientVariables();
  updatePulseVariables();

  animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (isAnimationRunning) {
    return;
  }

  isAnimationRunning = true;
  animationFrameId = requestAnimationFrame(animate);
}

function stopAnimation() {
  if (!isAnimationRunning) {
    return;
  }

  isAnimationRunning = false;
  cancelAnimationFrame(animationFrameId);
}

window.addEventListener(
  "pointerdown",
  (event) => {
    state.isPointerActive = true;

    updateTargetPosition(event.clientX, event.clientY);
    triggerPulse(event.clientX, event.clientY);
  },
  { passive: true }
);

window.addEventListener(
  "pointermove",
  (event) => {
    if (event.pointerType === "touch" && !state.isPointerActive) {
      return;
    }

    updateTargetPosition(event.clientX, event.clientY);
  },
  { passive: true }
);

window.addEventListener(
  "pointerup",
  () => {
    state.isPointerActive = false;
  },
  { passive: true }
);

window.addEventListener(
  "pointercancel",
  () => {
    state.isPointerActive = false;
  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {
    updateViewport();
  },
  { passive: true }
);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAnimation();
  } else {
    updateViewport();
    startAnimation();
  }
});

startAnimation();

