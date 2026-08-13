const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function toggleNavMenu() {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  // console.log('toggleNavMenu: ', open);
}

toggle?.addEventListener('click', () => {
  event.stopPropagation();
  toggleNavMenu();
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (document.querySelector('.site-nav.open')) {
      toggleNavMenu();
    }
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = 'Thanks! The form is ready to be connected to a backend.';
});

document.getElementById('year').textContent = new Date().getFullYear();

// Clicking anywhere closes the nav menu.
document.addEventListener('click', event => {
  const navMenu = document.querySelector('.site-nav.open');
  if (!navMenu) {
    return;
  }

  for (
      let /** @type {HTMLElement} */ element = event.target;
      element !== document.body;
      element = element.parentElement
    ) {
    if (event.target === navMenu) {
      return;
    }
  }

  toggleNavMenu();
});

const topLinks = document.querySelectorAll('a[href="/"]');
topLinks.forEach(elem => {
  elem.addEventListener('click', event => {
    event.preventDefault();
    scroll(0, 0);
    history.replaceState(null, null, new URL(location.pathname, location.origin).toString());
  });
});
