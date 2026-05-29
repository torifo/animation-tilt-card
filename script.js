/* ────────────────────────────────────────────
   D·Ho · Tilt Card
   - data-tilt の各カードに pointermove で目標 rotateX/Y、ease 補間
   - data-tilt-gloss / data-tilt-shine の bg-position もティルトに同期
   - pointer:coarse（タッチ）と prefers-reduced-motion は無効化
   ──────────────────────────────────────────── */

(() => {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE    = window.matchMedia('(pointer: fine)').matches;

  if (REDUCED || !FINE) {
    // CSS 側で transform は無効化済み。何もしない。
    return;
  }

  function initTilt(card) {
    const inner = card.querySelector('.tc-inner') || card;
    const gloss = card.querySelector('[data-tilt-gloss]');
    const shine = card.querySelector('[data-tilt-shine]');

    const MAX        = clampFloat(card.dataset.tiltMax, 14, 0, 40);
    const PERSPECT   = clampFloat(card.dataset.tiltPerspective, 900, 200, 3000);
    const HOVER_SCL  = clampFloat(card.dataset.tiltScale, 1.04, 1, 1.2);
    const EASE       = clampFloat(card.dataset.tiltEase, 0.14, 0.04, 0.5);

    card.style.setProperty('--tc-perspective', `${PERSPECT}px`);

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let targetScale = 1;
    let curScale = 1;
    let hovering = false;
    let pending = false;

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;     // 0..1
      const py = (e.clientY - rect.top)  / rect.height;
      const ox = px * 2 - 1;                                // -1..1
      const oy = py * 2 - 1;
      targetX = -oy * MAX;                                  // rotateX：上が＋（screen y が +）
      targetY =  ox * MAX;                                  // rotateY
      ensureRaf();
    }
    function onEnter() {
      hovering = true;
      targetScale = HOVER_SCL;
      ensureRaf();
    }
    function onLeave() {
      hovering = false;
      targetX = 0; targetY = 0;
      targetScale = 1;
      ensureRaf();
    }

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('pointermove',  onMove);

    function ensureRaf() {
      if (!pending) {
        pending = true;
        requestAnimationFrame(tick);
      }
    }

    function tick() {
      pending = false;
      curX += (targetX - curX) * EASE;
      curY += (targetY - curY) * EASE;
      curScale += (targetScale - curScale) * EASE;

      const settled =
        !hovering &&
        Math.abs(curX) < 0.04 &&
        Math.abs(curY) < 0.04 &&
        Math.abs(curScale - 1) < 0.001;

      if (settled) {
        inner.style.transform = '';
        if (gloss) gloss.style.removeProperty('--gx');
        if (gloss) gloss.style.removeProperty('--gy');
        if (gloss) gloss.style.removeProperty('--gloss-angle');
        if (shine) shine.style.removeProperty('--shine-x');
        if (shine) shine.style.removeProperty('--shine-y');
        return;
      }

      inner.style.transform =
        `rotateX(${curX.toFixed(2)}deg) ` +
        `rotateY(${curY.toFixed(2)}deg) ` +
        `scale(${curScale.toFixed(3)})`;

      // gloss conic gradient の中心位置 + 開始角を tilt に同期
      if (gloss) {
        // -1..1 を 0..100% にマップ
        const gx = 50 + (curY / MAX) * 35;   // rotateY が右なら右寄り
        const gy = 50 - (curX / MAX) * 35;   // rotateX が上なら上寄り
        gloss.style.setProperty('--gx', `${gx.toFixed(1)}%`);
        gloss.style.setProperty('--gy', `${gy.toFixed(1)}%`);
        const angle = 30 + (curY / MAX) * 80;
        gloss.style.setProperty('--gloss-angle', `${angle.toFixed(1)}deg`);
      }

      // shine 帯（linear gradient bg-position）— gloss と逆方向に流す
      if (shine) {
        const sx = 50 - (curY / MAX) * 60;
        const sy = 50 - (curX / MAX) * 60;
        shine.style.setProperty('--shine-x', `${sx.toFixed(1)}%`);
        shine.style.setProperty('--shine-y', `${sy.toFixed(1)}%`);
      }

      ensureRaf();
    }
  }

  function clampFloat(raw, fb, min, max) {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return fb;
    return Math.max(min, Math.min(max, n));
  }

  function boot() {
    document.querySelectorAll('[data-tilt]').forEach(initTilt);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
