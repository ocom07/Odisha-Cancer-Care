/* =====================================================================
   main.js — shared behaviour. Every feature checks that its elements
   exist, so pages without a feature never throw errors.
   ===================================================================== */
(function () {
  'use strict';
  var cfg = window.SITE_CONFIG || {};
  var H = window.SITE_HELPERS || { isValidWhatsApp: function () { return false; } };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var btn = $('.nav-toggle'), nav = $('#primary-nav');
    if (!btn || !nav) return;
    function set(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    set(false);
    btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) set(false);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    var h = $('.site-header'); if (!h) return;
    var on = function () { h.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', on, { passive: true }); on();
  }

  /* ---------- Fill contact details from site-config.js ---------- */
  function initConfig() {
    var s = cfg.social || {};
    var wa = H.isValidWhatsApp(cfg.whatsappNumber) ? 'https://wa.me/' + cfg.whatsappNumber : '';
    var map = {
      phone: { text: cfg.phoneDisplay, href: cfg.phoneTel ? 'tel:' + cfg.phoneTel : '' },
      email: { text: cfg.email, href: cfg.email ? 'mailto:' + cfg.email : '' },
      whatsapp: { text: cfg.whatsappDisplay, href: wa },
      address: { text: cfg.address },
      registration: { text: cfg.registration },
      facebook: { href: s.facebook }, instagram: { href: s.instagram }, youtube: { href: s.youtube }
    };
    $$('[data-config]').forEach(function (el) {
      var m = map[el.dataset.config]; if (!m) return;
      var did = false;
      if (m.text) { el.textContent = m.text; did = true; }
      if (m.href) {
        el.setAttribute('href', m.href);
        if (/^https?:/.test(m.href) && el.dataset.config !== 'whatsapp') { el.target = '_blank'; el.rel = 'noopener'; }
        if (el.dataset.label) el.textContent = el.dataset.label;
        did = true;
      }
      if (did) el.classList.remove('ph');
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Hero carousel ---------- */
  function initCarousel() {
    var root = $('[data-carousel]'); if (!root) return;
    var slides = $$('.slide', root); if (slides.length < 2) return;
    var live = $('.slides', root), dotsWrap = $('.carousel-dots', root);
    var prev = $('[data-prev]', root), next = $('[data-next]', root), tog = $('[data-toggle]', root);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var i = 0, timer = null, userPaused = reduce.matches;

    var dots = slides.map(function (_, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (n + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(n); });
      dotsWrap.appendChild(b); return b;
    });
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var a = k === i;
        s.classList.toggle('is-active', a);
        s.setAttribute('aria-hidden', String(!a));
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }
    function start() { stop(); if (!userPaused) timer = setInterval(function () { go(i + 1); }, 7000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function label() {
      tog.textContent = userPaused ? 'Play' : 'Pause';
      tog.setAttribute('aria-label', userPaused ? 'Start slide rotation' : 'Pause slide rotation');
      live.setAttribute('aria-live', userPaused ? 'polite' : 'off');
    }
    prev.addEventListener('click', function () { go(i - 1); });
    next.addEventListener('click', function () { go(i + 1); });
    tog.addEventListener('click', function () { userPaused = !userPaused; label(); start(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
    go(0); label(); start();
  }

  /* ---------- Case cards (rendered from SITE_CASES) ---------- */
  var STATUS = { urgent: 'Urgent Support', ongoing: 'Ongoing Assistance', completed: 'Completed Case' };
  var fmt = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  function money(c) {
    if (typeof c.goal === 'number' && c.goal > 0 && typeof c.raised === 'number') {
      var pct = Math.min(100, Math.round(c.raised / c.goal * 100));
      var rem = Math.max(c.goal - c.raised, 0);
      return '<div class="progress" role="progressbar" aria-label="Amount raised as a share of the goal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
        '<dl class="money"><div><dt>Goal</dt><dd>' + fmt(c.goal) + '</dd></div><div><dt>Raised</dt><dd>' + fmt(c.raised) + '</dd></div><div><dt>Remaining</dt><dd>' + fmt(rem) + '</dd></div></dl>';
    }
    return '<p class="meta">Funding figures have not been published for this case.</p>';
  }
  function badges(c) {
    return '<div class="badge-row"><span class="badge badge--' + esc(c.category) + '">' + esc(STATUS[c.category]) + '</span>' +
      (c.demo ? '<span class="badge badge--demo">Sample data</span>' : '') + '</div>';
  }
  function caseCard(c) {
    return '<article class="card case-card" data-category="' + esc(c.category) + '">' +
      '<div class="card-media"><img src="assets/images/placeholder.svg" alt="Placeholder: no approved photograph is published for this case" width="400" height="300" loading="lazy"></div>' +
      '<div class="card-body">' + badges(c) + '<h3>' + esc(c.title) + '</h3>' +
      '<p class="meta">' + esc(c.identifier) + '</p><p>' + esc(c.summary) + '</p>' +
      '<p><strong>Requirement:</strong> ' + esc(c.requirement) + '</p>' + money(c) +
      '<p class="meta">Last updated: ' + esc(c.updated) + '</p>' +
      '<div class="card-actions"><a class="btn btn-outline btn-sm" href="case-details.html?id=' + encodeURIComponent(c.id) + '">View Case Details</a>' +
      '<a class="btn btn-accent btn-sm" href="donate.html' + (c.verified ? '?case=' + encodeURIComponent(c.id) : '') + '">Donate Now</a></div></div></article>';
  }
  function initCases() {
    var cases = window.SITE_CASES || [];
    $$('[data-render-cases]').forEach(function (box) {
      var limit = parseInt(box.dataset.limit, 10) || cases.length;
      box.innerHTML = cases.slice(0, limit).map(caseCard).join('');
    });
    var d = $('#case-detail'); if (!d) return;
    var id = new URLSearchParams(location.search).get('id');
    var c = cases.filter(function (x) { return x.id === id; })[0];
    if (!c) {
      d.innerHTML = '<div class="notice notice--error"><p>We could not find that case. Please choose a case from the list.</p></div>' +
        '<ul>' + cases.map(function (x) { return '<li><a href="case-details.html?id=' + encodeURIComponent(x.id) + '">' + esc(x.title) + '</a></li>'; }).join('') + '</ul>';
      return;
    }
    document.title = c.title + ' | Odisha Cancer Care';
    var h1 = $('h1'); if (h1) h1.textContent = c.title;
    d.innerHTML = (c.demo ? '<div class="notice"><p><strong>Sample data.</strong> This is a demonstration case. It does not describe a real patient and no real donation is connected to it.</p></div>' : '') +
      badges(c) + '<p class="meta">' + esc(c.identifier) + ' · Last updated: ' + esc(c.updated) + '</p>' + money(c) +
      '<h2>Verified story</h2>' + c.story.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      '<h2>Purpose of fundraising</h2><p>' + esc(c.purpose) + '</p>' +
      '<h2>Current requirement</h2><p>' + esc(c.requirement) + '</p>' +
      '<h2>Updates</h2><ul>' + c.updates.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul>' +
      '<h2>How to donate</h2><p>Donations begin by contacting Odisha Cancer Care on WhatsApp to request the official payment details. This website does not process payments.</p>' +
      '<div class="btn-row"><a class="btn btn-accent btn-lg" href="donate.html' + (c.verified ? '?case=' + encodeURIComponent(c.id) : '') + '">Donate Now</a>' +
      '<a class="btn btn-outline btn-lg" href="urgent-cases.html">Back to all cases</a></div>';
  }

  /* ---------- Category filters (cases, events, gallery) ---------- */
  function initFilters() {
    $$('[data-filter-scope]').forEach(function (group) {
      var scope = $(group.getAttribute('data-filter-scope')); if (!scope) return;
      var btns = $$('button[data-filter]', group);
      function apply(f) {
        var n = 0;
        $$('[data-category]', scope).forEach(function (it) {
          var show = f === 'all' || it.dataset.category.split(' ').indexOf(f) > -1;
          it.hidden = !show; if (show) n++;
        });
        var e = $('.empty-msg', scope); if (e) e.hidden = n > 0;
        btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === f)); });
      }
      btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter); }); });
      apply('all');
    });
  }

  /* ---------- Gallery lightbox (native <dialog>) ---------- */
  function initLightbox() {
    var items = $$('.gallery-item'); if (!items.length) return;
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox'; dlg.setAttribute('aria-label', 'Image viewer');
    dlg.innerHTML = '<div class="lb-body"><button type="button" class="lb-btn lb-close" aria-label="Close image viewer">×</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Previous image">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Next image">›</button></div>';
    document.body.appendChild(dlg);
    var img = $('img', dlg), cap = $('figcaption', dlg), list = [], idx = 0, opener = null;
    function show(n) {
      idx = (n + list.length) % list.length;
      var it = list[idx], t = $('img', it);
      img.src = it.dataset.full || t.src; img.alt = t.alt;
      cap.textContent = it.dataset.caption || t.alt;
    }
    items.forEach(function (it) {
      it.addEventListener('click', function () {
        list = items.filter(function (x) { return !x.hidden; });
        opener = it; show(list.indexOf(it));
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      });
    });
    $('.lb-prev', dlg).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', dlg).addEventListener('click', function () { show(idx + 1); });
    $('.lb-close', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
  }

  /* ---------- Contact form: validation only, NO false success message ---------- */
  function initContactForm() {
    var form = $('#contact-form'); if (!form) return;
    var status = $('#form-status');
    function setErr(input, msg) {
      var err = $('#' + input.id + '-err');
      if (msg) { input.setAttribute('aria-invalid', 'true'); err.textContent = msg; err.hidden = false; }
      else { input.removeAttribute('aria-invalid'); err.textContent = ''; err.hidden = true; }
      return !msg;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#cf-name'), m = $('#cf-email'), t = $('#cf-message');
      var ok = [
        setErr(n, n.value.trim().length < 2 ? 'Please enter your name.' : ''),
        setErr(m, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim()) ? 'Please enter a valid email address.' : ''),
        setErr(t, t.value.trim().length < 10 ? 'Please write a message of at least 10 characters.' : '')
      ];
      if (ok.indexOf(false) > -1) {
        status.innerHTML = '<div class="notice notice--error"><p>Please correct the highlighted fields.</p></div>';
        var first = $('[aria-invalid="true"]', form); if (first) first.focus();
        return;
      }
/*       var msg = '<div class="notice notice--info"><p><strong>Nothing has been sent.</strong> This form is a frontend demonstration: no form-submission service is configured yet.</p>';
 */      
if (!cfg.email) {
  status.innerHTML =
    '<div class="notice notice--error"><p>No official email address is configured.</p></div>';
  return;
}

var recipient = cfg.email;
var subject = 'Contact Us Message - Odisha Cancer Care';

var body =
  'Hello Odisha Cancer Care,\n\n' +
  t.value.trim() +
  '\n\nRegards,\n' +
  n.value.trim() +
  '\nEmail: ' +
  m.value.trim();

var gmailUrl =
  'https://mail.google.com/mail/?view=cm&fs=1' +
  '&to=' + encodeURIComponent(recipient) +
  '&su=' + encodeURIComponent(subject) +
  '&body=' + encodeURIComponent(body);

status.innerHTML =
  '<div class="notice notice--info"><p>' +
  '<strong>Your message is ready.</strong> ' +
  'Gmail will open with your message prepared. Review it and click Send.' +
  '</p></div>';

window.open(gmailUrl, '_blank', 'noopener,noreferrer');

      /* if (cfg.email) {
        var body = 'Name: ' + n.value.trim() + '\nEmail: ' + m.value.trim() + '\n\n' + t.value.trim();
        msg += '<p><a class="btn btn-primary" href="mailto:' + encodeURIComponent(cfg.email).replace('%40', '@') +
          '?subject=' + encodeURIComponent('Message from website') + '&body=' + encodeURIComponent(body) +
          '">Open my email app with this message</a></p>';
      } else {
        msg += '<p>No official email address is configured yet, so there is nowhere to send this message.</p>';
      }
      status.innerHTML = msg + '</div>'; */
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'to-top'; b.hidden = true;
    b.setAttribute('aria-label', 'Back to top'); b.textContent = '↑';
    document.body.appendChild(b);
    window.addEventListener('scroll', function () { b.hidden = window.scrollY < 600; }, { passive: true });
    b.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var s = $('#main'); if (s) { s.setAttribute('tabindex', '-1'); s.focus({ preventScroll: true }); }
    });
  }

  function init() {
    initNav(); initHeader(); initConfig(); initCarousel();
    initCases(); initFilters(); initLightbox(); initContactForm(); initToTop();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();