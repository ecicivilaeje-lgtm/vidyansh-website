/*
 * The report card (the original ResultView). Score, accuracy, time and subject accuracy are
 * computed from this student's own answers saved on this device. Rank and percentile need every
 * candidate's results, so they stay "—" until the results API exists.
 */
(function () {
  "use strict";

  var V = window.Vidyansh;
  var A = V.attempt;
  var esc = A.esc;

  function pct(v) {
    return v === null ? "—" : Math.round(v * 100) + "%";
  }

  var FILTER_ON = "border px-3 py-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors border-ivory text-ivory";
  var FILTER_OFF = "border px-3 py-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors border-[var(--line-d)] text-mute-d hover:text-ivory";

  function solutionHtml(q, i, given) {
    var verdict = given === null ? "Skipped" : given === q.answer ? "Correct" : "Wrong";
    var tone = given === null ? "text-mute-d border-[var(--line-d)]" : given === q.answer ? "text-ok border-ok/50" : "text-bad border-bad/50";
    return (
      '<li class="border-b border-[var(--line-d)] py-7">' +
      '<div class="flex flex-wrap items-center gap-3">' +
      '<span class="font-mono text-xs text-mute-d">Q' + A.pad2(i + 1) + "</span>" +
      '<span class="eyebrow">' + esc(q.subject) + "</span>" +
      '<span class="border px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] uppercase ' + tone + '">' + verdict + "</span></div>" +
      '<p class="mt-3 font-display text-[1.4rem] leading-snug">' + esc(q.text) + "</p>" +
      '<ul class="mt-4 grid gap-2 sm:grid-cols-2">' +
      q.options
        .map(function (o, k) {
          var right = k === q.answer;
          var picked = k === given;
          var box = right ? "border-ok/60 bg-ok/[0.08]" : picked ? "border-bad/60 bg-bad/[0.08]" : "border-[var(--line-d)]";
          return (
            '<li class="flex items-center gap-3 border px-3 py-2.5 ' + box + '">' +
            '<span class="font-mono text-[0.6875rem] text-mute-d">' + String.fromCharCode(65 + k) + "</span>" +
            '<span class="font-display text-lg">' + esc(o) + "</span>" +
            (right || picked
              ? '<span class="ml-auto font-mono text-[0.5625rem] tracking-[0.12em] uppercase ' + (right ? "text-ok" : "text-bad") + '">' +
                (right ? (picked ? "Your answer · correct" : "Correct") : "Your answer") + "</span>"
              : "") +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      '<p class="mt-4 border-l border-ivory/40 pl-4 text-[0.9375rem] text-body-d">' + esc(q.explanation) + "</p>" +
      "</li>"
    );
  }

  function init(root) {
    var paper = A.readJson(root.querySelector("[data-ts-paper]"));
    if (!paper) return;
    var d = function (k) {
      return root.getAttribute("data-" + k);
    };
    var testId = d("test-id");
    var testTitle = d("test-title");
    var saved = A.load(testId);
    var a = saved && saved.submittedAt ? saved : null;
    var loading = root.querySelector("[data-ts-result-loading]");
    var holder = document.createElement("div");

    if (a === null) {
      holder.innerHTML =
        '<div class="container-v max-w-2xl py-20">' +
        '<h1 class="text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.92]">No result yet</h1>' +
        '<p class="mt-6 text-body-d">There is no submitted attempt for ' + esc(testTitle) + " on this device. Results from your account will appear here once student sign-in is live.</p>" +
        '<a href="' + esc(d("test-href")) + '" class="link-underline mt-8 inline-block font-mono text-xs tracking-[0.16em] uppercase">Take the test →</a>' +
        "</div>";
      loading.replaceWith.apply(loading, Array.prototype.slice.call(holder.childNodes));
      return;
    }

    var s = A.score(paper, a);
    var n = paper.questions.length;
    var weakest = s.bySubject.slice().sort(function (x, y) {
      return x.correct / x.total - y.correct / y.total || y.total - x.total;
    })[0];
    var filter = "all";

    var metrics = [
      { k: "Accuracy", v: pct(s.accuracy), note: "Correct out of attempted" },
      { k: "Time taken", v: A.formatDuration(s.timeTakenSec), note: "of " + paper.durationMin + " min" },
      { k: "Rank", v: "—", note: "When the series is live" },
      { k: "Percentile", v: "—", note: "When the series is live" },
    ];
    var filters = [
      ["all", "All " + n],
      ["wrong", "Wrong " + s.wrong],
      ["skipped", "Skipped " + s.skipped],
    ];

    holder.innerHTML =
      '<section aria-labelledby="report-title" class="bg-ink pb-[clamp(3.5rem,7vw,6rem)]"><div class="container-v">' +
      '<p class="eyebrow text-ivory">Report card · ' + esc(d("series-name")) + "</p>" +
      '<h1 id="report-title" class="mt-4 text-[clamp(2.75rem,5.6vw,5.25rem)] leading-[0.9] tracking-[-0.025em]">' + esc(testTitle) + "</h1>" +
      '<div class="mt-12 grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16">' +
      '<div class="grid content-between gap-6 border-t border-ivory/40 pt-5">' +
      '<span class="eyebrow">Score</span>' +
      '<p class="flex items-baseline gap-3 font-display leading-none tabular-nums"><span class="text-[clamp(4.5rem,9vw,7.5rem)] text-ivory">' + s.score + '</span><span class="text-3xl text-mute-d">/ ' + s.maxScore + "</span></p>" +
      "<div>" +
      '<div class="flex h-2 overflow-hidden" role="img" aria-label="' + s.correct + " correct, " + s.wrong + " wrong, " + s.skipped + ' skipped">' +
      '<span class="bg-ok" style="width:' + (s.correct / n) * 100 + '%"></span>' +
      '<span class="bg-bad" style="width:' + (s.wrong / n) * 100 + '%"></span>' +
      '<span class="bg-ivory/15" style="width:' + (s.skipped / n) * 100 + '%"></span></div>' +
      '<p class="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">' +
      '<span class="text-ok">' + s.correct + ' correct</span><span class="text-bad">' + s.wrong + ' wrong</span><span class="text-mute-d">' + s.skipped + " skipped</span></p>" +
      "</div></div>" +
      '<dl class="grid grid-cols-2 gap-x-8 lg:grid-cols-4">' +
      metrics
        .map(function (m) {
          return (
            '<div class="grid content-between gap-6 border-t border-ivory/40 pt-5 pb-8"><dt class="eyebrow">' + m.k + "</dt><dd>" +
            '<span class="' + (m.v === "—" ? "block font-display text-[clamp(2.25rem,3.4vw,3rem)] leading-none tabular-nums text-ivory/40" : "block font-display text-[clamp(2.25rem,3.4vw,3rem)] leading-none tabular-nums") + '">' + esc(m.v) + "</span>" +
            '<span class="mt-2 block text-xs text-mute-d">' + esc(m.note) + "</span></dd></div>"
          );
        })
        .join("") +
      "</dl></div>" +
      '<p class="mt-4 max-w-[70ch] text-xs text-mute-d">Rank and percentile compare you with every Vidyansh student who took the same test, so they appear once the series is live. Everything else above comes from your own answers.</p>' +
      "</div></section>" +
      '<section aria-labelledby="subjects-title" class="border-t border-[var(--line-d)] bg-night py-[clamp(3.5rem,7vw,6rem)]"><div class="container-v grid gap-10 lg:grid-cols-[1fr_1.5fr]"><div>' +
      '<h2 id="subjects-title" class="text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95]">By <em class="font-normal text-ivory">subject</em></h2>' +
      (weakest
        ? '<div class="mt-8 border-l-2 border-ivory pl-4"><p class="eyebrow">Recommended next</p>' +
          '<p class="mt-2 font-display text-[1.5rem] leading-snug">Revise ' + esc(weakest.subject.toLowerCase()) + " with Shubham Sir’s concept class, then take the next test.</p>" +
          '<a href="' + esc(d("courses-href")) + '" class="link-underline mt-3 inline-block font-mono text-[0.6875rem] tracking-[0.16em] text-ivory uppercase">Find the course →</a></div>'
        : "") +
      "</div>" +
      '<ul class="border-t border-[var(--line-d)]">' +
      s.bySubject
        .map(function (b) {
          var acc = b.attempted ? b.correct / b.attempted : null;
          return (
            '<li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2.5 border-b border-[var(--line-d)] py-4">' +
            '<span class="font-display text-[1.35rem]">' + esc(b.subject) + "</span>" +
            '<span class="font-mono text-[0.75rem] tabular-nums text-body-d">' + b.correct + "/" + b.total + " correct · " + pct(acc) + " accuracy</span>" +
            '<span class="col-span-2 h-1.5 bg-ivory/10" aria-hidden="true"><span class="block h-full bg-ivory" style="width:' + (b.correct / b.total) * 100 + '%"></span></span>' +
            "</li>"
          );
        })
        .join("") +
      "</ul></div></section>" +
      '<section id="solutions" aria-labelledby="solutions-title" class="border-t border-[var(--line-d)] bg-ink py-[clamp(3.5rem,7vw,6rem)]"><div class="container-v max-w-4xl">' +
      '<div class="flex flex-wrap items-end justify-between gap-4"><h2 id="solutions-title" class="text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95]">Solutions</h2>' +
      '<div role="group" aria-label="Show" class="flex gap-1.5">' +
      filters
        .map(function (f) {
          return '<button type="button" data-ts-filter="' + f[0] + '" aria-pressed="' + (f[0] === "all") + '" class="' + (f[0] === "all" ? FILTER_ON : FILTER_OFF) + '">' + f[1] + "</button>";
        })
        .join("") +
      "</div></div>" +
      '<ol data-ts-solutions class="mt-8 border-t border-[var(--line-d)]"></ol>' +
      '<div class="mt-10 flex flex-wrap gap-3">' +
      '<button type="button" data-ts-reattempt class="inline-flex items-center border border-ivory/30 px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-colors hover:border-ivory hover:text-ivory">Reattempt</button>' +
      '<a href="' + esc(d("access-href")) + '" class="inline-flex items-center gap-3 border border-ivory bg-ivory px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ink uppercase transition-colors hover:bg-transparent hover:text-ivory">Unlock the full series</a>' +
      "</div></div></section>";

    var list = holder.querySelector("[data-ts-solutions]");
    var buttons = Array.prototype.slice.call(holder.querySelectorAll("[data-ts-filter]"));

    function renderList() {
      var html = "";
      var count = 0;
      paper.questions.forEach(function (q, i) {
        var given = a.answers[i] === undefined ? null : a.answers[i];
        var show = filter === "all" ? true : filter === "skipped" ? given === null : given !== null && given !== q.answer;
        if (!show) return;
        count++;
        html += solutionHtml(q, i, given);
      });
      if (count === 0) html += '<li class="py-8 text-body-d">Nothing to show here.</li>';
      list.innerHTML = html;
      buttons.forEach(function (b) {
        var on = b.getAttribute("data-ts-filter") === filter;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.className = on ? FILTER_ON : FILTER_OFF;
      });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-ts-filter");
        renderList();
      });
    });
    holder.querySelector("[data-ts-reattempt]").addEventListener("click", function () {
      A.clear(testId);
      window.location.assign(d("test-href"));
    });
    renderList();

    loading.replaceWith.apply(loading, Array.prototype.slice.call(holder.childNodes));
  }

  V.ready(function () {
    document.querySelectorAll("[data-ts-result]").forEach(init);
  });
})();
