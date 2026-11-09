/* Zoon Labss shared page tools: reading progress (articles), back-to-top button, "Copy link" button.
   Loaded automatically on every page by the build. No tracking, no external requests. */
(function () {
  "use strict";
  var d = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function backToTop() {
    var NS = "http://www.w3.org/2000/svg";
    var btn = d.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Back to top");
    var svg = d.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = d.createElementNS(NS, "path");
    path.setAttribute("d", "M12 19V5M5 12l7-7 7 7");
    svg.appendChild(path);
    btn.appendChild(svg);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var main = d.getElementById("main");
      if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
    });
    d.body.appendChild(btn);
    return btn;
  }

  function init() {
    var btn = backToTop();
    var bar = null;
    var article = d.querySelector("article.article .article-body");
    if (article) {
      bar = d.createElement("div");
      bar.className = "read-progress";
      bar.setAttribute("aria-hidden", "true");
      d.body.appendChild(bar);
    }
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.pageYOffset || d.documentElement.scrollTop;
      btn.classList.toggle("show", y > 600);
      if (bar) {
        var top = article.getBoundingClientRect().top + y;
        var span = article.offsetHeight - window.innerHeight * 0.5;
        var p = span > 0 ? (y - top + window.innerHeight * 0.5) / span : 1;
        bar.style.transform = "scaleX(" + Math.max(0, Math.min(1, p)) + ")";
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    var copy = d.querySelector("[data-copy-link]");
    if (copy) {
      copy.hidden = false;
      var link = d.querySelector('link[rel="canonical"]');
      var url = link && link.href ? link.href : window.location.href.split("#")[0];
      copy.addEventListener("click", function () {
        function done(ok) {
          var old = copy.getAttribute("data-label") || copy.textContent;
          copy.setAttribute("data-label", old);
          copy.textContent = ok ? "Link copied" : "Press Ctrl+C to copy";
          window.setTimeout(function () { copy.textContent = old; }, 2200);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
        } else {
          var ta = d.createElement("textarea");
          ta.value = url; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
          d.body.appendChild(ta); ta.select();
          var ok = false;
          try { ok = d.execCommand("copy"); } catch (e) { ok = false; }
          d.body.removeChild(ta); done(ok);
        }
      });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})();
