/*
 * The study-material bookshelf (the original components/library/Bookshelf).
 * Filters by exam and format, keeps one spine in the tab order (roving tabindex:
 * arrow keys, Home and End move; Enter or Space opens), and fills the open book.
 */
(function () {
  "use strict";

  var TOGGLE_ON = "italic underline decoration-1 underline-offset-[6px]";
  var TOGGLE_OFF = "text-mute-l hover:text-ink";
  var LETTERS = "ABCDEFGHIJ";
  var FREE_NOTE = "Free for every aspirant. The file will be available to download here once it is published.";
  var COURSE_NOTE = "Part of the course material. Students receive it with their course.";

  function orDash(n) {
    return n === null || n === undefined ? "—" : Number(n).toLocaleString("en-IN");
  }

  function init(root) {
    var V = window.Vidyansh;
    var dataEl = root.querySelector("[data-bookshelf-data]");
    if (!dataEl) return;
    var data = JSON.parse(dataEl.textContent);
    var materials = data.materials;
    var formats = data.formats;
    var examName = data.examName;

    var state = { exam: "all", format: "all", selectedId: materials[0] ? materials[0].id : null, focusId: null };

    var spines = {};
    root.querySelectorAll("[data-spine]").forEach(function (b) {
      spines[b.getAttribute("data-spine")] = b;
    });
    var shelvesWrap = root.querySelector("[data-shelves]");
    var shelves = {};
    root.querySelectorAll("[data-shelf]").forEach(function (s) {
      shelves[s.getAttribute("data-shelf")] = s;
    });
    var empty = root.querySelector("[data-shelf-empty]");
    var count = root.querySelector("[data-shelf-count]");
    var announce = root.querySelector("[data-book-announce]");
    var book = root.querySelector("[data-book]");
    var none = root.querySelector("[data-book-none]");
    var ids = [];

    function render() {
      var visible = materials.filter(function (m) {
        return (state.exam === "all" || m.exams.indexOf(state.exam) !== -1) && (state.format === "all" || m.format === state.format);
      });
      var groups = [];
      visible.forEach(function (m) {
        var g = groups.filter(function (x) { return x.subject === m.subject; })[0];
        if (g) g.items.push(m);
        else groups.push({ subject: m.subject, items: [m] });
      });
      var order = [];
      groups.forEach(function (g) { order = order.concat(g.items); });
      ids = order.map(function (m) { return m.id; });
      var selected = order.filter(function (m) { return m.id === state.selectedId; })[0] || null;
      var tabId = state.focusId && ids.indexOf(state.focusId) !== -1 ? state.focusId : selected ? selected.id : ids[0] || null;

      // Filters
      root.querySelectorAll("[data-shelf-filter]").forEach(function (group) {
        var value = state[group.getAttribute("data-shelf-filter")];
        group.querySelectorAll("button").forEach(function (b) {
          var on = b.getAttribute("data-value") === value;
          b.setAttribute("aria-pressed", on ? "true" : "false");
          V.toggleClasses(b, TOGGLE_ON, on);
          V.toggleClasses(b, TOGGLE_OFF, !on);
        });
      });
      count.textContent = visible.length + " of " + materials.length + " titles on the shelf";

      // Shelves, in the order their first visible book appears
      var shown = {};
      groups.forEach(function (g, gi) {
        var s = shelves[g.subject];
        if (!s) return;
        shown[g.subject] = true;
        s.hidden = false;
        s.querySelector("[data-shelf-letter]").textContent = "Shelf " + (LETTERS[gi] || gi + 1);
      });
      // Move shelves only when their order really changes (moving a node drops its focus).
      var current = [].filter.call(shelvesWrap.children, function (s) { return shown[s.getAttribute("data-shelf")]; });
      var inOrder = groups.every(function (g, gi) { return current[gi] === shelves[g.subject]; });
      if (!inOrder) {
        groups.forEach(function (g) {
          if (shelves[g.subject]) shelvesWrap.appendChild(shelves[g.subject]);
        });
      }
      Object.keys(shelves).forEach(function (k) {
        if (!shown[k]) shelves[k].hidden = true;
      });
      empty.hidden = groups.length !== 0;
      shelvesWrap.hidden = groups.length === 0;

      materials.forEach(function (m) {
        var b = spines[m.id];
        if (!b) return;
        b.hidden = ids.indexOf(m.id) === -1;
        var isSel = !!selected && selected.id === m.id;
        b.setAttribute("aria-pressed", isSel ? "true" : "false");
        b.tabIndex = m.id === tabId ? 0 : -1;
        b.classList.toggle("-translate-y-5", isSel);
        b.classList.toggle("hover:-translate-y-2", !isSel);
      });

      // The open book
      announce.textContent = selected ? "Opened " + selected.title + ", " + selected.code : "";
      book.hidden = !selected;
      none.hidden = !!selected;
      if (selected) {
        book.querySelector("[data-book-code]").textContent = selected.code;
        book.querySelector("[data-book-title]").textContent = selected.title;
        book.querySelector("[data-book-note]").textContent = selected.availability === "free" ? FREE_NOTE : COURSE_NOTE;
        book.querySelector("[data-book-courses]").hidden = selected.availability !== "course";
        var fields = {
          subject: selected.subject,
          exam: selected.exams.map(function (c) { return examName[c] || c; }).join(" · "),
          format: formats[selected.format],
          pages: orDash(selected.pages),
          availability: selected.availability === "free" ? "Free download" : "Included with course",
        };
        Object.keys(fields).forEach(function (k) {
          book.querySelector('[data-book-field="' + k + '"]').textContent = fields[k];
        });
      }
    }

    root.querySelectorAll("[data-shelf-filter]").forEach(function (group) {
      var key = group.getAttribute("data-shelf-filter");
      group.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-value]");
        if (!b) return;
        state[key] = b.getAttribute("data-value");
        render();
      });
    });

    Object.keys(spines).forEach(function (id) {
      var b = spines[id];
      b.addEventListener("click", function () {
        state.selectedId = id;
        state.focusId = id;
        render();
      });
      b.addEventListener("focus", function () {
        if (state.focusId === id) return;
        state.focusId = id;
        render();
      });
      b.addEventListener("keydown", function (e) {
        var i = ids.indexOf(id);
        var next = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % ids.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + ids.length) % ids.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = ids.length - 1;
        if (next < 0) return;
        e.preventDefault();
        state.focusId = ids[next];
        render();
        spines[ids[next]].focus();
      });
    });

    render();
  }

  window.Vidyansh.ready(function () {
    document.querySelectorAll("[data-bookshelf]").forEach(init);
  });
})();
