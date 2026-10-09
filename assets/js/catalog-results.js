/*
 * The arrivals board (the original ArrivalsBoard): year tabs with arrow-key navigation, an exam filter,
 * and a split-flap table rebuilt on every change so the characters turn over again.
 */
(function () {
  "use strict";

  var TAB_ON = "border-ivory text-ivory italic";
  var TAB_OFF = "border-transparent text-mute-d hover:text-ivory";
  var EXAM_ON = "border-ivory text-ivory";
  var EXAM_OFF = "border-transparent text-mute-d hover:text-ivory";
  var CELL = "border-b border-[var(--line-d)] py-4 pr-4 align-middle";
  var CELL_LAST = "border-b border-[var(--line-d)] py-4 text-right align-middle";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  }

  /* Same markup as catalog_flap_text() in app/ui/catalog.php. */
  function flapText(text, start) {
    text = String(text == null ? "" : text);
    var i = start || 0;
    var out = '<span class="sr-only">' + esc(text) + '</span><span aria-hidden="true" class="flap-row">';
    text.toUpperCase().split(" ").forEach(function (w, wi) {
      out += '<span class="inline-flex gap-[2px] whitespace-nowrap">';
      if (wi > 0) out += '<span class="flap flap--blank" style="--i:' + i++ + '"> </span>';
      Array.from(w).forEach(function (c) {
        out += '<span class="flap" style="--i:' + i++ + '">' + esc(c) + "</span>";
      });
      out += "</span>";
    });
    return out + "</span>";
  }

  function init(root) {
    var V = window.Vidyansh;
    var board = JSON.parse(root.querySelector("script[data-board]").textContent);
    var year = board.years[0];
    var exam = "all";
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var examButtons = root.querySelectorAll("[data-exam]");
    var summary = root.querySelector("[data-summary]");
    var panel = root.querySelector('[role="tabpanel"]');
    var caption = root.querySelector("[data-caption]");
    var tbody = root.querySelector("[data-rows]");

    function render() {
      var rows = board.rows.filter(function (r) {
        return r.year === year && (exam === "all" || r.exam === exam);
      });
      var found = board.exams.filter(function (e) {
        return e.code === exam;
      })[0];
      var examLabel = exam === "all" ? "all exams" : found ? found.label : exam;

      tabs.forEach(function (t) {
        var on = t.getAttribute("data-year") === year;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        V.toggleClasses(t, TAB_OFF, !on);
        V.toggleClasses(t, TAB_ON, on);
      });
      examButtons.forEach(function (b) {
        var on = b.getAttribute("data-exam") === exam;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        V.toggleClasses(b, EXAM_OFF, !on);
        V.toggleClasses(b, EXAM_ON, on);
      });

      summary.textContent = rows.length + " " + (board.isSample ? "sample " : "") + (rows.length === 1 ? "arrival" : "arrivals") + " · " + year + " · " + examLabel;
      panel.setAttribute("aria-labelledby", "arrivals-tab-" + year);
      caption.textContent = "Arrivals board for " + year + ", " + examLabel + (board.isSample ? ". Sample rows; verified results will replace them" : "");

      // A fresh tbody, like the keyed one in React, so every flap animates again.
      var fresh = document.createElement("tbody");
      fresh.setAttribute("data-rows", "");
      if (rows.length === 0) {
        fresh.innerHTML = '<tr><td colspan="5" class="border-b border-[var(--line-d)] py-10 text-body-d">No arrivals on this board yet.</td></tr>';
      } else {
        fresh.innerHTML = rows
          .map(function (r, ri) {
            return (
              "<tr>" +
              '<td class="' + CELL + '">' + flapText(r.student, ri * 3) + "</td>" +
              '<td data-label="From" class="' + CELL + '">' + flapText(r.from, ri * 3 + 6) + "</td>" +
              '<td data-label="Destination" class="' + CELL + '">' + flapText(r.destination, ri * 3 + 8) + "</td>" +
              '<td data-label="Rank" class="' + CELL + '">' + flapText(r.rank, ri * 3 + 20) + "</td>" +
              '<td data-label="Year" class="' + CELL_LAST + '">' + flapText(r.year, ri * 3 + 22) + "</td>" +
              "</tr>"
            );
          })
          .join("");
      }
      tbody.replaceWith(fresh);
      tbody = fresh;
    }

    function selectYear(y) {
      if (y === year) return;
      year = y;
      render();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        selectYear(t.getAttribute("data-year"));
      });
      t.addEventListener("keydown", function (e) {
        var last = tabs.length - 1;
        var next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
        if (next === null) return;
        e.preventDefault();
        selectYear(tabs[next].getAttribute("data-year"));
        tabs[next].focus();
      });
    });
    examButtons.forEach(function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-exam");
        if (code === exam) return;
        exam = code;
        render();
      });
    });
  }

  window.Vidyansh.ready(function () {
    document.querySelectorAll("[data-arrivals-board]").forEach(init);
  });
})();
