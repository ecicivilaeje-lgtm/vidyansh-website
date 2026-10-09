/*
 * The contact letter (the original components/contact/LetterForm): keeps exam and course in step,
 * signs the letter as you type, checks the name and number, then sends it with fetch and shows
 * the thank-you note. Without JavaScript the form posts normally (app/enquiry.php).
 */
(function () {
  "use strict";

  var OK_LINE = "border-ink/40 hover:border-ink focus:border-ink";
  var BAD_LINE = "border-[#9b4a33]";

  function init(form) {
    var V = window.Vidyansh;
    var root = form.parentNode;
    var dataEl = root.querySelector("[data-letter-data]");
    if (!dataEl) return;
    var opts = JSON.parse(dataEl.textContent);
    var done = root.querySelector("[data-letter-done]");
    var nameEl = form.querySelector("#c-name");
    var phoneEl = form.querySelector("#c-phone");
    var examEl = form.querySelector("#c-exam");
    var courseEl = form.querySelector("#c-course");
    var timeEl = form.querySelector("#c-time");
    var topic = form.querySelector('input[name="topic"]').value || null;
    var subjectEl = form.querySelector("[data-letter-subject]");
    var signature = form.querySelector("[data-letter-signature]");
    var submit = form.querySelector('button[type="submit"]');
    var course = courseEl.value;

    function findCourse(slug) {
      return opts.courses.filter(function (c) { return c.slug === slug; })[0] || null;
    }

    function renderCourses() {
      var exam = examEl.value;
      var keep = courseEl.options[0].cloneNode(true);
      courseEl.innerHTML = "";
      courseEl.appendChild(keep);
      opts.courses
        .filter(function (c) { return !exam || c.exam === exam; })
        .forEach(function (c) {
          var o = document.createElement("option");
          o.value = c.slug;
          o.textContent = c.name;
          courseEl.appendChild(o);
        });
      courseEl.value = course;
      if (courseEl.value !== course) courseEl.selectedIndex = 0;
      var c = findCourse(course);
      subjectEl.textContent = topic === "free-classes" ? "Free class reminders" : c ? "Enquiry, " + c.name : "An enquiry";
    }

    examEl.addEventListener("change", function () {
      var code = examEl.value;
      V.setExam(code || null);
      var c = findCourse(course);
      if (course && (!c || c.exam !== code)) course = "";
      renderCourses();
    });
    courseEl.addEventListener("change", function () {
      course = courseEl.value;
      var c = findCourse(course);
      if (c && opts.exams.some(function (e) { return e.code === c.exam; })) {
        examEl.value = c.exam;
        V.setExam(c.exam);
      }
      renderCourses();
    });
    nameEl.addEventListener("input", function () {
      var n = nameEl.value.trim();
      signature.textContent = n || "your name";
      signature.classList.toggle("text-ink", !!n);
      signature.classList.toggle("text-mute-l", !n);
    });

    function showError(input, key, msg) {
      var err = form.querySelector("#c-" + key + "-err");
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) input.setAttribute("aria-describedby", "c-" + key + "-err");
      else input.removeAttribute("aria-describedby");
      V.toggleClasses(input, BAD_LINE, !!msg);
      V.toggleClasses(input, OK_LINE, !msg);
      err.textContent = msg || "";
      err.hidden = !msg;
    }

    function setErrors(errors) {
      showError(nameEl, "name", errors.name);
      showError(phoneEl, "phone", errors.phone);
      if (errors.name) nameEl.focus();
      else if (errors.phone) phoneEl.focus();
    }

    function validate() {
      var next = {};
      if (nameEl.value.trim().length < 2) next.name = "Please write your name.";
      var digits = phoneEl.value.replace(/[\s-]/g, "").replace(/^(\+?91)/, "");
      if (!/^[6-9]\d{9}$/.test(digits)) next.phone = "Enter a 10-digit Indian mobile number.";
      return next;
    }

    function showDone() {
      var first = nameEl.value.trim().split(" ")[0];
      var t = opts.callTimes.filter(function (x) { return x.value === timeEl.value; })[0];
      done.querySelector("[data-letter-done-name]").textContent = ", " + first;
      done.querySelector("[data-letter-done-note]").textContent =
        opts.firstNote + (timeEl.value ? " in " + (t ? t.label : "") : "") + ".";
      form.hidden = true;
      done.hidden = false;
      requestAnimationFrame(function () {
        done.focus();
      });
    }

    var sending = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;
      var errors = validate();
      setErrors(errors);
      if (errors.name || errors.phone) return;
      if (!window.fetch || !window.FormData) {
        form.submit();
        return;
      }
      sending = true;
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      var token = form.querySelector('input[name="_token"]');
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
        headers: { Accept: "application/json", "X-Requested-With": "fetch", "X-CSRF-Token": token ? token.value : "" },
      })
        .then(function (res) {
          return res.json().then(
            function (body) { return { status: res.status, body: body }; },
            function () { return { status: res.status, body: null }; }
          );
        })
        .then(function (r) {
          if (r.body && r.body.ok) showDone();
          else if (r.status === 422 && r.body && r.body.errors) setErrors(r.body.errors);
          else throw new Error("not sent");
        })
        .catch(function () {
          // Let the server handle it the plain way (and show its own message).
          form.submit();
        })
        .then(function () {
          sending = false;
          submit.disabled = false;
          form.removeAttribute("aria-busy");
        });
    });

    var edit = done.querySelector("[data-letter-edit]");
    if (edit) {
      edit.addEventListener("click", function (e) {
        e.preventDefault();
        done.hidden = true;
        form.hidden = false;
        if (/[?&]sent=1/.test(location.search) && window.history.replaceState) {
          window.history.replaceState(null, "", location.pathname);
        }
      });
    }

    // Arrived here after a plain (no fetch) submit: focus the thank-you note as the letter would.
    if (!done.hidden) done.focus();
  }

  window.Vidyansh.ready(function () {
    document.querySelectorAll("form[data-letter]").forEach(init);
  });
})();
