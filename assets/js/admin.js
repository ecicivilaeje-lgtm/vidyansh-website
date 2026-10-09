/*
 * Admin panel behaviour: the menu on phones, repeatable rows (add, remove, reorder),
 * photo and PDF uploads, the article editor, and naming every field before the form is sent.
 */
(function () {
  "use strict";

  var token = document.querySelector('meta[name="csrf-token"]');
  token = token ? token.content : "";
  var uploadUrl = (document.querySelector('meta[name="upload-url"]') || {}).content;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---- Field names: worked out from where each field sits in the form ---- */
  function pathOf(el, form) {
    var segs = [];
    var own = el.getAttribute("data-k");
    if (own) segs.unshift(own);
    var node = el.parentElement;
    while (node && node !== form) {
      if (node.hasAttribute("data-row")) {
        var rows = Array.prototype.filter.call(node.parentElement.children, function (c) {
          return c.hasAttribute("data-row");
        });
        segs.unshift(String(rows.indexOf(node)));
      } else if (node.hasAttribute("data-kind") && node.getAttribute("data-k")) {
        segs.unshift(node.getAttribute("data-k"));
      }
      node = node.parentElement;
    }
    return segs;
  }

  function nameFields(form) {
    form.querySelectorAll("input[data-k], select[data-k], textarea[data-k]").forEach(function (el) {
      var segs = pathOf(el, form);
      var name = "f" + segs.map(function (s) {
        return "[" + s + "]";
      }).join("");
      if (el.hasAttribute("data-multi")) name += "[]";
      el.name = name;
    });
  }

  /* ---- Repeatable rows ---- */
  function refreshRepeater(rep) {
    var list = rep.querySelector(":scope > [data-rows]");
    if (!list) return;
    var rows = Array.prototype.filter.call(list.children, function (c) {
      return c.hasAttribute("data-row");
    });
    rows.forEach(function (row, i) {
      var no = row.querySelector(":scope [data-row-no]");
      if (no) no.textContent = String(i + 1).padStart(2, "0");
      var up = row.querySelector("[data-row-up]");
      var down = row.querySelector("[data-row-down]");
      if (up) up.disabled = i === 0;
      if (down) down.disabled = i === rows.length - 1;
    });
    var count = rep.querySelector(":scope > legend [data-count]");
    if (count) count.textContent = rows.length;
  }

  function initRepeaters(root) {
    root.querySelectorAll('[data-kind="repeater"]').forEach(refreshRepeater);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-row-add], [data-row-up], [data-row-down], [data-row-remove]");
    if (!btn) return;
    e.preventDefault();
    if (btn.hasAttribute("data-row-add")) {
      var rep = btn.closest('[data-kind="repeater"]');
      var tpl = rep.querySelector(":scope > template[data-row-template]");
      var list = rep.querySelector(":scope > [data-rows]");
      var clone = tpl.content.firstElementChild.cloneNode(true);
      list.appendChild(clone);
      initRepeaters(clone);
      initUploads(clone);
      refreshRepeater(rep);
      var first = clone.querySelector("input:not([type=hidden]), textarea, select");
      if (first) first.focus();
      return;
    }
    var row = btn.closest("[data-row]");
    var repeater = row.closest('[data-kind="repeater"]');
    if (btn.hasAttribute("data-row-remove")) {
      var hasContent = Array.prototype.some.call(row.querySelectorAll("input:not([type=hidden]):not([type=checkbox]), textarea"), function (i) {
        return i.value.trim() !== "";
      });
      if (hasContent && !window.confirm("Remove this item?")) return;
      var next = row.nextElementSibling || row.previousElementSibling;
      row.remove();
      refreshRepeater(repeater);
      var focusTarget = next ? next.querySelector("summary, textarea") : repeater.querySelector("[data-row-add]");
      if (focusTarget) focusTarget.focus();
    } else if (btn.hasAttribute("data-row-up") && row.previousElementSibling) {
      row.parentElement.insertBefore(row, row.previousElementSibling);
      refreshRepeater(repeater);
      btn.focus();
    } else if (btn.hasAttribute("data-row-down") && row.nextElementSibling) {
      row.parentElement.insertBefore(row.nextElementSibling, row);
      refreshRepeater(repeater);
      btn.focus();
    }
  });

  /* Keep a row's summary line in step with its first text. */
  document.addEventListener("input", function (e) {
    var row = e.target.closest("[data-row]");
    if (!row) return;
    var summary = row.querySelector(":scope > details > summary [data-row-summary]");
    if (!summary) return;
    var first = row.querySelector(":scope > details > div input[type=text], :scope > details > div textarea");
    if (first && first === e.target && first.value.trim()) summary.textContent = first.value.trim().slice(0, 70);
  });

  /* ---- Codes that follow another field ("Web address" from "Name") ---- */
  function slugify(s) {
    return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function initSlugs(form) {
    form.querySelectorAll("[data-slug-from]").forEach(function (slug) {
      var scope = slug.closest("[data-row]") || form;
      var src = scope.querySelector('[data-k="' + slug.getAttribute("data-slug-from") + '"]');
      if (!src) return;
      var touched = slug.value.trim() !== "";
      slug.addEventListener("input", function () {
        touched = slug.value.trim() !== "";
      });
      src.addEventListener("input", function () {
        if (!touched) slug.value = slugify(src.value);
      });
    });
  }

  /* ---- Photo and PDF uploads ---- */
  function initUploads(root) {
    root.querySelectorAll("[data-upload]").forEach(function (box) {
      if (box.__ready) return;
      box.__ready = true;
      var input = box.querySelector("[data-upload-input]");
      var value = box.querySelector("[data-upload-value]");
      var preview = box.querySelector("[data-upload-preview]");
      var status = box.querySelector("[data-upload-status]");
      var remove = box.querySelector("[data-upload-remove]");
      var kind = box.getAttribute("data-upload");

      function show(url, path) {
        preview.innerHTML = "";
        if (!path) {
          preview.innerHTML = '<span class="text-[0.9375rem] text-mute-d">Nothing uploaded yet</span>';
        } else if (kind === "image") {
          var img = document.createElement("img");
          img.src = url;
          img.alt = "";
          img.className = "max-h-40 w-auto border border-ivory/15 bg-white object-contain";
          preview.appendChild(img);
        } else {
          var a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener";
          a.className = "link-underline break-all text-[0.9375rem]";
          a.textContent = path.split("/").pop();
          preview.appendChild(a);
        }
        remove.hidden = !path;
      }

      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var data = new FormData();
        data.append("file", file);
        data.append("kind", kind);
        data.append("_token", token);
        status.textContent = "Uploading…";
        fetch(uploadUrl, { method: "POST", body: data, credentials: "same-origin", headers: { "X-CSRF-Token": token } })
          .then(function (r) {
            return r.json().catch(function () {
              return { ok: false, error: "The server did not accept the upload (it may be too big)." };
            });
          })
          .then(function (res) {
            if (!res.ok) throw new Error(res.error || "Upload failed.");
            value.value = res.path;
            show(res.url, res.path);
            status.textContent = "Uploaded. Press Save to keep it.";
          })
          .catch(function (err) {
            status.textContent = err.message;
          })
          .then(function () {
            input.value = "";
          });
      });
      remove.addEventListener("click", function () {
        value.value = "";
        show("", "");
        status.textContent = "Removed. Press Save to confirm.";
      });
    });
  }

  /* ---- Article editor (TinyMCE; the plain box still works if it cannot load) ---- */
  /* TinyMCE is bundled in assets/vendor/tinymce (GPL), so the editor works without any outside service. */
  var TINY = (document.querySelector('meta[name="tinymce-base"]') || {}).content;
  function initEditors(form) {
    var areas = form.querySelectorAll('textarea[data-editor="html"]');
    if (!areas.length || !TINY) return;
    areas.forEach(function (ta) {
      var picker = ta.parentElement.querySelector("[data-html-import]");
      if (picker)
        picker.addEventListener("change", function () {
          var file = picker.files && picker.files[0];
          if (!file) return;
          file.text().then(function (text) {
            var doc = new DOMParser().parseFromString(text, "text/html");
            doc.querySelectorAll("script, style, link, meta, noscript").forEach(function (n) {
              n.remove();
            });
            var main = doc.querySelector("article") || doc.querySelector("main") || doc.body;
            var html = main.innerHTML.trim();
            if (!window.confirm("Replace the article with the contents of " + file.name + "?")) return;
            if (window.tinymce && window.tinymce.get(ta.id)) window.tinymce.get(ta.id).setContent(html);
            else ta.value = html;
            picker.value = "";
          });
        });
    });
    var s = document.createElement("script");
    s.src = TINY + "/tinymce.min.js";
    s.onload = function () {
      window.tinymce.init({
        selector: 'textarea[data-editor="html"]',
        base_url: TINY,
        suffix: ".min",
        license_key: "gpl",
        promotion: false,
        branding: false,
        menubar: false,
        plugins: "lists link table code autoresize",
        toolbar: "blocks | bold italic | bullist numlist | link table | undo redo | code",
        block_formats: "Paragraph=p; Heading 2=h2; Heading 3=h3",
        extended_valid_elements: "details[open|class],summary[class]",
        valid_children: "+body[details],+details[summary|p|ul|ol|div|table],+div[details]",
        min_height: 420,
        autoresize_bottom_margin: 30,
        convert_urls: false,
        content_style: "body{font-family:Georgia,serif;font-size:17px;line-height:1.6;max-width:44rem;margin:1rem auto;padding:0 1rem} table{border-collapse:collapse} td,th{border:1px solid #ccc;padding:4px 8px} details{border:1px dashed #bbb;padding:6px;margin:8px 0}",
      });
    };
    document.head.appendChild(s);
  }

  ready(function () {
    var toggle = document.querySelector("[data-admin-nav-toggle]");
    var nav = document.getElementById("admin-nav");
    if (toggle && nav)
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("hidden") === false;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

    document.querySelectorAll("form[data-confirm]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        if (!window.confirm(f.getAttribute("data-confirm"))) e.preventDefault();
      });
    });

    document.querySelectorAll("form[data-admin-form]").forEach(function (form) {
      nameFields(form);
      initRepeaters(form);
      initSlugs(form);
      initUploads(form);
      initEditors(form);
      var dirty = false;
      form.addEventListener("input", function () {
        dirty = true;
      });
      form.addEventListener("submit", function () {
        if (window.tinymce) window.tinymce.triggerSave();
        nameFields(form);
        dirty = false;
      });
      window.addEventListener("beforeunload", function (e) {
        if (dirty) {
          e.preventDefault();
          e.returnValue = "";
        }
      });
    });
  });
})();
