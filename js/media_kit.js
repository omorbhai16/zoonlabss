/* Zoon Labss Media Kit: shows one card per monthly audience report.
   Reads media_kit/reports.json (list of report ids, e.g. "2026-11") and media_kit/reports/<id>.json.
   Only values written in those files are shown. All text is inserted with textContent. */
(function () {
  "use strict";
  var me = document.currentScript;
  var list = document.getElementById("mk-reports");
  var status = document.getElementById("mk-status");
  if (!me || !list || !status) return;
  var base = new URL("../", me.src).href;
  var ID = /^(\d{4})-(0[1-9]|1[0-2])$/;
  var IMG = /^[A-Za-z0-9._-]+\.(?:png|jpe?g|webp)$/i;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }
  function say(text, type) { status.textContent = text; status.setAttribute("data-type", type || ""); status.hidden = !text; }
  function json(path) {
    return fetch(base + path, { credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error(path + " " + r.status);
      return r.json();
    });
  }
  function dateText(iso) {
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return p ? MONTHS[+p[2] - 1] + " " + (+p[3]) + ", " + p[1] : "";
  }

  function shot(id, s) {
    var fig = el("figure", "mk-shot");
    if (!s || !IMG.test(s.file || "")) { fig.appendChild(el("p", "state", "Screenshot unavailable.")); return fig; }
    var href = base + "media_kit/media_kit_photo/" + id + "/" + s.file;
    var a = el("a");
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    var img = el("img");
    img.src = href; img.alt = String(s.alt || ""); img.loading = "lazy"; img.decoding = "async";
    if (+s.width > 0 && +s.height > 0) { img.width = +s.width; img.height = +s.height; }
    img.addEventListener("error", function () {
      fig.textContent = "";
      fig.appendChild(el("p", "state", "This screenshot could not be loaded."));
    });
    a.appendChild(img);
    a.appendChild(el("span", "visually-hidden", " (open full size in a new tab)"));
    fig.appendChild(a);
    var cap = el("figcaption");
    cap.appendChild(el("span", "mk-src", s.source));
    cap.appendChild(document.createTextNode(String(s.caption || "")));
    fig.appendChild(cap);
    return fig;
  }

  function card(id, r) {
    var m = ID.exec(id);
    var art = el("article", "mk-report");
    art.setAttribute("aria-labelledby", "mk-" + id);
    var h = el("h2", "", MONTHS[+m[2] - 1] + " " + m[1]);
    h.id = "mk-" + id;
    art.appendChild(h);
    var rd = dateText(r.reportDate);
    if (rd) art.appendChild(el("p", "mk-date", "Report date: " + rd));
    if (r.summary) art.appendChild(el("p", "", r.summary));
    var hi = Array.isArray(r.highlights) ? r.highlights.filter(function (x) { return x && x.label && x.value; }) : [];
    if (hi.length) {
      var dl = el("dl", "mk-stats");
      hi.forEach(function (x) {
        var box = el("div", "mk-stat");
        box.appendChild(el("dt", "", x.label));
        var dd = el("dd", "", x.value);
        if (x.source) dd.appendChild(el("small", "", x.source));
        box.appendChild(dd);
        dl.appendChild(box);
      });
      art.appendChild(dl);
    }
    var shots = Array.isArray(r.screenshots) ? r.screenshots.slice(0, 5) : [];
    if (shots.length) {
      var grid = el("div", "mk-shots");
      shots.forEach(function (s) { grid.appendChild(shot(id, s)); });
      art.appendChild(grid);
    } else {
      art.appendChild(el("p", "state", "No screenshots were published for this month."));
    }
    return art;
  }

  say("Loading audience reports\u2026");
  json("media_kit/reports.json").then(function (idx) {
    var ids = (idx && Array.isArray(idx.reports) ? idx.reports : []).filter(function (x) { return ID.test(String(x)); });
    ids = ids.filter(function (x, i) { return ids.indexOf(x) === i; }).sort().reverse();
    if (!ids.length) { say("No audience reports have been published yet. Reports are added once a month.", "empty"); return; }
    return Promise.all(ids.map(function (id) {
      return json("media_kit/reports/" + id + ".json").then(function (r) { return { id: id, r: r }; }, function () { return { id: id, r: null }; });
    })).then(function (all) {
      var failed = [];
      all.forEach(function (x) {
        if (x.r && typeof x.r === "object") list.appendChild(card(x.id, x.r)); else failed.push(x.id);
      });
      say(failed.length ? "The report for " + failed.join(", ") + " could not be loaded right now. Please try again later." : "", failed.length ? "error" : "");
    });
  }).catch(function () { say("The audience reports could not be loaded right now. Please try again later.", "error"); });
})();
