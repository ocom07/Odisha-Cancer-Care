/* =====================================================================
   donation.js — builds the WhatsApp click-to-chat link.
   No payment is processed. No donor data is collected or stored.
   ===================================================================== */
(function () {
  'use strict';
  var btn = document.getElementById('donate-whatsapp');
  if (!btn) return;
  var cfg = window.SITE_CONFIG || {};
  var H = window.SITE_HELPERS || {};
  var out = document.getElementById('donate-notice');
  var ref = document.getElementById('donate-ref');

  // Optional case reference — only for cases explicitly marked verified:true.
  var caseId = new URLSearchParams(location.search).get('case');
  var c = (window.SITE_CASES || []).filter(function (x) { return x.id === caseId && x.verified; })[0];
  if (c && ref) { ref.textContent = 'Regarding: ' + c.title; ref.hidden = false; }

  function message() {
    var m = cfg.whatsappMessage || '';
    return c ? m + ' (Reference: ' + c.title + ')' : m;
  }
  function url() { return 'https://wa.me/' + cfg.whatsappNumber + '?text=' + encodeURIComponent(message()); }
  function show(kind, html) { out.className = 'notice notice--' + kind; out.innerHTML = html; out.hidden = false; }

  btn.addEventListener('click', function () {
    if (!H.isValidWhatsApp || !H.isValidWhatsApp(cfg.whatsappNumber)) {
      show('error', '<p><strong>WhatsApp is not configured yet.</strong> The organization’s official WhatsApp number has not been added to this website, so we cannot open a chat. Please use the contact details in the page footer when they are available.</p>');
      return;
    }
    var link = url();
    var w = window.open(link, '_blank');
    if (w) { w.opener = null; }
    var fallback = '<p><strong>If WhatsApp did not open</strong>, use this link: <a href="' + link + '" target="_blank" rel="noopener">open WhatsApp chat</a>, or ' +
      '<button type="button" class="btn btn-outline btn-sm" id="copy-msg">copy the message</button> and send it to the official number yourself.</p>';
    show('info', '<p><strong>Next step:</strong> in WhatsApp, tap <em>Send</em>. Nothing has been donated yet — a donation is not complete until you follow the official payment instructions sent to you and the organization confirms it.</p>' + fallback);
    var cp = document.getElementById('copy-msg');
    if (cp) cp.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message()).then(function () { cp.textContent = 'Copied'; }, function () { cp.textContent = 'Copy failed'; });
      } else { cp.textContent = 'Copy not supported'; }
    });
  });
})();