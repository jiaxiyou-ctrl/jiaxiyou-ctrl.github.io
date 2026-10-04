(() => {
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const projects = [...document.querySelectorAll('.project-featured')];
 const running = new Map();
 let mostRecent = null;

 function stopAnimation(project) {
  running.get(project)?.finish(false);
 }

 function resizeMedia(project, selected, keepInView = true) {
  const current = running.get(project);
  if (current) {
   // Finish the current movement before acting on the latest click.
   current.pending = {selected, keepInView};
   return;
  }
  const figures = [...project.querySelectorAll('.project-media-item')];
  const intro = project.querySelector('.featured-intro');
  const overview = project.querySelector('.featured-overview');
  const elements = [...figures, intro];
  const before = new Map(elements.map(element => [element, element.getBoundingClientRect()]));
  const overviewBounds = overview.getBoundingClientRect();
  const previousHeight = project.getBoundingClientRect().height;
  const scrollStart = window.scrollY;
  const previousMinHeight = document.body.style.minHeight;
  // Keep measuring the smaller layout from shortening the page for one frame.
  document.body.style.minHeight = `${document.documentElement.scrollHeight}px`;
  const wasExpanded = selected && selected.getAttribute('aria-expanded') === 'true';
  const active = wasExpanded ? null : selected;
  const previousControl = project.querySelector('.media-expand-control[aria-expanded="true"]');

  for (const control of project.querySelectorAll('.media-expand-control')) {
   const expanded = control === active;
   control.setAttribute('aria-expanded', String(expanded));
   control.setAttribute('aria-label', `${expanded ? 'Restore' : 'Enlarge'} ${control.dataset.mediaName} ${expanded ? 'to overview size' : 'within this project'}`);
   control.closest('.project-media-item').classList.toggle('is-active', expanded);
  }
  project.classList.toggle('is-media-expanded', Boolean(active));
  if (active) mostRecent = project;
  else if (mostRecent === project) mostRecent = null;

  const after = new Map(elements.map(element => [element, element.getBoundingClientRect()]));
  const nextHeight = project.getBoundingClientRect().height;
  let scrollTarget = scrollStart;
  const focusControl = active || previousControl;
  if (focusControl && keepInView) {
   const mediaBounds = after.get(focusControl.closest('.project-media-item'));
   const top = mediaBounds.top;
   const header = document.querySelector('.masthead').getBoundingClientRect().bottom;
   if (top < header + 12 || top > window.innerHeight - 80 || (active && mediaBounds.bottom > window.innerHeight - 96)) {
    scrollTarget = Math.max(0, scrollStart + top - Math.max(header + 24, 105));
   }
  }

  if (motion.matches || typeof project.animate !== 'function') {
   document.body.style.minHeight = previousMinHeight;
   if (scrollTarget !== scrollStart) window.scrollTo({top:scrollTarget, behavior:'instant'});
   return;
  }

  const duration = 580;
  const timing = {duration, easing:'linear', fill:'both'};
  const startText = before.get(intro), endText = after.get(intro);
  const reflows = Math.abs(startText.width - endText.width) > 1;
  let snapshot = null;
  if (reflows) {
   // Preserve the old line breaks until the new text layout has room to appear.
   snapshot = intro.cloneNode(true);
   snapshot.classList.add('media-copy-snapshot');
   snapshot.setAttribute('aria-hidden', 'true');
   snapshot.inert = true;
   snapshot.removeAttribute('id');
   snapshot.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
   Object.assign(snapshot.style, {
    left:`${startText.left - overviewBounds.left}px`,
    top:`${startText.top - overviewBounds.top}px`,
    width:`${startText.width}px`, maxWidth:'none', margin:'0'
   });
   overview.append(snapshot);
  }

  project.classList.add('is-media-animating');
  const animations = figures.map(element => {
   const start = before.get(element), end = after.get(element);
   return element.animate([
    {transform:`translate(${start.left-end.left}px,${start.top-end.top}px) scale(${start.width/end.width},${start.height/end.height})`, transformOrigin:'top left'},
    {transform:'translate(0,0) scale(1)', transformOrigin:'top left'}
   ], timing);
  });
  const textTranslation = `translate(${startText.left-endText.left}px,${startText.top-endText.top}px)`;
  animations.push(intro.animate(reflows ? [
   {transform:textTranslation, opacity:0},
   {opacity:0, offset:.15},
   {opacity:1, offset:.75},
   {transform:'translate(0,0)', opacity:1}
  ] : [
   {transform:textTranslation}, {transform:'translate(0,0)'}
  ], timing));
  if (snapshot) animations.push(snapshot.animate([
   {transform:'translate(0,0)', opacity:1},
   {opacity:0, offset:.6},
   {transform:`translate(${endText.left-startText.left}px,${endText.top-startText.top}px)`, opacity:0}
  ], timing));
  animations.push(project.animate([{height:`${previousHeight}px`},{height:`${nextHeight}px`}], timing));
  animations.forEach(animation => {animation.pause(); animation.currentTime = 0;});
  document.body.style.minHeight = previousMinHeight;

  const state = {frame:0, pending:null, allowScroll:true, finish:null};
  state.finish = (followPending = true) => {
   cancelAnimationFrame(state.frame);
   animations.forEach(animation => animation.cancel());
   snapshot?.remove();
   project.classList.remove('is-media-animating');
   running.delete(project);
   if (followPending && state.pending) {
    const pending = state.pending;
    resizeMedia(project, pending.selected, pending.keepInView);
   }
  };
  running.forEach(other => {other.allowScroll = false;});
  running.set(project, state);
  const started = performance.now();
  function tick(now) {
   const time = Math.min(1, Math.max(0, (now - started) / duration));
   // One gently accelerating clock drives media, text, page height and scrolling.
   const progress = time * time * time * (time * (time * 6 - 15) + 10);
   animations.forEach(animation => {animation.currentTime = progress * duration;});
   if (state.allowScroll && scrollTarget !== scrollStart) {
    window.scrollTo({top:scrollStart + (scrollTarget-scrollStart) * progress, behavior:'instant'});
   }
   if (time < 1) state.frame = requestAnimationFrame(tick);
   else state.finish();
  }
  state.frame = requestAnimationFrame(tick);
 }

 for (const project of projects) {
  const controls = [...project.querySelectorAll('.media-expand-control')];
  project.classList.toggle('has-single-media', controls.length === 1);
  for (const control of controls) {
   let pointerStart = null, dragged = false;
   control.addEventListener('pointerdown', event => {pointerStart = {x:event.clientX,y:event.clientY}; dragged = false;});
   control.addEventListener('pointermove', event => {
    if (pointerStart && Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>8) dragged = true;
   });
   control.addEventListener('pointerup', () => {pointerStart = null;});
   control.addEventListener('pointercancel', () => {pointerStart = null; dragged = true;});
   control.addEventListener('click', event => {
    if (event.detail !== 0 && dragged) {dragged = false; return;}
    resizeMedia(project, control);
   });
  }
 }

 document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
  const focused = document.activeElement.closest('.project-featured.is-media-expanded');
  const project = focused || mostRecent || projects.find(item => item.classList.contains('is-media-expanded'));
  if (!project) return;
  event.preventDefault();
  const control = project.querySelector('.media-expand-control[aria-expanded="true"]');
  resizeMedia(project, null);
  control?.focus({preventScroll:true});
 });
 window.addEventListener('resize', () => projects.forEach(stopAnimation));
 motion.addEventListener('change', () => projects.forEach(stopAnimation));
 const yieldScrolling = () => running.forEach(state => {state.allowScroll = false;});
 window.addEventListener('wheel', yieldScrolling, {passive:true});
 window.addEventListener('touchmove', yieldScrolling, {passive:true});
 document.addEventListener('keydown', event => {
  if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) yieldScrolling();
 });
})();
