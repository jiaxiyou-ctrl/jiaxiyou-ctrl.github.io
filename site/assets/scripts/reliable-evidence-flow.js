(() => {
  // One 1.5-second causal sequence, after the reader reaches the drawing.
  const flow = document.querySelector('.evidence-flow');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const readingGroups = [];
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const group = entry.target;
        if (entry.boundingClientRect.bottom <= 90 || document.hidden) {
          group.dataset.enter = 'complete'; observer.unobserve(group);
        } else if (entry.isIntersecting && entry.intersectionRatio >= Number(group.dataset.enterThreshold)) {
          group.dataset.enter = 'running'; observer.unobserve(group);
        }
      });
    }, { threshold: [0, .2, .65], rootMargin: '-86px 0px -25% 0px' });
    document.querySelectorAll('.rag-hero, .research-section > .section-heading, .study-heading').forEach(group => {
      const hero = group.classList.contains('rag-hero');
      const items = hero
        ? [...group.querySelectorAll('.eyebrow, .hero-title-line, .hero-summary, .affiliation, .hero-links')]
        : [...group.children];
      group.classList.add('reading-motion');
      group.dataset.enter = 'ready';
      group.dataset.enterThreshold = hero ? '.2' : '.65';
      items.forEach((item, index) => {
        item.dataset.enterItem = '';
        item.style.setProperty('--enter-at', `${index * 70}ms`);
      });
      const last = items[items.length - 1];
      last.addEventListener('animationend', event => {
        if (event.target === last) group.dataset.enter = 'complete';
      }, { once: true });
      readingGroups.push(group);
      observer.observe(group);
    });
    motion.addEventListener('change', event => {
      if (event.matches) {
        observer.disconnect();
        readingGroups.forEach(group => { group.dataset.enter = 'complete'; });
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) readingGroups.forEach(group => {
        if (group.dataset.enter === 'running') group.dataset.enter = 'complete';
      });
    });
  }

  if (flow && !motion.matches && 'IntersectionObserver' in window) {
    flow.dataset.reveal = 'ready';
    let entered = false;
    let eligible = false;
    let entryTimer = 0;
    const cancelEntry = () => { clearTimeout(entryTimer); entryTimer = 0; };
    const finish = () => { flow.dataset.reveal = 'complete'; flow.dataset.flowPhase = 'complete'; };
    const cuePhases = {
      question: 'question', 'source-documents': 'retrieve', 'candidate-e1': 'select',
      'answer-generator': 'generate', 'true-verification': 'verify'
    };
    flow.addEventListener('animationstart', event => {
      const phase = cuePhases[event.target.dataset.flowCue];
      if (phase) flow.dataset.flowPhase = phase;
    });
    const startSequence = () => {
      entryTimer = 0;
      if (!eligible || entered || document.hidden) return;
      // Let the section title settle before the question starts the pipeline.
      if (document.querySelector('#framework .section-heading').dataset.enter === 'running') {
        entryTimer = setTimeout(startSequence, 80); return;
      }
      entered = true;
      flow.dataset.reveal = 'running';
      observer.disconnect();
      removeEventListener('scroll', armEntry);
    };
    const armEntry = () => {
      cancelEntry();
      if (!eligible || entered || document.hidden) return;
      entryTimer = setTimeout(startSequence, 180);
    };
    const observer = new IntersectionObserver(entries => {
      eligible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .8);
      // A restored scroll position or a deep link may skip the first module.
      // Keep the remainder readable; returning to the drawing can still trigger its first entrance.
      if (!entered && entries.some(entry => entry.boundingClientRect.bottom <= 104)) finish();
      armEntry();
    }, { threshold: [0, .8], rootMargin: '-104px 0px -8% 0px' });
    // Observe the actual graphic, not the question/header that arrives earlier.
    observer.observe(flow.querySelector('.flow-drawing'));
    addEventListener('scroll', armEntry, { passive: true });
    flow.querySelector('[data-flow-cue="unverified-status"]').addEventListener('animationend', finish, { once: true });
    motion.addEventListener('change', event => {
      if (event.matches) {
        entered = true; cancelEntry(); observer.disconnect();
        removeEventListener('scroll', armEntry); finish();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelEntry(); if (entered) finish(); }
      else armEntry();
    });
    addEventListener('pagehide', () => { cancelEntry(); if (entered) finish(); });
    addEventListener('pageshow', armEntry);
  }

  // Each plot grows once after it is in the reading area, then stays complete.
  const charts = [...document.querySelectorAll('[data-chart]')];
  if (!motion.matches && 'IntersectionObserver' in window) {
    const timers = new Map();
    const settle = chart => {
      clearTimeout(timers.get(chart)); timers.delete(chart);
      chart.dataset.chartState = 'complete';
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const chart = entry.target;
        if (entry.boundingClientRect.bottom < 100) {
          settle(chart); observer.unobserve(chart); return;
        }
        clearTimeout(timers.get(chart)); timers.delete(chart);
        if (entry.isIntersecting && entry.intersectionRatio >= .6 && !document.hidden) {
          timers.set(chart, setTimeout(() => {
            chart.dataset.chartState = 'running';
            observer.unobserve(chart); timers.delete(chart);
          }, 180));
        }
      });
    }, { threshold:[0,.6], rootMargin:'-100px 0px -12% 0px' });
    charts.forEach(chart => {
      chart.dataset.chartState = 'ready'; observer.observe(chart);
      const last = [...chart.querySelectorAll('.chart-detail')].at(-1);
      last.addEventListener('animationend', event => {
        if (event.target === last) settle(chart);
      }, {once:true});
      chart.addEventListener('focusin', () => { settle(chart); observer.unobserve(chart); });
    });
    motion.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); charts.forEach(settle); }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) charts.forEach(chart => {
        if (chart.dataset.chartState === 'running' || timers.has(chart)) {
          settle(chart); observer.unobserve(chart);
        }
      });
    });
  }

  // Hover, keyboard focus and touch all expose the same original values.
  const tip = document.createElement('div');
  tip.className = 'chart-tooltip'; tip.hidden = true;
  tip.setAttribute('role', 'tooltip');
  const tipValue = document.createElement('strong');
  const tipName = document.createElement('span'); tipName.className = 'tip-name';
  const tipDetail = document.createElement('span'); tipDetail.className = 'tip-detail';
  tip.append(tipValue, tipName, tipDetail); document.body.append(tip);
  let activeMark = null;
  const hideTip = () => { tip.hidden = true; activeMark = null; };
  function showTip(mark, point) {
    activeMark = mark;
    tipValue.textContent = mark.dataset.tipValue;
    tipName.textContent = mark.dataset.tipTitle;
    tipDetail.textContent = mark.dataset.tipDetail;
    tip.hidden = false;
    const rect = mark.getBoundingClientRect();
    const x = point ? point.clientX : rect.right - 20;
    const y = point ? point.clientY : rect.top;
    tip.style.left = `${Math.max(12, Math.min(x + 12, innerWidth - tip.offsetWidth - 12))}px`;
    tip.style.top = `${Math.max(90, Math.min(y - tip.offsetHeight - 12, innerHeight - tip.offsetHeight - 12))}px`;
  }
  document.querySelectorAll('.chart-mark').forEach(mark => {
    mark.addEventListener('pointerenter', event => { if(event.pointerType === 'mouse') showTip(mark,event); });
    mark.addEventListener('pointermove', event => { if(event.pointerType === 'mouse') showTip(mark,event); });
    mark.addEventListener('pointerleave', hideTip);
    mark.addEventListener('focus', () => showTip(mark));
    mark.addEventListener('blur', hideTip);
    mark.addEventListener('click', event => showTip(mark,event));
  });
  document.addEventListener('pointerdown', event => {
    if (activeMark && !activeMark.contains(event.target)) hideTip();
  });
  document.addEventListener('keydown', event => { if(event.key === 'Escape') hideTip(); });
  addEventListener('scroll', hideTip, {passive:true});

  const links=[...document.querySelectorAll('.project-nav a')];
  const sections=links.map(link=>document.querySelector(link.getAttribute('href')));
  let pending=false;
  function updateNav(){pending=false;const offset=document.querySelector('.project-header').getBoundingClientRect().height+85;let index=-1;sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=offset)index=i;});links.forEach((link,i)=>{if(i===index)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateNav);}},{passive:true});
  addEventListener('resize',updateNav);addEventListener('load',updateNav);updateNav();
})();
