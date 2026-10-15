(function () {
  var nav = document.getElementById("nav");
  var btn = document.getElementById("menubtn");
  if (!nav || !btn) return;
  var setSolid = function () {
    nav.classList.toggle("solid", window.scrollY > 8);
  };
  setSolid();
  window.addEventListener("scroll", setSolid, { passive: true });
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("#links a[href^='#']").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
})();
