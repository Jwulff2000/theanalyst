/* Jerome Wulff portfolio: navigation dropdowns, scroll reveal, contact form */
(function () {
  'use strict';

  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.menu-toggle');
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));

  function closeAll(except) {
    items.forEach(function (item) {
      if (item !== except) {
        item.classList.remove('open');
        item.querySelector('.nav-btn').setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Dropdown toggles
  items.forEach(function (item) {
    var btn = item.querySelector('.nav-btn');
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('open');
      closeAll(item);
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    // Choosing a link closes menus (and the mobile panel)
    item.querySelectorAll('.dropdown a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeAll();
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Click outside / Escape closes
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Light / dark theme toggle
  var root = document.documentElement;
  var themeBtn = document.querySelector('.theme-toggle');
  function syncThemeLabel() {
    var light = root.getAttribute('data-theme') === 'light';
    themeBtn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeBtn.title = light ? 'Switch to dark mode' : 'Switch to light mode';
  }
  syncThemeLabel();
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeLabel();
  });

  // Mobile menu
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Highlight the current section in the top nav
  var sections = items.map(function (item) {
    return document.getElementById(item.querySelector('.nav-btn').dataset.section);
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          items.forEach(function (item) {
            var btn = item.querySelector('.nav-btn');
            btn.classList.toggle('active', btn.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });

    // Scroll reveal
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Contact form (Formspree). Falls back to a normal form post if fetch fails.
  var form = document.getElementById('contact-form-el');
  if (form && window.fetch) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = 'Sending...';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thank you. Your message has been sent.';
        } else {
          throw new Error('Request failed');
        }
      }).catch(function () {
        status.className = 'form-status err';
        status.innerHTML = 'Sorry, that did not send. Please email <a href="mailto:jwulff2000@mail.com">jwulff2000@mail.com</a>.';
      });
    });
  }
})();
