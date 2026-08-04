/* Apply window.REDIRECT_URL (dynamically configured by domain) to all buttons & links */
(function () {
  function updateAllLinks() {
    var targetUrl = window.REDIRECT_URL || '#';
    var links = document.querySelectorAll('a.redirect-link');
    for (var i = 0; i < links.length; i++) {
      links[i].href = targetUrl;
    }
  }

  function initRedirects() {
    updateAllLinks();

    // 2-Step UX Logic for Main CTA
    var mainCta = document.getElementById('main-cta');
    var modal = document.getElementById('casino-modal');
    var reel1 = document.getElementById('reel-1');
    var reel2 = document.getElementById('reel-2');
    var reel3 = document.getElementById('reel-3');
    var modalMessage = document.getElementById('modal-message');
    var finalCta = document.getElementById('final-cta');
    var modalTitle = document.getElementById('modal-title');

    var symbols = ['🍒', '🔔', '💎', '7️⃣', '⭐'];

    if (mainCta && modal && !mainCta.dataset.bound) {
      mainCta.dataset.bound = 'true';
      mainCta.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'flex';
        modalMessage.textContent = 'Vòng quay đang quay...';
        modalMessage.classList.remove('success-text', 'hidden');
        finalCta.classList.add('hidden');
        modalTitle.textContent = 'VÒNG QUAY MAY MẮN';

        var rolls = 0;
        var maxRolls = 30; // 30 rolls * 100ms = 3000ms (3s)
        var rollSpeed = 100;

        var rollInterval = setInterval(function () {
          reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          rolls++;

          if (rolls >= maxRolls) {
            clearInterval(rollInterval);
            reel1.textContent = '💎';
            reel2.textContent = '💎';
            reel3.textContent = '💎';

            modalMessage.textContent = 'Chúc mừng! Bạn được tăng tỉ lệ trúng thưởng thành công';
            modalMessage.classList.add('success-text');
            modalTitle.textContent = 'CHÚC MỪNG';
            finalCta.textContent = 'VÀO CHƠI NGAY';
            finalCta.classList.remove('hidden');
          }
        }, rollSpeed);
      });
    }

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
