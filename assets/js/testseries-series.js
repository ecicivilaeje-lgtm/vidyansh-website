/*
 * A series page (the original SeriesView): the review switcher for the page states, the
 * status of each test (including attempts saved on this device) and the "resume" banner.
 */
(function () {
  "use strict";

  var V = window.Vidyansh;
  var A = V.attempt;
  var esc = A.esc;

  var STATUS = {
    locked: { label: "Locked", cls: "text-mute-d border-[var(--line-d)]" },
    available: { label: "Available", cls: "text-ivory border-ivory/40" },
    in_progress: { label: "In progress", cls: "text-mark border-mark/50" },
    completed: { label: "Completed", cls: "text-ok border-ok/50" },
  };

  function orDash(v, suffix) {
    return v === null || v === undefined ? "—" : v.toLocaleString("en-IN") + (suffix || "");
  }

  /* The original TestRow; the server renders the same markup (testseries_test_row). */
  function rowHtml(t, status, score, hrefs) {
    var s = STATUS[status];
    var action =
      status === "available"
        ? { href: hrefs.test, label: t.isFree ? "Start free" : "Start" }
        : status === "in_progress"
          ? { href: hrefs.attempt, label: "Resume" }
          : status === "completed"
            ? { href: hrefs.result, label: "Result" }
            : null;
    var meta = (t.questions !== null ? t.questions + " questions · " + orDash(t.durationMin, " min") + " · " : "") + t.releaseNote;
    return (
      '<span class="font-mono text-xs text-mute-d tabular-nums">' + A.pad2(t.number) + "</span>" +
      '<span class="min-w-0"><span class="' + (status === "locked" ? "block font-display text-[1.45rem] leading-tight text-ivory/60" : "block font-display text-[1.45rem] leading-tight") + '">' + esc(t.title) + "</span>" +
      '<span class="eyebrow mt-1 block">' + esc(meta) + "</span>" +
      (status === "completed" ? '<span class="mt-1 block font-mono text-[0.6875rem] tracking-[0.1em] text-body-d">Score ' + esc(score === null ? "—" : score) + " · Rank — · Percentile —</span>" : "") +
      "</span>" +
      '<span class="col-start-2 row-start-2 md:col-start-auto md:row-start-auto"><span class="inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.5625rem] tracking-[0.14em] uppercase ' + s.cls + '">' +
      (status === "locked"
        ? '<svg viewBox="0 0 12 12" aria-hidden="true" class="size-2.5"><rect x="2" y="5.5" width="8" height="5.5" fill="none" stroke="currentColor"></rect><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor"></path></svg>'
        : "") +
      s.label + "</span></span>" +
      '<span class="col-start-3 row-span-2 row-start-1 justify-self-end md:col-start-auto md:row-span-1 md:row-start-auto">' +
      (action
        ? '<a href="' + esc(action.href) + '" aria-label="' + esc(action.label + ": " + t.title) + '" class="' +
          (status === "available"
            ? "inline-flex border px-3.5 py-2.5 whitespace-nowrap font-mono text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory"
            : "inline-flex border px-3.5 py-2.5 whitespace-nowrap font-mono text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors border-ivory/30 hover:border-ivory hover:text-ivory") +
          '">' + action.label + "</a>"
        : '<span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">—</span>') +
      "</span>"
    );
  }

  function init(root) {
    var data = A.readJson(root.querySelector("[data-ts-series-data]"));
    if (!data) return;
    var tests = data.tests;
    var progress = data.progress;
    var paper = data.paper;
    var view = null;
    var local = {};

    if (paper) {
      tests.forEach(function (t) {
        if (t.paperId !== paper.id) return;
        var a = A.load(t.id);
        if (!a) return;
        if (a.submittedAt) {
          var s = A.score(paper, a);
          local[t.id] = { status: "completed", score: s.score + " / " + s.maxScore };
        } else local[t.id] = { status: "in_progress", score: null };
      });
    }

    var rowEls = {};
    root.querySelectorAll("[data-ts-test]").forEach(function (li) {
      rowEls[li.getAttribute("data-ts-test")] = li;
    });
    var rendered = {};
    tests.forEach(function (t) {
      rendered[t.id] = (progress.testStatus[t.id] || "locked") + "|";
    });

    function access() {
      return view === null || view === "not_purchased" ? progress.access : "purchased";
    }
    function statusOf(t) {
      if (view === "in_progress" && t.number === 1) return "in_progress";
      if (view === "completed" && t.number === 1) return "completed";
      if (local[t.id] && (view === null || view === "not_purchased")) return local[t.id].status;
      if (access() === "purchased") return t.paperId ? "available" : "locked";
      return progress.testStatus[t.id] || "locked";
    }

    function render() {
      root.querySelectorAll("[data-ts-view]").forEach(function (b) {
        var on = (view || "not_purchased") === b.getAttribute("data-ts-view");
        b.setAttribute("aria-pressed", on ? "true" : "false");
        V.toggleClasses(b, "border-ivory text-ivory", on);
        V.toggleClasses(b, "border-[var(--line-d)] text-mute-d hover:text-ivory", !on);
      });

      var resumable = null;
      tests.forEach(function (t) {
        var status = statusOf(t);
        if (!resumable && status === "in_progress") resumable = t;
        var score = local[t.id] ? local[t.id].score : null;
        var sig = status + "|" + (score || "");
        var li = rowEls[t.id];
        if (li && rendered[t.id] !== sig) {
          li.innerHTML = rowHtml(t, status, score, data.hrefs[t.id]);
          rendered[t.id] = sig;
        }
      });

      var banner = root.querySelector("[data-ts-resume]");
      banner.hidden = !resumable;
      if (resumable) {
        banner.querySelector("[data-ts-resume-title]").textContent = resumable.title;
        banner.querySelector("[data-ts-resume-link]").setAttribute("href", data.hrefs[resumable.id].attempt);
      }

      var purchased = access() === "purchased";
      root.querySelector("[data-ts-access-kicker]").textContent = purchased ? "Your series" : "Access";
      var state = root.querySelector("[data-ts-access-state]");
      state.textContent = purchased ? "Purchased" : "Not purchased";
      V.toggleClasses(state, "text-ok", purchased);
      V.toggleClasses(state, "text-ivory", !purchased);
      root.querySelector("[data-ts-access-title]").textContent = purchased ? "Your progress" : "Unlock every test";
      root.querySelector('[data-ts-access="purchased"]').hidden = !purchased;
      root.querySelector('[data-ts-access="not_purchased"]').hidden = purchased;
    }

    root.querySelectorAll("[data-ts-view]").forEach(function (b) {
      b.addEventListener("click", function () {
        view = b.getAttribute("data-ts-view");
        render();
      });
    });

    render();
  }

  V.ready(function () {
    document.querySelectorAll("[data-ts-series]").forEach(init);
  });
})();
