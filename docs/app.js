// Swap for the Greasyfork URL once the script is published there.
// Until then every [data-nolink] element falls back to the text it carries,
// so the copy stays in the page's own language.
const GREASYFORK_URL = '';

if (GREASYFORK_URL) {
  document.getElementById('install').href = GREASYFORK_URL;
} else {
  for (const el of document.querySelectorAll('[data-nolink]')) {
    el.textContent = el.dataset.nolink;
  }
}

