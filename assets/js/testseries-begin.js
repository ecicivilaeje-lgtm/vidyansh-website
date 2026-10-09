/*
 * The readiness declaration on a test's instructions page (the original BeginTest):
 * the start button opens once the box is ticked; a saved attempt is offered for resuming.
 */
(function () {
  "use strict";

  var V = window.Vidyansh;
  var A = V.attempt;

  function init(root) {
    var testId = root.getAttribute("data-test-id");
    var box = root.querySelector("[data-ts-ready]");
    var start = root.querySelector("[data-ts-start]");
    var a = A.load(testId);
    var saved = a ? (a.submittedAt ? "submitted" : "in_progress") : "none";

    root.querySelectorAll("[data-ts-saved]").forEach(function (p) {
      p.hidden = p.getAttribute("data-ts-saved") !== saved;
    });
    start.textContent = saved === "in_progress" ? "Resume test" : "I am ready, begin";

    function sync() {
      start.disabled = !box.checked;
    }
    box.addEventListener("change", sync);
    sync();

    start.addEventListener("click", function () {
      if (saved !== "in_progress") A.clear(testId);
      window.location.assign(root.getAttribute("data-attempt-href"));
    });
  }

  V.ready(function () {
    document.querySelectorAll("[data-ts-begin]").forEach(init);
  });
})();
