const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

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

  // Nav menu should be open at this point, based on the query selector
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

// Contact form

const ENDPOINT =
  "https://mercury.granet.tech/api/intake/public/95e78fd7cc0869e1c1b28098056758d5/";

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const submitButton = form.querySelector('button[type="submit"]');

function showStatus(message, state = "") {
  status.textContent = message;
  status.dataset.state = state;
}

function setSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting
    ? "Sending..."
    : "Send request";
}

function clean(value) {
  return String(value || "").trim();
}

function buildPayload() {
  const fields = Object.fromEntries(new FormData(form));

  return {
    // A unique ID lets the server distinguish one submission from another.
    submission_request_id: crypto.randomUUID(),

    name: clean(fields.name),
    email: clean(fields.email),
    phone: clean(fields.phone),
    // service: clean(fields.service),
    message: clean(fields.message),

    // These are also present in the original form.
    website: clean(fields.website),
    challenge_response: clean(fields.challenge_response)
  };
}

function validate(payload) {
  if (payload.name < 2) {
    return "Please enter your name.";
  }

  if (!payload.email && !payload.phone) {
    return "Please provide an email address or phone number.";
  }

  if (
    payload.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
  ) {
    return "Please enter a valid email address.";
  }

  if (payload.message.length < 10) {
    return "Please tell us a little more about what you need.";
  }

  return "";
}

form.addEventListener("submit", async (event) => {
  // Stop the browser from doing a normal form POST / page navigation.
  event.preventDefault();

  const payload = buildPayload();
  const validationError = validate(payload);

  if (validationError) {
    showStatus(validationError, "error");
    return;
  }

  setSubmitting(true);
  showStatus("Sending your request...");

  try {
    // Send the form data to Mercury as JSON.
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "omit"
    });

    let result = null;

    try {
      result = await response.json();
    } catch {
      // Leave result as null if the response body is not JSON.
    }

    if (!response.ok) {
      const message =
        result?.error ||
        "The request could not be submitted. Please review it and try again.";

      showStatus(message, "error");
      return;
    }

    // The original code expects Mercury to accept the request with HTTP 202
    // and return { ok: true, receipt_id: "..." }.
    if (
      response.status !== 202 ||
      result?.ok !== true ||
      typeof result?.receipt_id !== "string" ||
      !result.receipt_id
    ) {
      showStatus(
        "The server responded, but the response could not be verified.",
        "error"
      );
      return;
    }

    // Success: clear the form and remain on this page.
    form.reset();
    showStatus("Request received. We will follow up shortly.", "success");
  } catch (error) {
    // fetch() reaches this block for network/CORS/connectivity failures.
    showStatus(
      "The connection was interrupted. Please try again.",
      "error"
    );
  } finally {
    setSubmitting(false);
  }
});
