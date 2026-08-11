(function () {
  var previousBodyOverflow = "";

  function setTriggerState(drawer, expanded) {
    document.querySelectorAll("[data-site-nav-open]").forEach(function (trigger) {
      if (resolveTarget(trigger) === drawer) {
        trigger.setAttribute("aria-expanded", String(expanded));
      }
    });
  }

  function openDrawer(drawer, trigger) {
    if (!drawer) {
      return;
    }

    drawer._siteNavTrigger = trigger || document.activeElement;
    drawer.inert = false;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    setTriggerState(drawer, true);
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("nav-open");

    var closeButton = drawer.querySelector(".site-nav-close");
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeDrawer(drawer, restoreFocus) {
    if (!drawer) {
      return;
    }

    var focusTarget = drawer._siteNavTrigger;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    setTriggerState(drawer, false);
    document.body.style.overflow = previousBodyOverflow;
    document.body.classList.remove("nav-open");
    drawer._siteNavTrigger = null;

    if (restoreFocus !== false && focusTarget && focusTarget.focus) {
      focusTarget.focus();
    }
  }

  function resolveTarget(trigger) {
    var id = trigger.getAttribute("data-site-nav-open") || "site-content-drawer";
    return document.getElementById(id);
  }

  function containFocus(event, drawer) {
    var focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll("[data-site-nav-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openDrawer(resolveTarget(trigger), trigger);
    });
  });

  document.querySelectorAll("[data-site-nav-close]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      closeDrawer(trigger.closest(".site-nav-shell"));
    });
  });

  document.addEventListener("keydown", function (event) {
    var drawer = document.querySelector(".site-nav-shell.is-open");
    if (!drawer) {
      return;
    }

    if (event.key === "Escape") {
      closeDrawer(drawer);
    } else if (event.key === "Tab") {
      containFocus(event, drawer);
    }
  });
})();
