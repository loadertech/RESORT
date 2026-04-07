/* ===============================
   ACCESSIBILITY CHECKS
================================ */

(function () {
  "use strict";

  function logWarning(message, element) {
    if (element) {
      console.warn("[a11y] " + message, element);
      return;
    }
    console.warn("[a11y] " + message);
  }

  function validateInteractiveElement(selector, requirement, message) {
    document.querySelectorAll(selector).forEach((el) => {
      if (!el.hasAttribute(requirement)) {
        logWarning(message, el);
      }
    });
  }

  function runAccessibilityChecks() {
    validateInteractiveElement(
      "button[aria-controls]",
      "aria-expanded",
      "Button with aria-controls should also have aria-expanded.",
    );

    document.querySelectorAll("img").forEach((img) => {
      const alt = img.getAttribute("alt");
      if (alt === null || alt.trim() === "") {
        logWarning("Image missing meaningful alt text.", img);
      }
    });

    document.querySelectorAll("input, select, textarea").forEach((field) => {
      const hasLabel = !!(
        field.id && document.querySelector("label[for='" + field.id + "']")
      );
      const hasAriaLabel = field.hasAttribute("aria-label");
      const hasAriaLabelledBy = field.hasAttribute("aria-labelledby");

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        logWarning("Form field has no associated label.", field);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAccessibilityChecks);
  } else {
    runAccessibilityChecks();
  }
})();
