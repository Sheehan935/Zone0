(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  function closeNav() {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  function openNav() {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeNav();
  });
})();

// Sticky header mobile menu (index.html)
(function () {
    function initMobileMenu() {
        var toggle = document.getElementById('mobileMenuToggle');
        var menu = document.getElementById('mobileMenu');
        var icon = document.getElementById('mobileMenuIcon');
        if (!toggle || !menu) return;

        function closeMobileMenu() {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            toggle.setAttribute('aria-expanded', 'false');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }

        function openMobileMenu() {
            menu.classList.remove('hidden');
            menu.classList.add('flex');
            toggle.setAttribute('aria-expanded', 'true');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        }

        toggle.addEventListener('click', function () {
            var isOpen = toggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) { closeMobileMenu(); } else { openMobileMenu(); }
        });

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768) closeMobileMenu();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();

// Interactive AB 3074 Compliance Checklist
(function () {
    var STORAGE_KEY = 'zone0-compliance-checklist';

    function loadState() {
        try {
            return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveState(state) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            /* localStorage unavailable (private mode etc.) — checklist still works, just won't persist */
        }
    }

    function initComplianceChecklist() {
        var container = document.getElementById('compliance-checklist');
        if (!container) return;

        var items = Array.prototype.slice.call(container.querySelectorAll('.compliance-check-item'));
        var fill = document.getElementById('compliance-progress-fill');
        var banner = document.getElementById('compliance-status-banner');
        var state = loadState();

        function render() {
            var checkedCount = 0;
            items.forEach(function (item) {
                var checkbox = item.querySelector('input[type="checkbox"]');
                var isChecked = !!state[item.dataset.itemId];
                checkbox.checked = isChecked;
                item.classList.toggle('is-checked', isChecked);
                if (isChecked) checkedCount++;
            });

            if (fill) fill.style.width = (checkedCount / items.length * 100) + '%';

            if (banner) {
                if (checkedCount === items.length) {
                    banner.textContent = 'All 4 complete — nice work. Consider a free photo check to confirm.';
                } else if (checkedCount === 0) {
                    banner.textContent = '0 of ' + items.length + ' complete — start with mulch removal, the highest-impact fix.';
                } else {
                    banner.textContent = checkedCount + ' of ' + items.length + ' complete.';
                }
            }
        }

        items.forEach(function (item) {
            var checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function () {
                state[item.dataset.itemId] = checkbox.checked;
                saveState(state);
                render();
            });
        });

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComplianceChecklist);
    } else {
        initComplianceChecklist();
    }
})();
