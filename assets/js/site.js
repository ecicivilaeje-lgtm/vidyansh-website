/*
 * Behaviour shared by every page: the header, the menu dialog, reveal-on-scroll,
 * and the visitor's chosen exam (the original ExamProvider).
 * Page-specific scripts live beside this file and register with Vidyansh.ready().
 */
(function () {
  "use strict";

  var V = (window.Vidyansh = window.Vidyansh || {});

  V.ready = function (fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  V.reducedMotion = function () {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  /* ---- Chosen exam, shared by homepage sections. Listen with V.onExam(fn). ---- */
  var exam = null;
  V.getExam = function () {
    return exam;
  };
  V.setExam = function (code) {
    exam = code || null;
    document.dispatchEvent(new CustomEvent("vidyansh:exam", { detail: exam }));
  };
  V.onExam = function (fn) {
    document.addEventListener("vidyansh:exam", function (e) {
      fn(e.detail);
    });
  };

  /* Toggle a space-separated list of classes. */
  V.toggleClasses = function (el, classes, on) {
    classes.split(/\s+/).filter(Boolean).forEach(function (c) {
      el.classList.toggle(c, on);
    });
  };

  function initHeader() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;
    var home = header.getAttribute("data-home") === "true";
    var cta = header.querySelector("[data-header-cta]");
    var scrolledCls = header.getAttribute("data-scrolled-class");
    var topCls = header.getAttribute("data-top-class");
    var lastY = 0;
    var menuOpen = false;

    function onScroll() {
      var y = window.scrollY;
      var scrolled = !home || y > window.innerHeight * 0.6;
      var hidden = y > lastY && y > window.innerHeight;
      V.toggleClasses(header, scrolledCls, scrolled);
      V.toggleClasses(header, topCls, !scrolled);
      header.classList.toggle("-translate-y-full", hidden && !menuOpen);
      if (cta) {
        V.toggleClasses(cta, "opacity-100", scrolled);
        V.toggleClasses(cta, "pointer-events-none opacity-0", !scrolled);
      }
      lastY = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var openBtn = header.querySelector("[data-menu-open]");
    var panel = document.getElementById("site-menu");
    if (!openBtn || !panel) return;
    var closeBtn = panel.querySelector("[data-menu-close]");

    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        var f = panel.querySelectorAll("a, button");
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    function open() {
      menuOpen = true;
      panel.hidden = false;
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      header.classList.remove("-translate-y-full");
      closeBtn.focus();
      document.addEventListener("keydown", onKey);
    }
    function close(silent) {
      menuOpen = false;
      panel.hidden = true;
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (!silent) openBtn.focus();
    }
    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", function () {
      close();
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        close(true);
      });
    });
  }

  /* Settles content into place as it enters the viewport. Resting state is visible. */
  V.initReveal = function (root) {
    if (!("IntersectionObserver" in window) || V.reducedMotion()) return;
    (root || document).querySelectorAll("[data-reveal]").forEach(function (el) {
      if (el.__revealed) return;
      el.__revealed = true;
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) return;
      el.setAttribute("data-shown", "false");
      var io = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            el.setAttribute("data-shown", "true");
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
    });
  };

  V.ready(function () {
    initHeader();
    V.initReveal();
  });
})();
