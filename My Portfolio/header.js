(function () {
  const header = document.querySelector('.site-header');
  if (!header) {
    return;
  }

  let lastScrollY = window.scrollY;
  let ticking = false;
  const hideThreshold = 110;
  const deltaThreshold = 12;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    const passedThreshold = currentScrollY > hideThreshold;

    if (scrollDelta < deltaThreshold) {
      ticking = false;
      return;
    }

    if (scrollingDown && passedThreshold) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateHeader);
  }

  updateHeader();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
