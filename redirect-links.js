/* Apply window.REDIRECT_URL (dynamically configured by domain) to all buttons & links */
(function () {
  function updateAllLinks() {
    var targetUrl = window.REDIRECT_URL || '#';
    var links = document.querySelectorAll('a.redirect-link, a.ref-btn, #main-cta, #final-cta');
    for (var i = 0; i < links.length; i++) {
      links[i].href = targetUrl;
    }
  }

  function initRedirects() {
    updateAllLinks();

    var mainCta = document.getElementById('main-cta');
    if (mainCta && !mainCta.dataset.bound) {
      mainCta.dataset.bound = 'true';
      mainCta.addEventListener('click', function (e) {
        var currentUrl = window.REDIRECT_URL || '#';
        if (currentUrl && currentUrl !== '#') {
          // Navigate directly to domain target URL
          window.location.href = currentUrl;
        }
      });
    }

    var finalCta = document.getElementById('final-cta');
    if (finalCta && !finalCta.dataset.bound) {
      finalCta.dataset.bound = 'true';
      finalCta.addEventListener('click', function () {
        var currentUrl = window.REDIRECT_URL || '#';
        window.location.href = currentUrl;
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initRedirects);
  window.addEventListener('domainConfigLoaded', updateAllLinks);
})();
