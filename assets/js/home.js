/*
 * Homepage behaviour (the original "use client" sections): the hero ruler, the pinned
 * examination journey and its exam chooser, the courses / test series / enquiry form that
 * follow the chosen exam (Vidyansh.setExam / onExam), the sample test console, the method
 * layers, the question of the day, the constellation canvas and the rising dawn.
 */
(function () {
  "use strict";

  var V = window.Vidyansh;

  /* Replace one set of classes with another. */
  function swap(el, onCls, offCls, on) {
    V.toggleClasses(el, on ? offCls : onCls, false);
    V.toggleClasses(el, on ? onCls : offCls, true);
  }

  function each(root, sel, fn) {
    Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn);
  }

  function mediaQuery(query, fn) {
    var mq = window.matchMedia(query);
    var update = function () {
      fn(mq.matches);
    };
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
  }

  /* ---------- Hero ruler: the gold diamond tracks progress to the end of the journey ---------- */
  function initRuler() {
    var gem = document.querySelector("[data-journey-gem]");
    var journey = document.getElementById("journey");
    if (!gem || !journey) return;
    var onScroll = function () {
      var end = journey.offsetTop + journey.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end)));
      gem.style.left = p * 100 + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Examination journey ---------- */
  var BACKGROUNDS = ["#f4eee2", "#e5ddcd", "#d8cfbd", "#c9beaa", "#f4eee2"];
  var RAIL = {
    activeDark: "text-ink",
    activeLight: "text-ivory",
    idleDark: "text-mute-l",
    idleLight: "text-mute-d",
  };

  function initJourney() {
    var section = document.querySelector("[data-journey]");
    if (!section) return;
    var data = JSON.parse(section.querySelector("[data-journey-data]").textContent);
    var stages = data.stages;
    var exams = data.exams;
    var sticky = section.querySelector("[data-journey-sticky]");
    var rail = section.querySelector("[data-journey-rail]");
    var count = section.querySelector("[data-journey-count]");
    var chapters = stages.map(function (s) {
      return document.getElementById("chapter-" + s.id);
    });
    var pinned = false;
    var active = 0;

    function render() {
      var dark = pinned && active >= 3;
      section.setAttribute("data-pinned", pinned ? "true" : "false");
      rail.hidden = !pinned;
      count.hidden = !pinned;
      sticky.style.backgroundColor = pinned ? BACKGROUNDS[active] : "";
      chapters.forEach(function (c, i) {
        if (c) c.setAttribute("data-active", !pinned || i === active ? "true" : "false");
      });
      if (!pinned) return;
      each(rail, "[data-rail-link]", function (a, i) {
        var on = i === active;
        if (on) a.setAttribute("aria-current", "step");
        else a.removeAttribute("aria-current");
        V.toggleClasses(a, "text-ink text-ivory text-mute-l text-mute-d", false);
        a.classList.add(on ? (dark ? RAIL.activeDark : RAIL.activeLight) : dark ? RAIL.idleDark : RAIL.idleLight);
        a.querySelector("[data-rail-mark]").classList.toggle("bg-current", on);
      });
      count.textContent = "Chapter " + stages[active].number + " / 05";
      swap(count, "text-mute-l", "text-mute-d", dark);
    }

    function onScroll() {
      if (!pinned) return;
      var total = section.offsetHeight - window.innerHeight;
      var p = Math.min(0.9999, Math.max(0, -section.getBoundingClientRect().top / total));
      var next = Math.floor(p * stages.length);
      if (next !== active) {
        active = next;
        render();
      }
    }

    /* Pin only on large screens with motion allowed; otherwise chapters stack as normal sections. */
    mediaQuery("(min-width: 64rem) and (min-height: 37.5rem) and (prefers-reduced-motion: no-preference)", function (m) {
      pinned = m;
      render();
      if (pinned) {
        var total = section.offsetHeight - window.innerHeight;
        var p = Math.min(0.9999, Math.max(0, -section.getBoundingClientRect().top / total));
        active = Math.floor(p * stages.length);
        render();
      }
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    function goTo(i) {
      var smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto";
      if (pinned) {
        var total = section.offsetHeight - window.innerHeight;
        window.scrollTo({ top: section.offsetTop + (total * (i + 0.5)) / stages.length, behavior: smooth });
      } else {
        var el = document.getElementById("chapter-" + stages[i].id);
        if (el) el.scrollIntoView({ behavior: smooth });
      }
    }

    /* Any link to a chapter (hero ruler, rail) scrolls to the right point of the pinned stage. */
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#chapter-"]');
      if (!a) return;
      var href = a.getAttribute("href");
      var i = -1;
      stages.forEach(function (s, k) {
        if ("#chapter-" + s.id === href) i = k;
      });
      if (i < 0) return;
      e.preventDefault();
      goTo(i);
    });

    initDirection(section, exams);
  }

  /* Chapter 02: the exam list and the compass. */
  function initDirection(section, exams) {
    var list = section.querySelector("[data-direction-list]");
    if (!list || !exams.length) return;
    var needle = section.querySelector("[data-compass-needle]");
    var name = section.querySelector("[data-compass-name]");
    var descriptor = section.querySelector("[data-compass-descriptor]");
    var hover = null;

    function byCode(code) {
      for (var i = 0; i < exams.length; i++) if (exams[i].code === code) return exams[i];
      return null;
    }

    function render() {
      var exam = V.getExam();
      var current = exam || exams[0].code;
      each(list, "[data-direction]", function (b) {
        var code = b.getAttribute("data-direction");
        var selected = current === code;
        b.setAttribute("aria-pressed", exam === code ? "true" : "false");
        swap(b.querySelector("[data-direction-name]"), "translate-x-3 text-ivory", "text-mute-d", selected);
        swap(b.querySelector("[data-direction-brg]"), "text-ivory", "text-mute-d", selected);
      });
      var shown = byCode(hover || exam || exams[0].code) || exams[0];
      if (needle) needle.style.transform = "rotate(" + shown.bearing + "deg)";
      if (name.textContent !== shown.name) name.textContent = shown.name;
      if (descriptor.textContent !== shown.descriptor) descriptor.textContent = shown.descriptor;
    }

    list.addEventListener("mouseleave", function () {
      hover = null;
      render();
    });
    each(list, "[data-direction]", function (b) {
      var code = b.getAttribute("data-direction");
      b.addEventListener("click", function () {
        V.setExam(code);
      });
      b.addEventListener("mouseenter", function () {
        hover = code;
        render();
      });
      b.addEventListener("focus", function () {
        hover = code;
        render();
      });
      b.addEventListener("blur", function () {
        hover = null;
        render();
      });
    });
    V.onExam(render);
  }

  /* ---------- Everything that follows the chosen exam ---------- */
  function initExamFollowers() {
    each(document, "[data-exam-select]", function (sel) {
      sel.addEventListener("change", function () {
        V.setExam(sel.value || null);
      });
    });
    each(document, "[data-set-exam]", function (a) {
      a.addEventListener("click", function () {
        V.setExam(a.getAttribute("data-set-exam") || null);
      });
    });

    function render(exam) {
      each(document, "[data-exam-select]", function (sel) {
        sel.value = exam || "";
      });
      /* Courses: the "Your exam" mark. */
      each(document, "[data-your-exam]", function (el) {
        el.hidden = exam !== el.getAttribute("data-your-exam");
      });
      /* Test series board: highlight the rows for the chosen exam. */
      each(document, "[data-series-exam]", function (tr) {
        var mine = exam !== null && tr.getAttribute("data-series-exam") === exam;
        tr.classList.toggle("bg-ivory/[0.04]", mine);
        var td = tr.querySelector("[data-series-first]");
        if (td) V.toggleClasses(td, "pl-4 shadow-[inset_1px_0_0_var(--color-ivory)]", mine);
      });
    }
    V.onExam(render);
    render(V.getExam());
  }

  /* ---------- Sample test console ---------- */
  function initConsole() {
    var fig = document.querySelector("[data-test-console]");
    if (!fig) return;
    var clock = fig.querySelector("[data-console-clock]");
    var seconds = 2 * 3600;
    var pad = function (n) {
      return String(n).padStart(2, "0");
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setInterval(function () {
        seconds = seconds > 0 ? seconds - 1 : 7200;
        clock.textContent = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map(pad).join(":");
      }, 1000);
    }
    var labels = fig.querySelectorAll("[data-console-option]");
    function render() {
      each(fig, "[data-console-option]", function (label) {
        var input = label.querySelector("input");
        var on = input.checked;
        swap(label, "border-ivory", "border-[var(--line-d)] hover:border-ivory/30", on);
        swap(input.nextElementSibling, "border-ivory bg-ivory shadow-[inset_0_0_0_3px_var(--color-charcoal)]", "border-mute-d", on);
      });
    }
    Array.prototype.forEach.call(labels, function (label) {
      label.querySelector("input").addEventListener("change", render);
    });
  }

  /* ---------- Methodology: active layer and the exploded drawing ---------- */
  function initMethod() {
    var section = document.querySelector("[data-method]");
    if (!section) return;
    var stage = section.querySelector("[data-method-stage]");
    var plates = section.querySelectorAll("[data-plate]");
    var active = 0;
    var exploded = false;

    function render() {
      each(section, "[data-method-layer]", function (b, i) {
        var on = active === i;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        swap(b.querySelector("[data-layer-code]"), "text-ivory", "text-mute-d", on);
        swap(b.querySelector("[data-layer-title]"), "text-ivory italic", "text-ivory/70 group-hover:text-ivory", on);
        swap(b.querySelector("[data-layer-body]"), "grid-rows-[1fr] opacity-100", "grid-rows-[0fr] opacity-0", on);
      });
      Array.prototype.forEach.call(plates, function (g, i) {
        var gap = exploded ? 74 : 26;
        g.setAttribute("data-active", active === i ? "true" : "false");
        g.style.transform = "translateY(" + (365 - i * gap) + "px)";
      });
    }

    each(section, "[data-method-layer]", function (b, i) {
      var set = function () {
        if (active === i) return;
        active = i;
        render();
      };
      b.addEventListener("mouseenter", set);
      b.addEventListener("focus", set);
      b.addEventListener("click", set);
    });

    if ("IntersectionObserver" in window && stage) {
      var io = new IntersectionObserver(
        function (entries) {
          exploded = entries[0].isIntersecting;
          render();
        },
        { threshold: 0.35 }
      );
      io.observe(stage);
    }
  }

  /* ---------- Question of the day ---------- */
  function initDailyQuestion() {
    var fs = document.querySelector("[data-daily-question]");
    if (!fs) return;
    var feedback = fs.querySelector("[data-daily-feedback]");
    var answer = feedback.getAttribute("data-answer");
    var buttons = fs.querySelectorAll("[data-option]");
    var STATE = {
      right: "border-[#4f6a3c] bg-[#4f6a3c]/10",
      wrong: "border-[#9b4a33] bg-[#9b4a33]/10",
      idle: "border-[var(--line-l)] enabled:hover:border-ink",
    };
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-option");
        Array.prototype.forEach.call(buttons, function (b) {
          var key = b.getAttribute("data-option");
          var state = b.getAttribute("data-correct") === "true" ? "right" : picked === key ? "wrong" : "idle";
          b.disabled = true;
          b.setAttribute("aria-pressed", picked === key ? "true" : "false");
          V.toggleClasses(b, STATE.right + " " + STATE.wrong + " " + STATE.idle, false);
          V.toggleClasses(b, STATE[state], true);
        });
        var p = document.createElement("p");
        var strong = document.createElement("strong");
        strong.className = "font-semibold text-ink";
        strong.textContent = picked === answer ? "Correct." : "The answer is " + answer + ".";
        p.appendChild(strong);
        p.appendChild(document.createTextNode(" " + feedback.getAttribute("data-explanation")));
        feedback.textContent = "";
        feedback.appendChild(p);
      });
    });
  }

  /* ---------- Community: a night sky of aspirants ---------- */
  function initConstellation() {
    var canvas = document.querySelector("[data-constellation]");
    var ctx = canvas && canvas.getContext("2d");
    if (!canvas || !ctx) return;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var w = 0,
      h = 0,
      raf = 0,
      visible = false;
    var stars = [];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((w * h) / 9000);
      var seed = 7;
      var rand = function () {
        return (seed = (seed * 16807) % 2147483647) / 2147483647;
      };
      stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: rand() * w, y: rand() * h, r: rand() * 1.3 + 0.3, p: rand() * Math.PI * 2 });
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(244,238,226,0.07)";
      ctx.lineWidth = 0.6;
      for (var i = 0; i < stars.length; i++) {
        for (var j = i + 1; j < Math.min(i + 6, stars.length); j++) {
          var a = stars[i],
            b = stars[j];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (var k = 0; k < stars.length; k++) {
        var s = stars[k];
        var tw = still ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(t / 1400 + s.p));
        ctx.fillStyle = s.r > 1.25 ? "rgba(244,238,226," + tw + ")" : "rgba(244,238,226," + tw * 0.7 + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(t) {
      draw(t);
      if (visible && !still) raf = requestAnimationFrame(loop);
    }

    resize();
    draw(0);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (visible && !still) raf = requestAnimationFrame(loop);
      });
      io.observe(canvas);
    }
    window.addEventListener("resize", function () {
      resize();
      draw(performance.now());
    });
  }

  /* ---------- Start your journey: the rising dawn and the enquiry form ---------- */
  function initStart() {
    var section = document.querySelector("[data-start]");
    if (!section) return;
    var dawn = section.querySelector("[data-dawn]");

    if (dawn && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var raf = 0;
      var update = function () {
        var r = section.getBoundingClientRect();
        var rise = Math.min(Math.max((window.innerHeight - r.top) / (window.innerHeight + r.height * 0.4), 0), 1);
        dawn.style.transform = "translateY(" + (1 - rise) * 35 + "%)";
        dawn.style.opacity = String(0.35 + rise * 0.65);
      };
      update();
      window.addEventListener(
        "scroll",
        function () {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(update);
        },
        { passive: true }
      );
    }

    var form = section.querySelector("[data-start-form]");
    var done = section.querySelector("[data-start-done]");
    if (!form || !done) return;
    var OK = "border-ivory/30 focus:border-ivory";
    var BAD = "border-bad";

    function setError(name, message) {
      var input = form.querySelector('[name="' + name + '"]');
      var id = input.id;
      var err = document.getElementById(id + "-err");
      input.setAttribute("aria-invalid", message ? "true" : "false");
      swap(input, BAD, OK, !!message);
      if (message) {
        input.setAttribute("aria-describedby", id + "-err");
        if (!err) {
          err = document.createElement("p");
          err.id = id + "-err";
          err.className = "text-sm text-bad";
          input.parentNode.appendChild(err);
        }
        err.textContent = message;
      } else {
        input.removeAttribute("aria-describedby");
        if (err) err.remove();
      }
    }

    function showDone(on) {
      done.hidden = !on;
      form.hidden = on;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var errors = {};
      if (String(data.get("name") || "").trim().length < 2) errors.name = "Please enter your name.";
      if (
        !/^[6-9]\d{9}$/.test(
          String(data.get("phone") || "")
            .replace(/[\s-]/g, "")
            .replace(/^(\+?91)/, "")
        )
      )
        errors.phone = "Enter a 10-digit Indian mobile number.";
      setError("name", errors.name);
      setError("phone", errors.phone);
      var keys = Object.keys(errors);
      if (keys.length) {
        form.querySelector('[name="' + keys[0] + '"]').focus();
        return;
      }
      /* Send the enquiry to /contact in the background; if that fails, post the form normally. */
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
        credentials: "same-origin",
      })
        .then(function (res) {
          if (!res.ok) throw new Error(String(res.status));
        })
        .catch(function () {
          HTMLFormElement.prototype.submit.call(form);
        });
      showDone(true);
    });

    section.querySelector("[data-start-edit]").addEventListener("click", function () {
      /* The original re-creates the form: name and number start empty again, the exam stays. */
      form.querySelector('[name="name"]').value = "";
      form.querySelector('[name="phone"]').value = "";
      showDone(false);
    });
  }

  V.ready(function () {
    initRuler();
    initJourney();
    initExamFollowers();
    initConsole();
    initMethod();
    initDailyQuestion();
    initConstellation();
    initStart();
  });
})();
