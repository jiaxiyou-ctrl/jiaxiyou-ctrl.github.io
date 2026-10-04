(() => {
  const player = document.querySelector('.method-sequence');
  if (!player) return;
  const q = selector => player.querySelector(selector);
  const qa = selector => [...player.querySelectorAll(selector)];
  const playButton = q('#sequence-play');
  const replayButton = q('#sequence-replay');
  const timeline = q('#sequence-timeline');
  const clock = q('#sequence-time');
  const title = q('#sequence-title');
  const context = q('#sequence-context');
  const caption = q('#sequence-caption');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [{ name: 'rules', start: 0, end: 24 }, { name: 'policy', start: 24, end: 33 }, { name: 'repair', start: 33, end: 42 }];
  const phases = [
    { name: 'alignment', title: 'Align before entering.', proposal: 'Position + angle correction', permitted: 'Bounded position + angle correction', caption: 'Before entry, position and orientation corrections are allowed within bounds.' },
    { name: 'entry', title: 'Enter along the accepted axis.', proposal: 'Forward + lateral + rotation', permitted: 'Axial feed only', caption: 'At entry, lateral and angular channels are zeroed. Advance along the locked axis.' },
    { name: 'insertion', title: 'Limit the final approach.', proposal: 'A forward step', permitted: 'Depth-limited step → stop', caption: 'Near the target, remaining depth caps the step. Inside the terminal region, forward motion stops.' }
  ];
  const scenes = qa('.sequence-needle-scene').map(svg => ({
    permitted: svg.dataset.scene === 'permitted', svg,
    arrow: svg.querySelector('.seq-arrow'), ghost: svg.querySelector('.seq-ghost'),
    component: svg.querySelector('.seq-component'), rotation: svg.querySelector('.seq-rotation'),
    blocked: svg.querySelector('.seq-blocked'), needle: svg.querySelector('.seq-needle'),
    origin: svg.querySelector('.seq-origin'), depth: svg.querySelector('.seq-depth'), stop: svg.querySelector('.seq-stop')
  }));
  const repairPaths = qa('[data-repair-path]');
  const chapterButtons = qa('[data-chapter-seek]');
  const phaseButtons = qa('[data-phase-seek]');
  const views = qa('[data-view]');
  const equations = [...document.querySelectorAll('#executable-policy [data-equation]')];
  let position = reduced.matches ? 14.9 : 0;
  let wantsPlay = !reduced.matches;
  let visible = false;
  let frame = 0;
  let lastTime = null;
  let lastScene = '';
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const ramp = (p, a, b) => ease((p - a) / (b - a));
  const lerp = (a, b, p) => a + (b - a) * p;
  const text = (element, value) => { if (element.textContent !== value) element.textContent = value; };
  const opacity = (element, value) => { element.style.opacity = clamp(value).toFixed(3); };
  function line(element, a, b, amount = 1) {
    element.setAttribute('d', `M${a[0]} ${a[1]}L${lerp(a[0], b[0], amount)} ${lerp(a[1], b[1], amount)}`);
    opacity(element, amount > .02 ? 1 : 0);
  }
  function trace(element, progress) {
    const length = element.getTotalLength();
    element.style.strokeDasharray = `${length} ${length}`;
    element.style.strokeDashoffset = String(length * (1 - progress));
    opacity(element, progress > .01 ? 1 : 0);
  }
  function stateAt(t) {
    const chapter = t < 24 ? 0 : t < 33 ? 1 : 2;
    const local = t - chapters[chapter].start;
    const phase = chapter === 0 ? Math.min(2, Math.floor(local / 8)) : Math.min(2, Math.floor(local / 3));
    const progress = chapter === 0 ? (local - phase * 8) / 8 : chapter === 1 ? (local - phase * 3) / 3 : local / 9;
    return { chapter, phase, progress };
  }
  function renderNeedle(phase, progress) {
    const origins = [[118, 88], [150, 128], [150, 173]];
    const proposed = [[150, 128], [202, 176], [150, 241]];
    const allowed = [[150, 128], [150, 173], [150, 204]];
    const origin = origins[phase];
    const proposal = proposed[phase];
    const permitted = allowed[phase];
    const intro = ramp(progress, .03, .19);
    const reveal = ramp(progress, .17, .40);
    const rules = ramp(progress, .39, .56);
    const motion = ramp(progress, .59, .82);
    for (const scene of scenes) {
      const endpoint = scene.permitted ? permitted : proposal;
      const draw = scene.permitted ? rules : reveal;
      line(scene.arrow, origin, endpoint, draw);
      line(scene.ghost, origin, proposal);
      opacity(scene.ghost, scene.permitted ? reveal * (.7 - .45 * rules) : 0);
      scene.component.setAttribute('d', `M${origin[0]} ${origin[1]}H${proposal[0]}V${proposal[1]}`);
      opacity(scene.component, phase === 1 ? reveal * (scene.permitted ? 1 - .8 * rules : .5) : 0);
      scene.rotation.setAttribute('transform', `translate(${origin[0] - 118} ${origin[1] - 88})`);
      trace(scene.rotation, reveal);
      opacity(scene.rotation, phase < 2 ? reveal * (scene.permitted && phase === 1 ? 1 - rules : 1) : 0);
      opacity(scene.blocked, scene.permitted && phase === 1 ? rules : 0);
      opacity(scene.depth, scene.permitted && phase === 2 ? intro : 0);
      opacity(scene.stop, scene.permitted && phase === 2 ? ramp(progress, .81, .87) : 0);
      const previousOrigin = phase > 0 ? origins[phase - 1] : origin;
      const start = scene.permitted || phase === 0 ? origin : [lerp(previousOrigin[0], origin[0], intro), lerp(previousOrigin[1], origin[1], intro)];
      const x = scene.permitted ? lerp(origin[0], permitted[0], motion) : start[0];
      const y = scene.permitted ? lerp(origin[1], permitted[1], motion) : start[1];
      const angle = phase === 0 ? (scene.permitted ? 17 * (1 - motion) : 17) : 0;
      scene.needle.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)})`);
      scene.origin.setAttribute('cx', origin[0]); scene.origin.setAttribute('cy', origin[1]);
    }
  }
  function renderPolicy(phase, progress) {
    qa('[data-head]').forEach((head, index) => head.classList.toggle('is-active', index === phase));
    const step = progress < .3 ? 0 : progress < .58 ? 1 : 2;
    qa('[data-command-step]').forEach((element, index) => element.classList.toggle('is-active', index === step));
  }
  function renderRepair(progress) {
    qa('[data-example]').forEach((element, index) => {
      const amount = ramp(progress, .03 + index * .12, .19 + index * .12);
      opacity(element, .35 + .65 * amount);
      element.style.borderColor = amount > .9 ? '#aebbc0' : '';
    });
    repairPaths.forEach((path, index) => trace(path, ramp(progress, .28 + index * .06, .53 + index * .06)));
    const amount = ramp(progress, .58, .76);
    q('[data-repair-head]').style.background = amount > .1 ? '#dfe8ec' : '#edf1f2';
    text(q('#sequence-update-label'), amount > .9 ? 'Alignment head updated' : 'Use both kinds of examples');
  }
  function render() {
    const state = stateAt(position);
    const chapter = chapters[state.chapter];
    const phase = phases[state.phase];
    const sceneKey = `${state.chapter}:${state.phase}`;
    if (lastScene !== sceneKey) {
      lastScene = sceneKey;
      player.dataset.chapter = chapter.name;
      player.dataset.phase = state.chapter === 2 ? 'training' : phase.name;
      views.forEach(view => { view.hidden = view.dataset.view !== chapter.name; });
      equations.forEach(panel => { panel.hidden = panel.dataset.equation !== chapter.name; });
      chapterButtons.forEach((button, index) => {
        if (index === state.chapter) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      });
      q('.sequence-phase-bar').setAttribute('aria-label', state.chapter === 2 ? 'Jump to a repair step' : 'Jump to a procedure phase');
      phaseButtons.forEach((button, index) => {
        button.setAttribute('aria-pressed', String(index === state.phase));
        text(button, state.chapter === 2 ? ['Collect', 'Correct + retain', 'Update'][index] : ['Alignment', 'Entry', 'Insertion'][index]);
      });
      if (state.chapter === 0) {
        text(context, 'Same frozen model · adding the contract & decoder');
        text(title, phase.title); text(caption, phase.caption);
        text(q('#sequence-proposal-note'), phase.proposal); text(q('#sequence-permitted-note'), phase.permitted);
      } else if (state.chapter === 1) {
        text(context, 'Our full method · during execution');
        text(title, 'One policy. A head for each phase.');
        text(caption, 'The active head proposes; the regulator adjusts; explicit rules constrain the motion.');
      } else {
        text(context, 'Our full method · during training');
        text(title, 'Repair alignment. Keep the rest fixed.');
        text(caption, 'Correct failed alignment states while retaining predictions on successful states.');
      }
    }
    if (state.chapter === 0) renderNeedle(state.phase, state.progress);
    if (state.chapter === 1) renderPolicy(state.phase, state.progress);
    if (state.chapter === 2) renderRepair(state.progress);
    // Fade only at chapter boundaries; phase changes keep the same needle scene.
    const chapterProgress = (position - chapter.start) / (chapter.end - chapter.start);
    const fadeIn = state.chapter === 0 ? 1 : ramp(position - chapter.start, 0, .4);
    const fadeOut = state.chapter < 2 ? 1 - ramp(chapter.end - position, .4, 0) : 1;
    q('.sequence-stage').style.opacity = reduced.matches || !wantsPlay ? '1' : String(Math.min(fadeIn, fadeOut));
    chapterButtons.forEach((button, index) => button.style.setProperty('--chapter-progress', clamp((position - chapters[index].start) / (chapters[index].end - chapters[index].start)).toFixed(4)));
    timeline.value = position.toFixed(1);
    timeline.style.setProperty('--sequence-progress', `${position / 42 * 100}%`);
    const seconds = Math.floor(position);
    text(clock, `0:${String(seconds).padStart(2, '0')} / 0:42`);
    timeline.setAttribute('aria-valuetext', `${seconds} of 42 seconds; ${chapter.name === 'rules' ? 'Action rules' : chapter.name === 'policy' ? 'Full policy' : 'Local repair'}${state.chapter < 2 ? ', ' + phase.name : ''}`);
    player.dataset.position = position.toFixed(3);
    player.dataset.chapterProgress = chapterProgress.toFixed(4);
  }
  function controls() {
    text(playButton, wantsPlay ? 'Pause' : 'Play');
    playButton.setAttribute('aria-label', `${wantsPlay ? 'Pause' : 'Play'} method animation`);
    player.dataset.playing = String(wantsPlay);
  }
  function tick(time) {
    frame = 0;
    if (!wantsPlay || !visible || document.hidden) { lastTime = null; return; }
    if (lastTime !== null) position += Math.min(time - lastTime, 100) / 1000;
    lastTime = time;
    if (position >= 42) position %= 42;
    render();
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastTime = null;
    if (wantsPlay && visible && !document.hidden) frame = requestAnimationFrame(tick);
    controls();
  }
  function seek(value) { position = Math.max(0, Math.min(42, value)); render(); schedule(); }
  playButton.addEventListener('click', () => {
    wantsPlay = !wantsPlay;
    if (wantsPlay && position >= 42) position = 0;
    render(); schedule();
  });
  replayButton.addEventListener('click', () => { wantsPlay = true; seek(0); });
  timeline.addEventListener('input', () => { wantsPlay = false; seek(Number(timeline.value)); });
  chapterButtons.forEach((button, index) => {
    button.addEventListener('click', () => seek(chapters[index].start + (wantsPlay ? .5 : index === 0 ? 7 : index === 1 ? 2.5 : 8)));
    button.addEventListener('keydown', event => {
      const target = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }[event.key];
      if (target !== undefined) { event.preventDefault(); chapterButtons[target].click(); chapterButtons[target].focus({ preventScroll: true }); }
    });
  });
  phaseButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const chapter = stateAt(position).chapter;
      const start = chapter === 0 ? index * 8 : chapter === 1 ? 24 + index * 3 : 33 + index * 3;
      seek(start + (wantsPlay ? .5 : chapter === 0 ? 7 : 2.5));
    });
    button.addEventListener('keydown', event => {
      const indexTo = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }[event.key];
      if (indexTo !== undefined) { event.preventDefault(); phaseButtons[indexTo].click(); phaseButtons[indexTo].focus({ preventScroll: true }); }
    });
  });
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
    schedule();
  }, { threshold: [0, .15] }).observe(q('.sequence-screen'));
  reduced.addEventListener('change', event => {
    if (event.matches) { wantsPlay = false; seek(14.9); }
  });
  render(); controls();
})();
