const savedEdits = PortfolioEdits.read();
if (savedEdits) PortfolioEdits.apply(document, savedEdits);

const menuButton = document.querySelector('.menu-button');
const menu = document.getElementById('site-nav');
const compactMenu = window.matchMedia('(max-width: 60rem)');

function setMenu(open) {
  menu.hidden = compactMenu.matches && !open;
  menuButton.setAttribute('aria-expanded', String(compactMenu.matches && open));
}

menuButton.hidden = false;
setMenu(false);
compactMenu.addEventListener('change', () => setMenu(false));
menuButton.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !compactMenu.matches || menu.hidden) return;
  setMenu(false);
  menuButton.focus();
});

const navLinks = [...menu.querySelectorAll('a')];

function markLocation() {
  navLinks.forEach((link) => {
    if (link.hash === window.location.hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

menu.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || !compactMenu.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  setMenu(false);
  const target = document.getElementById(link.hash.slice(1));
  target?.setAttribute('tabindex', '-1');
  target?.focus({ preventScroll: true });
});
window.addEventListener('hashchange', markLocation);
markLocation();

const filters = document.querySelector('.filters');
const filterStatus = document.getElementById('filter-status');
const projects = [...document.querySelectorAll('.project')];
filters.hidden = false;
filters.addEventListener('click', (event) => {
  const selected = event.target.closest('[data-filter]');
  if (!selected) return;
  const { filter } = selected.dataset;
  filters.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button === selected)));
  let visible = 0;
  projects.forEach((project) => {
    project.hidden = filter !== 'all' && !project.dataset.category.split(' ').includes(filter);
    if (!project.hidden) visible += 1;
  });
  filterStatus.textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}.`;
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  for (const field of ['name', 'email', 'subject', 'message']) {
    const value = formData.get(field).trim();
    if (!value) {
      formStatus.textContent = 'Please fill out every field before sending.';
      contactForm.elements.namedItem(field).focus();
      return;
    }
    formData.set(field, value);
  }

  submitButton.disabled = true;
  formStatus.textContent = 'Sending your message…';
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Form submission failed');
    contactForm.reset();
    formStatus.textContent = 'Thanks! Your message was sent.';
  } catch {
    formStatus.textContent = 'Your message could not be sent. Please try again or reach out by email or WhatsApp.';
  } finally {
    submitButton.disabled = false;
  }
});
