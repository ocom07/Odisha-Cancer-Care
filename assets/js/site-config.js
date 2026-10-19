/* =====================================================================
   SITE CONFIGURATION — the one file maintainers edit for contact details.
   Loaded WITHOUT defer so the "js" class is set before first paint.
   ===================================================================== */
document.documentElement.classList.add('js');

window.SITE_CONFIG = {
  orgName: 'Odisha Cancer Care',

  // WhatsApp number: international format, DIGITS ONLY (no +, spaces or hyphens).
  // Example format: 919876543210  (country code 91 + 10-digit number)
  // Until a real number is entered, the donate button shows a "not configured" message.
  whatsappNumber: '+918917229243',
  whatsappDisplay: '+918917229243',            // e.g. '+91 98765 43210' (shown in footer/contact)

  whatsappMessage:
    'Namaste Odisha Cancer Care. I would like to make a donation. ' +
    'Please share the official payment details and explain how I can receive ' +
    'an acknowledgement or receipt. Thank you.',

  // Leave '' until verified. Empty values keep the visible placeholder text.
  phoneDisplay: '+91 891 722 9243',               // e.g. '+91 674 000 0000'
  phoneTel: '918917229243',                   // e.g. '+916740000000'
  email: 'odishacancercare.trust@gmail.com',                      // e.g. 'info@yourdomain.org'
  address: 'Flat no-112/3rd floor, Nirmala Enclave, KALINGANAGAR, BHUBANESWAR(M.C) PO- DUMUDUMA, DIST - KHORDHA, ODISHA PIN - 751019, ',
registration: '',               // only when verified, e.g. registration / charity details
  social: { facebook: '', instagram: '', youtube: '' }   // full https:// URLs
};

window.SITE_HELPERS = {
  // International format, digits only, 10–15 digits, no leading zero.
  isValidWhatsApp: function (n) { return /^[1-9]\d{9,14}$/.test(String(n || '')); }
};

/* =====================================================================
   CASE RECORDS (static content). Every case below is SAMPLE DATA.
   Real cases: set demo:false, verified:true ONLY with documentation and
   written consent. goal / raised: numbers in INR, or null if unknown.
   category: 'urgent' | 'ongoing' | 'completed'
   ===================================================================== */
window.SITE_CASES = [
  {
    id: 'demo-urgent', category: 'urgent', demo: true, verified: false,
    title: 'Sample Case A — Urgent Support',
    identifier: 'Patient ID: DEMO-001 (sample, not a real person)',
    summary: 'Sample text showing how a short, approved summary of a patient’s situation will appear.',
    requirement: 'Sample requirement: replace with the documented assistance requirement.',
    goal: 100000, raised: 35000,
    updated: '[Add last-updated date]',
    story: ['Sample paragraph: the verified story, written with the patient’s or family’s consent, goes here.'],
    purpose: 'Sample purpose: explain exactly what donated funds are intended to support, based on documents.',
    updates: ['[Date] — Sample update: add dated, documented progress notes here.']
  },
  {
    id: 'demo-ongoing', category: 'ongoing', demo: true, verified: false,
    title: 'Sample Case B — Ongoing Assistance',
    identifier: 'Patient ID: DEMO-002 (sample, not a real person)',
    summary: 'Sample text for a case where support is continuing over a longer period.',
    requirement: 'Sample requirement: replace with the documented ongoing need.',
    goal: 250000, raised: 120000,
    updated: '[Add last-updated date]',
    story: ['Sample paragraph: verified background for an ongoing support case.'],
    purpose: 'Sample purpose: describe what ongoing support covers, based on documents.',
    updates: ['[Date] — Sample update: add dated, documented progress notes here.']
  },
  {
    id: 'demo-completed', category: 'completed', demo: true, verified: false,
    title: 'Sample Case C — Completed Case',
    identifier: 'Patient ID: DEMO-003 (sample, not a real person)',
    summary: 'Sample text for a case that has been closed with documented evidence.',
    requirement: 'Closure note: shown only when the organization has documented evidence.',
    goal: 80000, raised: 80000,
    updated: '[Add closure date]',
    story: ['Sample paragraph: documented outcome or closure update goes here.'],
    purpose: 'Sample purpose: how the funds received were used, per records.',
    updates: ['[Date] — Sample closure update: add documented outcome here.']
  }
];

