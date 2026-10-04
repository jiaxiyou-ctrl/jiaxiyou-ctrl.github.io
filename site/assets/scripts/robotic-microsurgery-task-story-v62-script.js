(() => {
  const figure = document.querySelector('.retinal-task');
  if (!figure) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const replay = figure.querySelector('.task-replay');
  const overview = figure.querySelector('.rt-overview-needle');
  const detail = [...figure.querySelectorAll('.rt-detail-needle')];
  const focus = [...figure.querySelectorAll('.rt-focus-ring, .rt-zoom-link, .rt-zoom-arrow')];
  const reveals = [['.rt-drift', 1020], ['.rt-placement', 1170], ['.rt-depth-label', 1510], ['.rt-overshoot', 1510]];
  const ease = t => t * t * (3 - 2 * t);
  const clamp = v => Math.max(0, Math.min(1, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const duration = 1900;
  let frame = 0;
  let elapsed = 0;
  let lastTime = 0;
  let active = false;
  let started = false;
  let visible = false;
  let readyToStart = false;
  let settleTimer = 0;

  function draw(ms) {
    const align = ease(clamp(ms / 360));
    const advance = ease(clamp((ms - 360) / 700));
    const approach = ease(clamp((ms - 1060) / 650));
    // The inset is a 5x mapping of the overview tip, not a second trajectory.
    const x = mix(mix(mix(349, 322, align), 276.74, advance), 269.74, approach);
    const y = mix(mix(mix(66, 89, align), 293.96, advance), 325.60, approach);
    const angle = mix(24, 12.47, align);
    overview.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
    detail.forEach(needle => needle.setAttribute('transform', `translate(${Number(needle.dataset.tipX) + (x - 269.74) * 5} ${Number(needle.dataset.tipY) + (y - 325.60) * 5}) rotate(${angle})`));
    // Only callouts reveal; anatomy stays visible so the whole task remains legible.
    const zoom = ease(clamp((ms - 780) / 270));
    focus.forEach(el => { el.style.opacity = zoom; });
    reveals.forEach(([selector, delay]) => {
      figure.querySelectorAll(selector).forEach(el => { el.style.opacity = ease(clamp((ms - delay) / 360)); });
    });
    figure.dataset.motion = ms >= duration ? 'complete' : ms > 0 ? 'playing' : 'ready';
  }

  function finish() {
    cancelAnimationFrame(frame);
    active = false;
    elapsed = duration;
    draw(duration);
  }

  function tick(now) {
    if (!active || !visible || document.hidden) { lastTime = 0; return; }
    if (lastTime) elapsed += now - lastTime;
    lastTime = now;
    draw(Math.min(elapsed, duration));
    if (elapsed >= duration) { finish(); return; }
    frame = requestAnimationFrame(tick);
  }

  function play() {
    clearTimeout(settleTimer);
    settleTimer = 0;
    cancelAnimationFrame(frame);
    started = true;
    if (reduced.matches) { finish(); return; }
    elapsed = 0;
    lastTime = 0;
    active = true;
    draw(0);
    frame = requestAnimationFrame(tick);
  }

  function updateVisibility() {
    const box = figure.querySelector('.retinal-detail').getBoundingClientRect();
    const header = document.querySelector('.project-header').getBoundingClientRect().bottom;
    const visibleHeight = Math.max(0, Math.min(box.bottom, innerHeight - 20) - Math.max(box.top, header + 10));
    const wasVisible = visible;
    visible = visibleHeight > box.height * .3;
    // Do not start while only the upper half of the figure is on screen.
    // Once started, tolerate partial visibility so a small scroll does not stall it.
    readyToStart = visibleHeight >= Math.min(box.height * .97, (innerHeight - header - 30) * .92)
      && box.top + box.height * .9 < innerHeight - 20;
    if (!started) {
      if (readyToStart && !document.hidden && !settleTimer) settleTimer = setTimeout(play, 300);
      else if (!readyToStart || document.hidden) { clearTimeout(settleTimer); settleTimer = 0; }
    }
    if (!visible) { cancelAnimationFrame(frame); lastTime = 0; }
    else if (!wasVisible && active && !document.hidden) { lastTime = 0; frame = requestAnimationFrame(tick); }
  }

  replay.hidden = false;
  replay.addEventListener('click', play);
  reduced.addEventListener('change', () => { if (reduced.matches) { started = true; finish(); } });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    clearTimeout(settleTimer);
    settleTimer = 0;
    lastTime = 0;
    if (!document.hidden && visible) {
      if (!started && readyToStart) settleTimer = setTimeout(play, 300);
      else if (active) frame = requestAnimationFrame(tick);
    }
  });
  let scrollFrame = 0;
  function queueVisibility() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateVisibility(); });
  }
  window.addEventListener('scroll', queueVisibility, {passive:true});
  window.addEventListener('resize', queueVisibility);
  window.addEventListener('load', queueVisibility);
  if (reduced.matches) { started = true; finish(); }
  else draw(0);
  updateVisibility();
})();
