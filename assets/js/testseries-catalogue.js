/*
 * The catalogue ledger (the original Catalogue): hovering or focusing a row marks it and opens
 * its cover beside the list; a row for the visitor's chosen exam carries "Your exam".
 */
(function () {
  "use strict";

  var V = window.Vidyansh;

  function init(root) {
    var rows = Array.prototype.slice.call(root.querySelectorAll("[data-ts-row]"));
    if (!rows.length) return;
    var examsEl = root.querySelector("[data-ts-catalogue-exams]");
    var list = [];
    try {
      list = JSON.parse(examsEl.textContent);
    } catch (e) {}
    var examOf = {};
    list.forEach(function (s) {
      examOf[s.id] = s.exam;
    });

    function select(id) {
      rows.forEach(function (row) {
        var on = row.getAttribute("data-ts-row") === id;
        V.toggleClasses(row, "lg:bg-ivory/[0.035]", on);
        V.toggleClasses(row, "hover:bg-ivory/[0.02]", !on);
        V.toggleClasses(row.querySelector("[data-ts-row-bar]"), "lg:bg-ivory", on);
        V.toggleClasses(row.querySelector("[data-ts-row-name]"), "lg:text-ivory", on);
      });
      root.querySelectorAll("[data-ts-cover]").forEach(function (c) {
        c.hidden = c.getAttribute("data-ts-cover") !== id;
      });
    }

    function applyExam(exam, initial) {
      rows.forEach(function (row) {
        var mine = exam !== null && examOf[row.getAttribute("data-ts-row")] === exam;
        row.querySelector("[data-ts-mine]").hidden = !mine;
      });
      if (initial && exam) {
        var match = list.filter(function (s) {
          return s.exam === exam;
        })[0];
        if (match) select(match.id);
      }
    }

    rows.forEach(function (row) {
      var id = row.getAttribute("data-ts-row");
      row.addEventListener("mouseenter", function () {
        select(id);
      });
      row.addEventListener("focus", function () {
        select(id);
      });
    });

    applyExam(V.getExam ? V.getExam() : null, true);
    if (V.onExam)
      V.onExam(function (exam) {
        applyExam(exam, false);
      });
  }

  V.ready(function () {
    document.querySelectorAll("[data-ts-catalogue]").forEach(init);
  });
})();
