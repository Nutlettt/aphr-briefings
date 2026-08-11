(function () {
  var drawer = document.getElementById("detail-drawer");
  var title = document.getElementById("drawer-title");
  var body = document.getElementById("drawer-body");
  var activeTrigger = null;
  var previousBodyOverflow = "";

  if (!drawer || !title || !body) {
    return;
  }

  drawer.inert = true;

  function containFocus(event) {
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

  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    document.body.style.overflow = previousBodyOverflow;
    document.body.classList.remove("drawer-open");
    body.replaceChildren();

    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-drawer-target]");
    if (!trigger) {
      return;
    }

    var template = document.getElementById(trigger.getAttribute("data-drawer-target"));
    if (!template) {
      return;
    }

    title.textContent = trigger.getAttribute("data-drawer-title") || "Details";
    body.replaceChildren(template.content.cloneNode(true));
    activeTrigger = trigger;
    drawer.inert = false;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("drawer-open");

    var closeButton = drawer.querySelector(".drawer-close");
    if (closeButton) {
      closeButton.focus();
    }
  });

  document.querySelectorAll("[data-drawer-close]").forEach(function (trigger) {
    trigger.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", function (event) {
    if (!drawer.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeDrawer();
    } else if (event.key === "Tab") {
      containFocus(event);
    }
  });
})();
