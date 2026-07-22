(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");
  const levelEl = document.getElementById("level");

  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");

  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");
  const closeHelpBtn = document.getElementById("closeHelpBtn");

  const W = 900;
  const H = 600;

  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  const game = {
    state: "menu",
    score: 0,
    lives: 3,
    level: 1,
    time: 0,
    shake: 0,
    combo: 1
  };

  const paddle = {
    x: W / 2 - 84,
    y: H - 35,
    w: 168,
    h: 15,
    targetX: W / 2 - 84,
    speed: 9
  };

  const ball = {
    x: W / 2,
    y: H - 61,
    r: 8,
    vx: 4.2,
    vy: -5.2,
    speed: 6.7,
    stuck: true
  };

  let molecules = [];
  let particles = [];
  let floatingTexts = [];
  let trail = [];

  const keys = {
    left: false,
    right: false
  };

  function setupCanvas() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateUi() {
    scoreEl.textContent = game.score;
    livesEl.textContent = game.lives;
    levelEl.textContent = game.level;
  }

  function showOverlay(title, text, btn) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    startBtn.textContent = btn;
    overlay.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

function createMolecules() {
  molecules = [];

  const cols = 8; 
  const rows = Math.min(3 + game.level, 6);
  const gapX = 76;
  const gapY = 46;
  const moleculeRadius = 24;

  const startX = (W - (cols - 1) * gapX) / 2;
  const startY = 58;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      molecules.push({
        x: startX + col * gapX,
        y: startY + row * gapY,
        r: moleculeRadius,
        hp: 2,
        alive: true,
        unstable: false,
        type: (row + col + game.level) % 3,
        spin: Math.random() * Math.PI * 2,
        wobble: Math.random() * Math.PI * 2,
        pop: 0
      });
    }
  }
}

  function resetBall(stuck = true) {
    ball.stuck = stuck;
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r - 4;

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.48;

    ball.speed = 6.35 + game.level * 0.35;
    ball.vx = Math.cos(angle) * ball.speed;
    ball.vy = Math.sin(angle) * ball.speed;

    trail = [];
  }

  function newGame() {
    game.state = "ready";
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    game.combo = 1;

    paddle.w = 168;
    paddle.h = 15;
    paddle.x = W / 2 - paddle.w / 2;
    paddle.targetX = paddle.x;

    createMolecules();
    resetBall(true);
    updateUi();
    hideOverlay();
  }

  function nextLevel() {
    game.level++;
    game.combo = 1;

    paddle.w = Math.max(122, 168 - (game.level - 1) * 8);
    paddle.h = 15;
    paddle.x = W / 2 - paddle.w / 2;
    paddle.targetX = paddle.x;

    createMolecules();
    resetBall(true);

    game.state = "ready";

    updateUi();

    showOverlay(
      "Level " + game.level,
      "New molecular structure. Same precision, less room for error.",
      "Launch"
    );
  }

  function launchBall() {
    if (game.state === "menu") {
      newGame();
      return;
    }

    if (game.state === "ready") {
      game.state = "playing";
      ball.stuck = false;
      hideOverlay();
      return;
    }

    if (game.state === "paused") {
      game.state = "playing";
      hideOverlay();
      return;
    }

    if (game.state === "gameover" || game.state === "win") {
      newGame();
    }
  }

  function togglePause() {
    if (game.state === "playing") {
      game.state = "paused";
      showOverlay(
        "Paused",
        "The reaction is temporarily suspended.",
        "Continue"
      );
    } else if (game.state === "paused") {
      game.state = "playing";
      hideOverlay();
    } else {
      launchBall();
    }
  }

  function spawnParticles(x, y, color = "#fff", count = 12, power = 1) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = (1.2 + Math.random() * 4.4) * power;

      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        r: 1.4 + Math.random() * 2.8,
        life: 42 + Math.random() * 24,
        maxLife: 66,
        color
      });
    }
  }

  function addFloatingText(x, y, text) {
    floatingTexts.push({
      x,
      y,
      text,
      life: 52,
      maxLife: 52
    });
  }

  function circleCircleCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const rr = a.r + b.r;

    return dx * dx + dy * dy <= rr * rr;
  }

  function circleRectCollision(cx, cy, r, rect) {
    const nearestX = clamp(cx, rect.x, rect.x + rect.w);
    const nearestY = clamp(cy, rect.y, rect.y + rect.h);
    const dx = cx - nearestX;
    const dy = cy - nearestY;

    return dx * dx + dy * dy <= r * r;
  }

  function reflectFromCircle(target) {
    const dx = ball.x - target.x;
    const dy = ball.y - target.y;
    const dist = Math.hypot(dx, dy) || 1;

    const nx = dx / dist;
    const ny = dy / dist;

    const dot = ball.vx * nx + ball.vy * ny;

    ball.vx -= 2 * dot * nx;
    ball.vy -= 2 * dot * ny;

    ball.x = target.x + nx * (ball.r + target.r + 0.5);
    ball.y = target.y + ny * (ball.r + target.r + 0.5);

    const len = Math.hypot(ball.vx, ball.vy) || 1;

    ball.vx = ball.vx / len * ball.speed;
    ball.vy = ball.vy / len * ball.speed;
  }

  function hitPaddle() {
    const paddleHitbox = {
      x: paddle.x - 12,
      y: paddle.y - 6,
      w: paddle.w + 24,
      h: paddle.h + 14
    };

    if (!circleRectCollision(ball.x, ball.y, ball.r, paddleHitbox)) return;
    if (ball.vy <= 0) return;

    const relative =
      (ball.x - (paddleHitbox.x + paddleHitbox.w / 2)) /
      (paddleHitbox.w / 2);

    const angle = -Math.PI / 2 + relative * 0.95;

    ball.speed = Math.min(11.5, ball.speed + 0.06);
    ball.vx = Math.cos(angle) * ball.speed;
    ball.vy = Math.sin(angle) * ball.speed;

    ball.y = paddle.y - ball.r - 1;

    game.combo = 1;

    spawnParticles(ball.x, ball.y, "#fff", 5, 0.55);
  }

  function hitMolecules() {
    for (const mol of molecules) {
      if (!mol.alive) continue;

      if (circleCircleCollision(ball, mol)) {
        reflectFromCircle(mol);

        mol.hp--;
        mol.pop = 1;
        game.shake = 4;

        if (mol.hp === 1) {
          mol.unstable = true;
          game.score += 45;

          addFloatingText(mol.x, mol.y - 6, "ION");
          spawnParticles(mol.x, mol.y, "#bdbdbd", 10, 0.72);
        } else {
          mol.alive = false;

          const gained = Math.round(120 * game.combo);

          game.score += gained;
          game.combo = Math.min(5, game.combo + 0.25);

          addFloatingText(mol.x, mol.y, "+" + gained);
          spawnParticles(mol.x, mol.y, "#fff", 24, 1.1);

          ball.speed = Math.min(11.5, ball.speed + 0.03);

          const len = Math.hypot(ball.vx, ball.vy) || 1;

          ball.vx = ball.vx / len * ball.speed;
          ball.vy = ball.vy / len * ball.speed;
        }

        updateUi();
        break;
      }
    }

    if (molecules.every(m => !m.alive)) {
      game.score += 500 * game.level;
      updateUi();

      if (game.level >= 5) {
        game.state = "win";

        showOverlay(
          "Synthesis Complete",
          "Every structure was fragmented",
          "Play Again"
        );
      } else {
        nextLevel();
      }
    }
  }

  function loseLife() {
    game.lives--;
    game.combo = 1;

    updateUi();

    spawnParticles(ball.x, H - 18, "#fff", 24, 1.2);

    if (game.lives <= 0) {
      game.state = "gameover";

      showOverlay(
        "Reaction Failed",
        "The chain broke before completion.",
        "Retry"
      );
    } else {
      game.state = "ready";

      resetBall(true);

      showOverlay(
        "Another Life",
        "Recalibrate the paddle and launch again.",
        "Launch"
      );
    }
  }

  function updateParticles(dt) {
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.982, dt);
      p.vy *= Math.pow(0.982, dt);
      p.vy += 0.035 * dt;
      p.life -= dt;
    }

    particles = particles.filter(p => p.life > 0);

    for (const t of floatingTexts) {
      t.y -= 0.45 * dt;
      t.life -= dt;
    }

    floatingTexts = floatingTexts.filter(t => t.life > 0);
  }

  function update(dt) {
    game.time += dt;

    if (game.shake > 0) {
      game.shake = Math.max(0, game.shake - 0.28 * dt);
    }

    if (keys.left) paddle.targetX -= paddle.speed * dt;
    if (keys.right) paddle.targetX += paddle.speed * dt;

    paddle.targetX = clamp(paddle.targetX, 18, W - paddle.w - 18);
    paddle.x = lerp(paddle.x, paddle.targetX, 0.28);

    if (ball.stuck) {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 4;
    }

    for (const mol of molecules) {
      mol.pop *= Math.pow(0.86, dt);
      mol.spin += 0.005 * dt * (mol.unstable ? 2.4 : 1);
    }

    if (game.state === "playing") {
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      trail.push({
        x: ball.x,
        y: ball.y,
        life: 18
      });

      if (trail.length > 18) {
        trail.shift();
      }

      for (const tr of trail) {
        tr.life -= dt;
      }

      trail = trail.filter(tr => tr.life > 0);

      if (ball.x - ball.r <= 0) {
        ball.x = ball.r;
        ball.vx *= -1;
        spawnParticles(ball.x, ball.y, "#fff", 4, 0.5);
      }

      if (ball.x + ball.r >= W) {
        ball.x = W - ball.r;
        ball.vx *= -1;
        spawnParticles(ball.x, ball.y, "#fff", 4, 0.5);
      }

      if (ball.y - ball.r <= 0) {
        ball.y = ball.r;
        ball.vy *= -1;
        spawnParticles(ball.x, ball.y, "#fff", 4, 0.5);
      }

      hitPaddle();
      hitMolecules();

      if (ball.y - ball.r > H + 20) {
        loseLife();
      }
    }

    updateParticles(dt);
  }

  function drawBackground() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, W, H);

    ctx.save();

    const grad = ctx.createRadialGradient(
      W / 2,
      H / 2,
      60,
      W / 2,
      H / 2,
      H * 0.9
    );

    grad.addColorStop(0, "rgba(255,255,255,0.035)");
    grad.addColorStop(0.55, "rgba(255,255,255,0.012)");
    grad.addColorStop(1, "rgba(0,0,0,0.85)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= W; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    for (let y = 0; y <= H; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.12;

    for (let i = 0; i < 140; i++) {
      const x = (Math.sin(i * 91.7 + game.time * 0.01) * 0.5 + 0.5) * W;
      const y = (Math.cos(i * 47.3 + game.time * 0.012) * 0.5 + 0.5) * H;

      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.restore();
  }

  function drawAtom(x, y, label, unstable) {
    ctx.save();

    ctx.fillStyle = unstable
      ? "rgba(255,255,255,0.14)"
      : "rgba(255,255,255,0.09)";

    ctx.strokeStyle = unstable
      ? "rgba(255,255,255,0.92)"
      : "rgba(255,255,255,0.72)";

    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.arc(x, y, 7.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "700 8px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 0.5);

    ctx.restore();
  }

  function drawBond(x1, y1, x2, y2, unstable, doubleBond = false) {
    ctx.save();

    ctx.strokeStyle = unstable
      ? "rgba(255,255,255,0.9)"
      : "rgba(255,255,255,0.55)";

    ctx.lineWidth = unstable ? 1.7 : 1.3;

    if (unstable) {
      ctx.setLineDash([4, 4]);
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (doubleBond) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const ox = -dy / len * 3;
      const oy = dx / len * 3;

      ctx.beginPath();
      ctx.moveTo(x1 + ox, y1 + oy);
      ctx.lineTo(x2 + ox, y2 + oy);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMolecule(mol) {
    if (!mol.alive) return;

    const unstable = mol.unstable;
    const breathe = Math.sin(game.time * 0.035 + mol.wobble) * 1.4;
    const jitter = unstable
      ? Math.sin(game.time * 0.7 + mol.wobble) * 1.3
      : 0;

    const scale = 1 + mol.pop * 0.12;
    const alpha = unstable ? 0.96 : 0.82;

    ctx.save();

    ctx.translate(mol.x + jitter, mol.y + breathe);
    ctx.rotate(mol.spin);
    ctx.scale(scale, scale);

    ctx.globalAlpha = alpha;

    ctx.shadowColor = unstable
      ? "rgba(255,255,255,0.22)"
      : "rgba(255,255,255,0.12)";

    ctx.shadowBlur = unstable ? 18 : 10;

    if (mol.type === 0) {
      const pts = [];

      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 3;

        pts.push({
          x: Math.cos(a) * 22,
          y: Math.sin(a) * 22
        });
      }

      for (let i = 0; i < 6; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % 6];

        drawBond(a.x, a.y, b.x, b.y, unstable, i % 2 === 0);
      }

      for (let i = 0; i < 6; i++) {
        drawAtom(pts[i].x, pts[i].y, i === 1 ? "O" : "C", unstable);
      }

      drawBond(
        pts[3].x,
        pts[3].y,
        pts[3].x - 20,
        pts[3].y + 13,
        unstable
      );

      drawAtom(pts[3].x - 27, pts[3].y + 18, "H", unstable);
    }

    if (mol.type === 1) {
      const pts = [
        { x: -26, y: 8, l: "C" },
        { x: -10, y: -10, l: "C" },
        { x: 9, y: 8, l: "C" },
        { x: 27, y: -8, l: "O" }
      ];

      for (let i = 0; i < pts.length - 1; i++) {
        drawBond(
          pts[i].x,
          pts[i].y,
          pts[i + 1].x,
          pts[i + 1].y,
          unstable,
          i === 2
        );
      }

      drawBond(-10, -10, -10, -31, unstable);
      drawAtom(-10, -37, "H", unstable);

      for (const p of pts) {
        drawAtom(p.x, p.y, p.l, unstable);
      }
    }

    if (mol.type === 2) {
      const center = {
        x: 0,
        y: 0,
        l: "C"
      };

      const pts = [
        { x: -25, y: 0, l: "H" },
        { x: 22, y: -15, l: "N" },
        { x: 24, y: 17, l: "O" },
        { x: 0, y: -28, l: "C" }
      ];

      for (const p of pts) {
        drawBond(center.x, center.y, p.x, p.y, unstable, p.l === "O");
      }

      drawAtom(center.x, center.y, center.l, unstable);

      for (const p of pts) {
        drawAtom(p.x, p.y, p.l, unstable);
      }
    }

    if (unstable) {
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255,255,255,0.26)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);

      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMolecules() {
    for (const mol of molecules) {
      drawMolecule(mol);
    }
  }

  function drawPaddle() {
    ctx.save();

    const yLift = Math.sin(game.time * 0.05) * 1.1;

    ctx.shadowColor = "rgba(255,255,255,0.18)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "#fff";
    ctx.fillRect(paddle.x, paddle.y + yLift, paddle.w, paddle.h);

    ctx.shadowColor = "transparent";
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(
      paddle.x + 10,
      paddle.y + yLift + 4,
      paddle.w * 0.32,
      2
    );

    ctx.restore();
  }

  function drawBall() {
    ctx.save();

    for (const tr of trail) {
      const alpha = tr.life / 18;

      ctx.globalAlpha = alpha * 0.22;
      ctx.fillStyle = "#fff";

      ctx.beginPath();
      ctx.arc(
        tr.x,
        tr.y,
        ball.r * (0.65 + alpha * 0.45),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowColor = "rgba(255,255,255,0.34)";
    ctx.shadowBlur = 18;

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";

    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.55;

    ctx.beginPath();
    ctx.arc(
      ball.x - ball.r * 0.25,
      ball.y - ball.r * 0.3,
      ball.r * 0.27,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  function drawParticles() {
    ctx.save();

    for (const p of particles) {
      const a = clamp(p.life / p.maxLife, 0, 1);

      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    ctx.save();

    ctx.font = "850 15px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const t of floatingTexts) {
      const a = t.life / t.maxLife;

      ctx.globalAlpha = a;
      ctx.fillStyle = "#fff";
      ctx.fillText(t.text, t.x, t.y);
    }

    ctx.restore();
  }

  function drawReadyIndicator() {
    if (game.state !== "ready") return;

    ctx.save();

    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 8]);

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y - 14);
    ctx.lineTo(ball.x, ball.y - 74);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "750 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("click / space to launch", ball.x, ball.y - 88);

    ctx.restore();
  }

  function render() {
    ctx.save();

    if (game.shake > 0) {
      const s = game.shake;
      ctx.translate(
        (Math.random() - 0.5) * s,
        (Math.random() - 0.5) * s
      );
    }

    drawBackground();
    drawMolecules();
    drawPaddle();
    drawBall();
    drawParticles();
    drawReadyIndicator();

    ctx.restore();
  }

  let last = performance.now();

  function loop(now) {
    const raw = (now - last) / 16.666;
    const dt = Math.min(2, Math.max(0.35, raw));

    last = now;

    update(dt);
    render();

    requestAnimationFrame(loop);
  }

  function pointerToCanvasX(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    return ((clientX - rect.left) / rect.width) * W;
  }

  canvas.addEventListener("mousemove", event => {
    const x = pointerToCanvasX(event);
    paddle.targetX = clamp(x - paddle.w / 2, 18, W - paddle.w - 18);
  });

  canvas.addEventListener(
    "touchmove",
    event => {
      event.preventDefault();

      const x = pointerToCanvasX(event);
      paddle.targetX = clamp(x - paddle.w / 2, 18, W - paddle.w - 18);
    },
    { passive: false }
  );

  canvas.addEventListener("pointerdown", () => {
    launchBall();
  });

  startBtn.addEventListener("click", () => {
    launchBall();
  });

  helpBtn.addEventListener("click", () => {
    helpModal.classList.remove("hidden");
  });

  closeHelpBtn.addEventListener("click", () => {
    helpModal.classList.add("hidden");
  });

  helpModal.addEventListener("click", event => {
    if (event.target === helpModal) {
      helpModal.classList.add("hidden");
    }
  });

  window.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
      keys.left = true;
    }

    if (key === "arrowright" || key === "d") {
      keys.right = true;
    }

    if (key === " ") {
      event.preventDefault();
      togglePause();
    }

    if (key === "r") {
      newGame();
    }

    if (key === "escape") {
      helpModal.classList.add("hidden");
    }
  });

  window.addEventListener("keyup", event => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
      keys.left = false;
    }

    if (key === "arrowright" || key === "d") {
      keys.right = false;
    }
  });

  window.addEventListener("resize", setupCanvas);

  setupCanvas();
  createMolecules();
  resetBall(true);
  updateUi();

  showOverlay(
    "Organic Breaker",
    "Fragment organic molecules",
    "Start"
  );

  requestAnimationFrame(loop);
})();