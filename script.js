// ===== Analytics settings =====
// Paste your IDs here (one place for the whole site). Leave empty to keep tracking off.
// Google Analytics 4 Measurement ID looks like 'G-ABC123XYZ'. Meta Pixel ID is a number like '123456789012345'.
const GA_MEASUREMENT_ID = '';
const META_PIXEL_ID = '';

if (GA_MEASUREMENT_ID) {
  const ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(ga);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

if (META_PIXEL_ID) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu after clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Sends an event to Google Analytics if it's installed on the page. Safe no-op otherwise.
function trackEvent(name, params) {
  if (typeof gtag === 'function') gtag('event', name, params);
  if (name === 'generate_lead' && typeof fbq === 'function') fbq('track', 'Lead', params);
}

// Track clicks on any WhatsApp button as a contact event
document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
  a.addEventListener('click', () => trackEvent('whatsapp_click', { page: location.pathname }));
});

// Contact form -> opens WhatsApp with the message pre-filled (index.html only)
const WHATSAPP_NUMBER = '923086010310';
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: real visitors never fill this hidden field, bots often do.
    const honeypot = document.getElementById('hp_website').value.trim();
    if (honeypot) return;

    const name = document.getElementById('name').value.trim();
    const business = document.getElementById('business').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const website = document.getElementById('website').value.trim();
    const service = document.getElementById('service').value;
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value.trim();

    const text =
      `Hi Munawar Digital! I'm ${name}${business ? ` from ${business}` : ''}.\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      (website ? `Website: ${website}\n` : '') +
      `Service: ${service}\n` +
      `Budget: ${budget}\n` +
      `Details: ${message}`;

    trackEvent('generate_lead', { service, budget });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');

    // Backup: show an email option in case WhatsApp isn't available on this device
    const fallback = document.getElementById('formFallback');
    const emailLink = document.getElementById('formEmailLink');
    if (fallback && emailLink) {
      emailLink.href = 'mailto:munawardigital@gmail.com?subject=' +
        encodeURIComponent('Project request from ' + name) + '&body=' + encodeURIComponent(text);
      fallback.hidden = false;
    }
  });
}

// Lead magnet form -> opens WhatsApp with the lead's details, then reveals the download button (free-ai-guide.html only)
const leadForm = document.getElementById('leadForm');

if (leadForm) {
  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const honeypot = document.getElementById('lm-website').value.trim();
    if (honeypot) return;

    const name = document.getElementById('lm-name').value.trim();
    const email = document.getElementById('lm-email').value.trim();
    const phone = document.getElementById('lm-phone').value.trim();

    const text =
      `Hi Munawar Digital! I'm ${name}.\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `I just downloaded the "10 AI Tools" guide and would like to learn more.`;

    trackEvent('generate_lead', { source: 'free_ai_guide' });

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

    document.getElementById('leadFormWrap').hidden = true;
    document.getElementById('leadSuccess').hidden = false;
  });
}

// Testimonials: renders real testimonials from testimonials.json when present,
// otherwise keeps the "coming soon" placeholder already in the HTML. (index.html only)
// To add a testimonial, edit testimonials.json: [{ "name": "...", "role": "...", "quote": "..." }]
const testimonialsWrap = document.getElementById('testimonialsWrap');

if (testimonialsWrap) {
  fetch('testimonials.json')
    .then(res => (res.ok ? res.json() : []))
    .then(list => {
      if (!Array.isArray(list) || list.length === 0) return;

      const grid = document.createElement('div');
      grid.className = 'testimonials-grid';

      list.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';

        const quote = document.createElement('p');
        quote.textContent = `"${t.quote}"`;

        const name = document.createElement('div');
        name.className = 'testimonial-name';
        name.textContent = t.name || '';

        const role = document.createElement('div');
        role.className = 'testimonial-role';
        role.textContent = t.role || '';

        card.append(quote, name, role);
        grid.appendChild(card);
      });

      testimonialsWrap.innerHTML = '';
      testimonialsWrap.appendChild(grid);
    })
    .catch(() => {});
}
