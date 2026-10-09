/*
 * The full-screen examination console (the original TestConsole). Answers autosave on this
 * device after every change (Vidyansh.attempt, same localStorage keys), so a closed tab can be
 * resumed. The clock counts down from the attempt's start and submits the test at zero.
 */
(function () {
  "use strict";

  var V = window.Vidyansh;
  var A = V.attempt;
  var esc = A.esc;

  var CELL_STYLE = {
    answered: "border-ok bg-ok text-ink",
    "marked-answered": "border-mark bg-mark text-ink",
    marked: "border-mark text-mark",
    visited: "border-mute-d bg-ivory/15 text-ivory",
    unseen: "border-mute-d/70 text-mute-d",
  };
  var CELL_LABEL = {
    answered: "answered",
    "marked-answered": "answered and marked for review",
    marked: "marked for review",
    visited: "visited, not answered",
    unseen: "not seen",
  };
  var CELL_BASE = "grid aspect-square w-full place-items-center rounded-full border font-mono text-[0.6875rem] tabular-nums transition-shadow";
  var CELL_CURRENT = "ring-2 ring-ivory ring-offset-2 ring-offset-charcoal";
  var CELL_OTHER = "hover:ring-1 hover:ring-ivory/40";
  var OPTION_BASE = "flex cursor-pointer items-center gap-4 border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ivory";
  var OPTION_ON = "border-ivory bg-ivory/[0.06]";
  var OPTION_OFF = "border-[var(--line-d)] hover:border-ivory/35";
  var LETTER_BASE = "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[0.6875rem]";
  var LETTER_ON = "border-ivory bg-ivory text-ink";
  var LETTER_OFF = "border-mute-d text-mute-d";

  function cellOf(a, i) {
    var answered = a.answers[i] !== null;
    if (a.marked[i]) return answered ? "marked-answered" : "marked";
    if (answered) return "answered";
    return a.visited[i] ? "visited" : "unseen";
  }

  function init(root) {
    var paper = A.readJson(root.querySelector("[data-ts-paper]"));
    if (!paper) return;
    var testId = root.getAttribute("data-test-id");
    var resultHref = root.getAttribute("data-result-href");
    var n = paper.questions.length;
    var total = paper.durationMin * 60;

    var saved = A.load(testId);
    if (saved && saved.submittedAt) {
      window.location.replace(resultHref);
      return;
    }
    var a = saved && saved.paperId === paper.id ? saved : A.create(paper);
    A.save(testId, a);

    var now = Date.now();
    var sheetOpen = false;
    var confirming = false;
    var submitted = false;
    var renderedQuestion = -1;

    var $ = function (sel) {
      return root.querySelector(sel);
    };
    var $$ = function (sel) {
      return Array.prototype.slice.call(root.querySelectorAll(sel));
    };
    var heading = $("[data-ts-question]");
    var optionsBox = $("[data-ts-options]");
    var sheetDialog = $("[data-ts-sheet-dialog]");
    var confirmLayer = $("[data-ts-confirm]");
    var confirmDialog = $("[data-ts-confirm-dialog]");

    function left() {
      return Math.max(0, total - Math.floor((now - a.startedAt) / 1000));
    }

    function update(fn) {
      a = fn(a);
      A.save(testId, a);
      render();
    }

    function submit() {
      if (submitted) return;
      submitted = true;
      a = Object.assign({}, a, { submittedAt: Date.now() });
      A.save(testId, a);
      window.location.assign(resultHref);
    }

    function go(to) {
      update(function (p) {
        var visited = p.visited.slice();
        visited[to] = true;
        return Object.assign({}, p, { current: to, visited: visited });
      });
      setSheetOpen(false);
      requestAnimationFrame(function () {
        heading.focus();
      });
    }

    function choose(opt) {
      update(function (p) {
        var answers = p.answers.slice();
        answers[p.current] = opt;
        return Object.assign({}, p, { answers: answers });
      });
    }

    function clear() {
      update(function (p) {
        var answers = p.answers.slice();
        answers[p.current] = null;
        return Object.assign({}, p, { answers: answers });
      });
    }

    function markAndNext() {
      var i = a.current;
      update(function (p) {
        var marked = p.marked.slice();
        marked[p.current] = !marked[p.current];
        return Object.assign({}, p, { marked: marked });
      });
      if (i < n - 1) go(i + 1);
    }

    function setSheetOpen(open) {
      if (sheetOpen === open) return;
      sheetOpen = open;
      sheetDialog.hidden = !open;
      if (open) $("[data-ts-sheet-close]").focus();
    }

    function onConfirmKey(e) {
      if (e.key === "Escape") setConfirming(false);
    }
    function setConfirming(on) {
      if (confirming === on) return;
      confirming = on;
      renderClock();
      renderCounts();
      confirmLayer.hidden = !on;
      if (on) {
        var first = confirmDialog.querySelector("button");
        if (first) first.focus();
        document.addEventListener("keydown", onConfirmKey);
      } else document.removeEventListener("keydown", onConfirmKey);
    }

    function buildOptions(q) {
      optionsBox.innerHTML = q.options
        .map(function (o, k) {
          return (
            '<label class="' + OPTION_BASE + " " + OPTION_OFF + '">' +
            '<input type="radio" name="q-' + esc(q.id) + '" class="sr-only" data-ts-option="' + k + '">' +
            '<span aria-hidden="true" class="' + LETTER_BASE + " " + LETTER_OFF + '">' + String.fromCharCode(65 + k) + "</span>" +
            '<span class="font-display text-[1.3rem] leading-snug">' + esc(o) + "</span></label>"
          );
        })
        .join("");
      optionsBox.querySelectorAll("[data-ts-option]").forEach(function (input) {
        input.addEventListener("change", function () {
          choose(Number(input.getAttribute("data-ts-option")));
        });
      });
    }

    function counts() {
      var c = { answered: 0, "marked-answered": 0, marked: 0, visited: 0, unseen: 0 };
      for (var k = 0; k < n; k++) c[cellOf(a, k)] += 1;
      return c;
    }

    function renderClock() {
      var l = left();
      var low = l <= 60;
      var timer = $("[data-ts-timer]");
      timer.setAttribute("aria-label", "Time remaining " + Math.floor(l / 60) + " minutes " + (l % 60) + " seconds");
      V.toggleClasses(timer, "border-bad text-bad", low);
      V.toggleClasses(timer, "border-[var(--hair)] text-ivory", !low);
      $("[data-ts-clock]").textContent = A.formatClock(l);
      $("[data-ts-confirm-clock]").textContent = A.formatClock(l);
      $("[data-ts-progress]").style.width = (l / total) * 100 + "%";
      return l;
    }

    function renderCounts() {
      var c = counts();
      var answeredTotal = c.answered + c["marked-answered"];
      $$("[data-ts-answered]").forEach(function (el) {
        el.textContent = answeredTotal;
      });
      $$("[data-ts-count]").forEach(function (el) {
        el.textContent = c[el.getAttribute("data-ts-count")];
      });
      $("[data-ts-sheet-open]").textContent = "Sheet " + answeredTotal + "/" + n;
      $('[data-ts-confirm-count="answered"]').textContent = answeredTotal;
      $('[data-ts-confirm-count="marked"]').textContent = c.marked + c["marked-answered"];
      $('[data-ts-confirm-count="unanswered"]').textContent = n - answeredTotal;
    }

    function render() {
      var i = a.current;
      var q = paper.questions[i];

      if (renderedQuestion !== i) {
        renderedQuestion = i;
        $("[data-ts-qnum]").textContent = A.pad2(i + 1);
        $("[data-ts-subject]").textContent = q.subject;
        heading.textContent = q.text;
        buildOptions(q);
      }
      optionsBox.querySelectorAll("[data-ts-option]").forEach(function (input) {
        var k = Number(input.getAttribute("data-ts-option"));
        var on = a.answers[i] === k;
        input.checked = on;
        var label = input.parentNode;
        label.className = OPTION_BASE + " " + (on ? OPTION_ON : OPTION_OFF);
        label.querySelector("span").className = LETTER_BASE + " " + (on ? LETTER_ON : LETTER_OFF);
      });

      $$("[data-ts-cell]").forEach(function (b) {
        var k = Number(b.getAttribute("data-ts-cell"));
        var cell = cellOf(a, k);
        b.className = CELL_BASE + " " + CELL_STYLE[cell] + " " + (k === i ? CELL_CURRENT : CELL_OTHER);
        b.setAttribute("aria-label", "Question " + (k + 1) + ", " + CELL_LABEL[cell]);
        if (k === i) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
      renderCounts();

      $("[data-ts-mark]").textContent = (a.marked[i] ? "Unmark" : "Mark for review") + (i < n - 1 ? " & next" : "");
      $("[data-ts-clear]").disabled = a.answers[i] === null;
      $("[data-ts-prev]").disabled = i === 0;
      $("[data-ts-next]").hidden = !(i < n - 1);
      $("[data-ts-submit-last]").hidden = i < n - 1;
      renderClock();
    }

    /* Wire the controls. */
    $("[data-ts-mark]").addEventListener("click", markAndNext);
    $("[data-ts-clear]").addEventListener("click", clear);
    $("[data-ts-prev]").addEventListener("click", function () {
      go(a.current - 1);
    });
    $("[data-ts-next]").addEventListener("click", function () {
      go(a.current + 1);
    });
    $("[data-ts-submit-last]").addEventListener("click", function () {
      setConfirming(true);
    });
    $$("[data-ts-cell]").forEach(function (b) {
      b.addEventListener("click", function () {
        go(Number(b.getAttribute("data-ts-cell")));
      });
    });
    $$("[data-ts-confirm-open]").forEach(function (b) {
      b.addEventListener("click", function () {
        setConfirming(true);
      });
    });
    $("[data-ts-sheet-open]").addEventListener("click", function () {
      setSheetOpen(true);
    });
    $("[data-ts-sheet-close]").addEventListener("click", function () {
      setSheetOpen(false);
    });
    sheetDialog.addEventListener("click", function () {
      setSheetOpen(false);
    });
    $("[data-ts-sheet-panel]").addEventListener("click", function (e) {
      e.stopPropagation();
    });
    $("[data-ts-confirm-back]").addEventListener("click", function () {
      setConfirming(false);
    });
    $("[data-ts-confirm-submit]").addEventListener("click", submit);

    document.querySelector("[data-ts-preparing]").hidden = true;
    root.hidden = false;
    render();

    function tick() {
      now = Date.now();
      if (renderClock() === 0) submit();
    }
    if (left() === 0) submit();
    window.setInterval(tick, 1000);
  }

  V.ready(function () {
    var root = document.querySelector("[data-ts-console]");
    if (root) init(root);
  });
})();
