const sections = document.querySelectorAll(".zoom-section");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function smoothstep(progress) {
  return progress * progress * (3 - 2 * progress);
}

function getScale(type, progress) {
  const p = smoothstep(progress);

  switch (type) {
    case "in":
      /*
        Zoom in visible:
        La imagen crece al abandonar la sección.
      */
      return lerp(1.0, 1.45, p);

    case "out":
      /*
        Zoom out visible:
        La imagen empieza grande y se encoge al abandonar.
      */
      return lerp(1.45, 1.0, p);

    case "strong-in":
      /*
        Zoom in más dramático.
      */
      return lerp(1.0, 1.85, p);

    case "strong-out":
      /*
        Zoom out más dramático.
      */
      return lerp(1.85, 1.0, p);

    default:
      return lerp(1.0, 1.35, p);
  }
}

function updateZoom() {
  const viewportHeight = window.innerHeight;

  sections.forEach((section) => {
    const scene = section.querySelector(".zoom-scene");
    const img = section.querySelector(".zoom-bg img");

    const rect = section.getBoundingClientRect();

    /*
      La sección mide 220vh.
      La escena sticky mide 100vh.

      El recorrido activo es:
      altura de sección - altura del viewport.
    */
    const scrollDistance = section.offsetHeight - viewportHeight;

    /*
      Cuando la sección llega al top:
      rect.top = 0 → progress = 0

      Mientras la abandonas:
      rect.top se vuelve negativo.

      Cuando termina:
      progress = 1
    */
    const scrolledInside = clamp(-rect.top, 0, scrollDistance);

    const progress = scrollDistance > 0
      ? scrolledInside / scrollDistance
      : 0;

    const type = section.dataset.zoom;
    const scale = getScale(type, progress);

    /*
      Aplicamos el transform directamente al img.
      Esto evita problemas con variables CSS.
    */
    img.style.transform = `scale(${scale})`;

    /*
      Opcional:
      también podemos mover un poco la imagen para hacerlo más cinematográfico.
    */
    const y = lerp(0, -40, progress);
    img.style.transform = `scale(${scale}) translateY(${y}px)`;

    /*
      Debug opcional:
      descomenta esto si quieres ver valores en consola.
    */
    // console.log(type, progress.toFixed(2), scale.toFixed(2));
  });
}

let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateZoom();
      ticking = false;
    });

    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateZoom);

updateZoom();