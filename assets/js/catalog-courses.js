/*
 * Course index (the original CourseIndex): exam and mode filters, the "Showing NN of NN" count,
 * and the plate preview that follows the pointer on devices with a fine hovering pointer.
 */
(function () {
  "use strict";

  var PREVIEW_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
  var ON = "text-ink italic";
  var OFF = "text-mute-l hover:text-ink";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function init(root) {
    var V = window.Vidyansh;
    var filter = { exam: "", mode: "" };
    var active = null;
    var buttons = root.querySelectorAll("[data-filter]");
    var items = Array.prototype.slice.call(root.querySelectorAll("[data-course-list] > li"));
    var list = root.querySelector("[data-course-list]");
    var count = root.querySelector("[data-count]");
    var empty = root.querySelector("[data-course-empty]");
    var tpl = root.querySelector("template[data-course-preview]");
    var total = items.length;
    var frame = null;
    var mq = window.matchMedia(PREVIEW_QUERY);

    function matches(li) {
      return (!filter.exam || li.getAttribute("data-exam") === filter.exam) && (!filter.mode || li.getAttribute("data-mode") === filter.mode);
    }

    function renderFrame() {
      if (!frame) return;
      var shown = active && items.some(function (li) {
        return li.getAttribute("data-slug") === active && matches(li);
      });
      V.toggleClasses(frame, "opacity-100", !!shown);
      V.toggleClasses(frame, "opacity-0", !shown);
      frame.querySelectorAll("[data-preview]").forEach(function (p) {
        var on = p.getAttribute("data-preview") === active;
        V.toggleClasses(p, "opacity-100", on);
        V.toggleClasses(p, "opacity-0", !on);
      });
    }

    function render() {
      var shown = 0;
      items.forEach(function (li) {
        var on = matches(li);
        li.hidden = !on;
        if (on) shown++;
      });
      buttons.forEach(function (b) {
        var on = filter[b.getAttribute("data-filter")] === b.getAttribute("data-value");
        b.setAttribute("aria-pressed", on ? "true" : "false");
        V.toggleClasses(b, OFF, !on);
        V.toggleClasses(b, ON, on);
        var mark = b.firstElementChild;
        V.toggleClasses(mark, "bg-ink", on);
        V.toggleClasses(mark, "bg-transparent", !on);
      });
      count.textContent = "Showing " + pad(shown) + " of " + pad(total);
      empty.hidden = shown !== 0;
      renderFrame();
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        filter[b.getAttribute("data-filter")] = b.getAttribute("data-value");
        render();
      });
    });
    root.querySelector("[data-clear-filters]").addEventListener("click", function () {
      filter = { exam: "", mode: "" };
      render();
    });

    function place(e) {
      if (!frame) return;
      var w = frame.offsetWidth;
      var h = frame.offsetHeight;
      var gap = 36;
      var x = e.clientX + gap;
      if (x + w > window.innerWidth - 16) x = e.clientX - gap - w;
      var y = Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16);
      frame.style.transform = "translate3d(" + Math.round(x) + "px, " + Math.round(y) + "px, 0)";
    }

    items.forEach(function (li) {
      li.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        place(e);
        active = li.getAttribute("data-slug");
        renderFrame();
      });
      li.addEventListener("pointermove", function (e) {
        if (frame) place(e);
      });
    });
    list.addEventListener("pointerleave", function () {
      active = null;
      renderFrame();
    });

    // The preview exists only while the device can hover with a fine pointer and motion is welcome.
    function syncPreview() {
      if (mq.matches && !frame && tpl) {
        frame = tpl.content.firstElementChild.cloneNode(true);
        root.appendChild(frame);
        renderFrame();
      } else if (!mq.matches && frame) {
        frame.remove();
        frame = null;
      }
    }
    syncPreview();
    mq.addEventListener("change", syncPreview);
  }

  window.Vidyansh.ready(function () {
    document.querySelectorAll("[data-course-index]").forEach(init);
  });
})();
