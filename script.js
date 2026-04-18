const menuBtn = document.getElementById('menuBtn');
const siteNav = document.getElementById('siteNav');

if (menuBtn && siteNav) {
  const navLinks = siteNav.querySelectorAll('a');

  menuBtn.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealTargets = document.querySelectorAll('.reveal');
const bars = document.querySelectorAll('.bar-track span');
const counters = document.querySelectorAll('.counter');

const animateCounter = (element, targetValue) => {
  const duration = 1100;
  const startTime = performance.now();
  const suffix = element.dataset.suffix || '%';

  const update = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(targetValue * eased);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const onReveal = (entry, observer) => {
  if (!entry.isIntersecting) {
    return;
  }

  entry.target.classList.add('in-view');

  if (entry.target.classList.contains('skill-map')) {
    bars.forEach((bar) => {
      const fill = bar.dataset.fill;
      if (fill) {
        bar.style.width = `${fill}%`;
      }
    });

    counters.forEach((counter) => {
      const countTo = Number(counter.dataset.counter);
      if (countTo) {
        animateCounter(counter, countTo);
      }
    });
  }

  observer.unobserve(entry.target);
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => onReveal(entry, observer));
    },
    {
      threshold: 0.14,
    },
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('in-view'));
  bars.forEach((bar) => {
    const fill = bar.dataset.fill;
    if (fill) {
      bar.style.width = `${fill}%`;
    }
  });
  counters.forEach((counter) => {
    const countTo = counter.dataset.counter;
    const suffix = counter.dataset.suffix || '%';
    if (countTo) {
      counter.textContent = `${countTo}${suffix}`;
    }
  });
}
