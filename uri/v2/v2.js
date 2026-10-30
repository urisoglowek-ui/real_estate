(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nav = document.getElementById("nav");
  var btn = document.getElementById("menubtn");
  if (nav) {
    var solid = function () {
      nav.classList.toggle("solid", window.scrollY > 8);
    };
    solid();
    window.addEventListener("scroll", solid, { passive: true });
  }
  if (nav && btn) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("#links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-split]").forEach(function (el) {
    if (reduce) return;
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.style.animationDelay = i * 70 + "ms";
      span.textContent = word + (i === words.length - 1 ? "" : " ");
      el.appendChild(span);
    });
    el.classList.add("play");
  });

  var reveal = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveal.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveal.forEach(function (el) { io.observe(el); });
  }

  function runCount(el) {
    var target = Number(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) {
      el.textContent = target + suffix;
      return;
    }
    var start = 0;
    var t0 = performance.now();
    var dur = 900;
    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counts = document.querySelectorAll("[data-count]");
  if (reduce || !("IntersectionObserver" in window)) {
    counts.forEach(runCount);
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  }

  document.querySelectorAll(".acc").forEach(function (group) {
    group.querySelectorAll(".acc-btn").forEach(function (button) {
      var panel = button.nextElementSibling;
      button.addEventListener("click", function () {
        var open = button.getAttribute("aria-expanded") === "true";
        group.querySelectorAll(".acc-btn").forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = "0px";
        });
        if (!open) {
          button.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  });
})();
