(function () {
  function getReferenceId(citation) {
    var text = citation.textContent || "";
    var match = text.match(/\[(\d+)\]/);
    return match ? "ref-" + match[1] : null;
  }

  function activateReference(reference) {
    reference.scrollIntoView({ behavior: "smooth", block: "center" });
    reference.classList.remove("aphr-reference-highlight");
    window.setTimeout(function () {
      reference.classList.add("aphr-reference-highlight");
    }, 20);
  }

  function getLocalReference(citation) {
    var referenceId = getReferenceId(citation);
    return referenceId ? document.getElementById(referenceId) : null;
  }

  function isNativeControl(target, citation) {
    var control = target.closest("a, button, input, select, textarea");
    return control && citation.contains(control);
  }

  document.addEventListener("click", function (event) {
    var citation = event.target.closest(".citation");
    if (!citation) {
      return;
    }

    if (isNativeControl(event.target, citation)) {
      return;
    }

    var reference = getLocalReference(citation);
    if (reference) {
      activateReference(reference);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    var citation = event.target.closest(".citation");
    if (!citation) {
      return;
    }

    if (isNativeControl(event.target, citation)) {
      return;
    }

    event.preventDefault();
    citation.click();
  });

  document.querySelectorAll(".citation").forEach(function (citation) {
    if (citation.querySelector("a") || !getLocalReference(citation)) {
      return;
    }
    citation.setAttribute("tabindex", "0");
    citation.setAttribute("role", "button");
    citation.setAttribute("aria-label", "Show reference " + citation.textContent);
  });
})();
