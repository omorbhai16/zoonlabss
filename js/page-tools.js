/* Zoon Labss shared page tools: reading progress (articles), back-to-top button, "Copy link" button.
   Loaded automatically on every page by the build. No tracking, no external requests. */
(function () {
  "use strict";
  var d = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  /* Original brand logos (official glyph paths, 24x24) for the "Share this article" buttons. */
  var SHARE_ICONS = {
    facebook: { fill: "#0866FF", d: ["M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"] },
    x: { fill: "#000000", d: ["M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"] },
    whatsapp: { fill: "#25D366", d: ["M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"] },
    telegram: { fill: "#26A5E4", d: ["M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"] },
    linkedin: { fill: "#0A66C2", d: ["M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"] },
    copy: { stroke: true, d: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"] }
  };

  function shareKeyFromHref(href) {
    href = href || "";
    if (/facebook\.com/i.test(href)) return "facebook";
    if (/(^|\/\/|\.)(twitter|x)\.com/i.test(href)) return "x";
    if (/wa\.me|whatsapp\.com/i.test(href)) return "whatsapp";
    if (/t\.me|telegram\.me/i.test(href)) return "telegram";
    if (/linkedin\.com/i.test(href)) return "linkedin";
    return "";
  }

  function shareIcon(key) {
    var cfg = SHARE_ICONS[key];
    var svg = d.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", "share-icon");
    cfg.d.forEach(function (dd) {
      var p = d.createElementNS(NS, "path");
      p.setAttribute("d", dd);
      if (cfg.stroke) {
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "currentColor");
        p.setAttribute("stroke-width", "2");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("stroke-linejoin", "round");
      } else {
        p.setAttribute("fill", cfg.fill);
      }
      svg.appendChild(p);
    });
    return svg;
  }

  /* Adds the brand logo in front of every item in the "Share this article" block. */
  function shareIcons() {
    var root = d.querySelector(".share");
    if (!root) return;
    var items = root.querySelectorAll("a, button");
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      if (el.querySelector(".share-icon")) continue;
      var key = el.hasAttribute("data-copy-link") ? "copy" : shareKeyFromHref(el.getAttribute("href"));
      if (!key) continue;
      el.classList.add("share-" + key);
      if (key === "copy") {
        var label = d.createElement("span");
        label.className = "share-label";
        label.textContent = el.textContent.trim() || "Copy link";
        el.textContent = "";
        el.appendChild(label);
      }
      el.insertBefore(shareIcon(key), el.firstChild);
    }
  }

  function backToTop() {
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
    shareIcons();
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
          var lab = copy.querySelector(".share-label") || copy;
          var old = copy.getAttribute("data-label") || lab.textContent;
          copy.setAttribute("data-label", old);
          lab.textContent = ok ? "Link copied" : "Press Ctrl+C to copy";
          window.setTimeout(function () { lab.textContent = old; }, 2200);
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
