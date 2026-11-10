/* Zoon Labss — cookie notice ("About Our Cookies" panel + Cookie Settings).
   Shown to every visitor until they choose. The choice is remembered in localStorage
   ("zl_cookie_consent": "all" | "essential"). Other scripts (Google Analytics) read
   window.ZLConsent.get() or listen for the "zl:cookie-consent" event on document.
   A "Cookie Settings" link is added to the footer so visitors can change their choice at any time.
   Built with safe DOM methods only (no innerHTML). */
(function () {
  "use strict";
  var KEY = "zl_cookie_consent";
  var SCRIPT = document.currentScript;
  var ROOT = SCRIPT && SCRIPT.src ? new URL("../", SCRIPT.src).href : "/";
  var root = document.documentElement;
  var box = null;

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "all" || v === "essential" ? v : null;
    } catch (e) {
      return null;
    }
  }
  function save(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }
  window.ZLConsent = { get: read };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function link(text, file) {
    var a = el("a", null, text);
    a.href = ROOT + file;
    return a;
  }
  function para(parts) {
    var p = el("p");
    parts.forEach(function (x) {
      p.appendChild(typeof x === "string" ? document.createTextNode(x) : x);
    });
    return p;
  }
  function strong(t) {
    return el("strong", null, t);
  }

  /* Remove Google Analytics cookies when a visitor switches analytics off. */
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var parts = host.split(".");
    var domains = ["", host, "." + host];
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid") {
        domains.forEach(function (d) {
          document.cookie =
            name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
            (d ? "; domain=" + d : "");
        });
      }
    });
  }

  function close() {
    if (box) {
      box.remove();
      box = null;
    }
    root.classList.remove("zl-cookie-open");
  }
  function choose(v) {
    save(v);
    if (v === "essential") clearAnalyticsCookies();
    close();
    document.dispatchEvent(new CustomEvent("zl:cookie-consent", { detail: v }));
  }

  /* ---- Panel ---- */
  function open(view) {
    if (box) close();
    box = el("div", "cookie-banner");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookie notice");
    box.tabIndex = -1;
    root.classList.add("zl-cookie-open");
    if (view === "settings") drawSettings();
    else drawMain();
    document.body.appendChild(box);
    box.focus({ preventScroll: true });
  }

  function button(text, onClick) {
    var b = el("button", "cookie-btn", text);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }

  function drawMain() {
    box.textContent = "";
    box.appendChild(el("h2", "cookie-title", "About Our Cookies"));
    box.appendChild(
      para([
        "Zoon Labss does not ask you to sign in and does not collect personal details such as your name, address or phone number. " +
          "We use cookies only to measure anonymous visits with Google Analytics 4, which shows us how our articles perform, " +
          "and to remember your choices (for example your language, if you use the Translate Language menu). " +
          "More information is available in our ",
        link("Cookie Policy", "cookie_policy.html"),
        ".",
      ]),
    );
    box.appendChild(
      para([
        "If you choose ",
        strong("‘Accept All Cookies’"),
        ", we allow Google Analytics 4 to store anonymous statistics about your visit. If you choose ",
        strong("‘Essential Only’"),
        ", analytics storage stays switched off. You can change your choice at any time by selecting ",
        strong("‘Cookie Settings’"),
        " here or in the footer of any page. See our ",
        link("Privacy Policy", "privacy_policy.html"),
        " for details.",
      ]),
    );
    var row = el("div", "cookie-actions");
    row.appendChild(button("Accept All Cookies", function () { choose("all"); }));
    row.appendChild(button("Essential Only", function () { choose("essential"); }));
    row.appendChild(button("Cookie Settings", drawSettings));
    box.appendChild(row);
  }

  function drawSettings() {
    box.textContent = "";
    box.appendChild(el("h2", "cookie-title", "Cookie Settings"));
    box.appendChild(
      para([
        "Choose which cookies Zoon Labss may use. Read more in our ",
        link("Cookie Policy", "cookie_policy.html"),
        ".",
      ]),
    );

    var a = el("div", "cookie-row");
    var at = el("div", "cookie-row-text");
    at.appendChild(strong("Strictly necessary"));
    at.appendChild(
      el("p", null,
        "Remembers your cookie choice and, only if you use Translate Language, the language you picked. These do not track you and are always active."),
    );
    a.appendChild(at);
    a.appendChild(el("span", "cookie-always", "Always active"));
    box.appendChild(a);

    var b = el("div", "cookie-row");
    var bt = el("div", "cookie-row-text");
    var lbl = el("label", null, "Analytics (Google Analytics 4)");
    lbl.setAttribute("for", "zl-ck-analytics");
    lbl.className = "cookie-label";
    bt.appendChild(lbl);
    bt.appendChild(
      el("p", null,
        "Anonymous visit statistics (pages viewed, device type, country) that help us improve our articles. Off unless you switch it on."),
    );
    var sw = document.createElement("input");
    sw.type = "checkbox";
    sw.id = "zl-ck-analytics";
    sw.className = "cookie-switch";
    sw.checked = read() === "all";
    b.appendChild(bt);
    b.appendChild(sw);
    box.appendChild(b);

    var row = el("div", "cookie-actions");
    row.appendChild(button("Save My Choices", function () { choose(sw.checked ? "all" : "essential"); }));
    row.appendChild(button("Accept All Cookies", function () { choose("all"); }));
    row.appendChild(button("Back", drawMain));
    box.appendChild(row);
  }

  /* ---- Footer "Cookie Settings" link (lets visitors change their mind) ---- */
  function addFooterLink() {
    var heads = document.querySelectorAll(".site-footer h2");
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].textContent.trim() === "Company") {
        var ul = heads[i].nextElementSibling;
        if (!ul || ul.tagName !== "UL") return;
        var li = document.createElement("li");
        var btn = el("button", "cookie-link", "Cookie Settings");
        btn.type = "button";
        btn.addEventListener("click", function () { open("settings"); });
        li.appendChild(btn);
        ul.appendChild(li);
        return;
      }
    }
  }

  function init() {
    addFooterLink();
    if (!read()) open("main");
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
