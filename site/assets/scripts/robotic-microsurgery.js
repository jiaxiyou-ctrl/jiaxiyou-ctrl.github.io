(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = [...document.querySelectorAll('.phase-tabs [role="tab"]')];
  const taskFigure = document.querySelector('.task-figure');
  function selectPhase(tab, focus = false) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
    taskFigure.dataset.phase = tab.dataset.phase;
    if (focus) tab.focus();
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => selectPhase(tab));
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab);
      const targets = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (event.key in targets) { event.preventDefault(); selectPhase(tabs[targets[event.key]], true); }
    });
  }

  const navLinks = [...document.querySelectorAll('.project-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let framePending = false;
  function updateNavigation() {
    framePending = false;
    const offset = document.querySelector('.project-header').getBoundingClientRect().height + 80;
    let current = -1;
    sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= offset) current = index; });
    navLinks.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateNavigation); } }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  window.addEventListener('load', updateNavigation);
  updateNavigation();

  const video = document.querySelector('#simulation-video');
  if (video && !reduceMotion.matches) video.play().catch(() => {});
  reduceMotion.addEventListener('change', event => { if (event.matches) video.pause(); });

  const dialog = document.querySelector('#figure-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const dialogBody = document.querySelector('.dialog-body');
  const zoomButton = document.querySelector('#figure-size');
  let returnFocus = null;
  function setFigureSize(native) {
    dialogBody.classList.toggle('is-native', native);
    zoomButton.setAttribute('aria-pressed', String(native));
    zoomButton.textContent = native ? 'Fit to window' : 'Actual size';
  }
  for (const link of document.querySelectorAll('[data-zoom-title]')) {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      returnFocus = link;
      document.querySelector('#figure-title').textContent = link.dataset.zoomTitle;
      dialogImage.src = link.href;
      dialogImage.alt = link.querySelector('img')?.alt || link.dataset.zoomTitle;
      document.querySelector('#figure-original').href = link.href;
      setFigureSize(false);
      dialog.showModal();
      dialogBody.scrollTop = dialogBody.scrollLeft = 0;
      document.body.classList.add('has-dialog');
    });
  }
  zoomButton.addEventListener('click', () => setFigureSize(zoomButton.getAttribute('aria-pressed') !== 'true'));
  document.querySelector('#figure-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-dialog');
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  });
})();
