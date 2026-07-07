(function () {
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.site-header');

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      header.classList.toggle('nav-open', !isOpen);
    });

    // Close the menu when a nav link is chosen (matters for same-page anchors).
    header.querySelectorAll('.site-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        header.classList.remove('nav-open');
      });
    });
  }
})();

(function () {
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var revealEls = document.querySelectorAll('.reveal');
  var STAGGER_MS = 110;
  var MAX_DELAY_MS = 440;

  function showEverythingNow() {
    revealEls.forEach(function (el) {
      el.style.transitionDelay = '0ms';
      el.classList.add('is-visible');
    });
  }

  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    showEverythingNow();
    return;
  }

  // If the user turns on reduced motion mid-visit, stop animating immediately.
  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', function (e) {
      if (e.matches) showEverythingNow();
    });
  }

  // Elements inside a [data-stagger] container arrive one after another;
  // everything else animates as soon as it enters the viewport.
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var children = group.querySelectorAll('.reveal');
    children.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * STAGGER_MS, MAX_DELAY_MS) + 'ms';
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
