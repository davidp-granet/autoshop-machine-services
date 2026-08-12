const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = 'Thanks! The form is ready to be connected to a backend.';
});

document.getElementById('year').textContent = new Date().getFullYear();

const topLinks = document.querySelectorAll('a[href="/"]');
topLinks.forEach(elem => {
  elem.addEventListener('click', event => {
    event.preventDefault();
    scroll(0, 0);
    history.replaceState(null, null, new URL(location.pathname, location.origin).toString());
  });
});
