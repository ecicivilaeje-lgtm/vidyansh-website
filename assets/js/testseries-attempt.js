/*
 * Test attempts, kept on this device until the attempts API exists (the original lib/attempt.ts,
 * same localStorage keys). Every figure derived here comes from the student's own answers;
 * nothing is invented. Exposed as window.Vidyansh.attempt.
 */
(function () {
  "use strict";

  var V = (window.Vidyansh = window.Vidyansh || {});

  function key(testId) {
    return "vidyansh:attempt:" + testId;
  }

  function loadAttempt(testId) {
    try {
      var raw = window.localStorage.getItem(key(testId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveAttempt(testId, state) {
    try {
      window.localStorage.setItem(key(testId), JSON.stringify(state));
    } catch (e) {
      /* storage unavailable: the attempt still works for this page view */
    }
  }

  function clearAttempt(testId) {
    try {
      window.localStorage.removeItem(key(testId));
    } catch (e) {
      /* ignore */
    }
  }

  function fill(n, v) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(typeof v === "function" ? v(i) : v);
    return a;
  }

  function newAttempt(paper) {
    var n = paper.questions.length;
    return {
      paperId: paper.id,
      startedAt: Date.now(),
      answers: fill(n, null),
      marked: fill(n, false),
      visited: fill(n, function (i) {
        return i === 0;
      }),
      current: 0,
      submittedAt: null,
    };
  }

  function scoreAttempt(paper, a) {
    var correct = 0;
    var wrong = 0;
    var order = [];
    var subjects = {};
    paper.questions.forEach(function (q, i) {
      var s = subjects[q.subject];
      if (!s) {
        s = subjects[q.subject] = { correct: 0, attempted: 0, total: 0 };
        order.push(q.subject);
      }
      s.total += 1;
      var ans = a.answers[i];
      if (ans !== null && ans !== undefined) {
        s.attempted += 1;
        if (ans === q.answer) {
          correct += 1;
          s.correct += 1;
        } else wrong += 1;
      }
    });
    var attempted = correct + wrong;
    var end = a.submittedAt != null ? a.submittedAt : Date.now();
    return {
      score: correct * paper.marking.correct + wrong * paper.marking.wrong,
      maxScore: paper.questions.length * paper.marking.correct,
      correct: correct,
      wrong: wrong,
      skipped: paper.questions.length - attempted,
      accuracy: attempted ? correct / attempted : null,
      timeTakenSec: Math.min(Math.round((end - a.startedAt) / 1000), paper.durationMin * 60),
      bySubject: order.map(function (subject) {
        var v = subjects[subject];
        return { subject: subject, correct: v.correct, attempted: v.attempted, total: v.total };
      }),
    };
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDuration(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + "m " + pad2(s) + "s";
  }

  function formatClock(sec) {
    return [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), sec % 60].map(pad2).join(":");
  }

  /* Escapes text for building markup in the test-series scripts. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Reads a <script type="application/json"> block. */
  function readJson(el) {
    try {
      return el ? JSON.parse(el.textContent) : null;
    } catch (e) {
      return null;
    }
  }

  V.attempt = {
    load: loadAttempt,
    save: saveAttempt,
    clear: clearAttempt,
    create: newAttempt,
    score: scoreAttempt,
    formatDuration: formatDuration,
    formatClock: formatClock,
    pad2: pad2,
    esc: esc,
    readJson: readJson,
  };
})();
