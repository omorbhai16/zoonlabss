/* Zoon Labss — shared script. Vanilla JS, no dependencies, no eval, no innerHTML.
   Loaded on every page. Provides: mobile menu, footer year, safe JSON loading + card rendering,
   homepage sections/search, and window.ZL helpers used by category scripts. */
(function () {
  "use strict";
  var SCRIPT = document.currentScript;
  var ROOT = new URL("../", SCRIPT.src).href; // site root, works at any page depth
  document.documentElement.classList.add("js");

  var CATS = {
    product_gadget: {
      file: "product_gadget.json",
      dir: "product_gadget",
      photo: "product_gadget_photo",
      label: "Product & Gadget",
      page: "product_gadget.html",
    },
    ai_tools: {
      file: "ai_tools.json",
      dir: "ai_tools",
      photo: "ai_tools_photo",
      label: "AI & Tools",
      page: "ai_tools.html",
    },
    app_software: {
      file: "app_software.json",
      dir: "app_software",
      photo: "app_software_photo",
      label: "Apps & Software",
      page: "app_software.html",
    },
    games: {
      file: "games.json",
      dir: "games",
      photo: "games_photo",
      label: "Games",
      page: "games.html",
    },
    blog: {
      file: "blog.json",
      dir: "blog",
      photo: "blog_photo",
      label: "Blog",
      page: "blog.html",
    },
  };
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function isStr(v) {
    return typeof v === "string" && v.trim() !== "";
  }

  /* ---- Validation: only expected local paths are accepted ---- */
  function validate(item, key) {
    var c = CATS[key];
    if (!item || typeof item !== "object") return "not an object";
    var req = [
      "id",
      "title",
      "slug",
      "description",
      "article",
      "category",
      "publishedAt",
    ];
    for (var i = 0; i < req.length; i++)
      if (!isStr(item[req[i]])) return 'missing/invalid "' + req[i] + '"';
    if (!/^[a-z0-9-]+$/.test(item.id) || !/^[a-z0-9-]+$/.test(item.slug))
      return "id/slug must be lowercase letters, numbers, hyphens";
    if (
      !new RegExp("^" + c.dir + "/articles/[A-Za-z0-9_-]+\\.html$").test(
        item.article,
      )
    )
      return "article path must be " + c.dir + "/articles/<file>.html";
    if (!DATE_RE.test(item.publishedAt))
      return "publishedAt must be YYYY-MM-DD";
    if (item.updatedAt != null && !DATE_RE.test(item.updatedAt))
      return "updatedAt must be YYYY-MM-DD";
    if (
      item.image != null &&
      !new RegExp(
        "^" +
          c.dir +
          "/" +
          c.photo +
          "/[A-Za-z0-9_-]+/[A-Za-z0-9._-]+\\.(webp|avif|png|jpe?g)$",
      ).test(item.image)
    )
      return (
        "image path must be " + c.dir + "/" + c.photo + "/<item_folder>/<file>"
      );
    if (item.imageAlt != null && typeof item.imageAlt !== "string")
      return "imageAlt must be a string";
    if (
      item.tags != null &&
      !(
        Array.isArray(item.tags) &&
        item.tags.every(function (t) {
          return typeof t === "string";
        })
      )
    )
      return "tags must be an array of strings";
    if (item.featured != null && typeof item.featured !== "boolean")
      return "featured must be true/false";
    if (item.sponsored != null && typeof item.sponsored !== "boolean")
      return "sponsored must be true/false";
    return null;
  }

  function loadCategory(key) {
    var c = CATS[key];
    return fetch(ROOT + c.file, { headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status + " for " + c.file);
        return r.json();
      })
      .then(function (data) {
        if (!Array.isArray(data))
          throw new Error(c.file + " must contain a JSON array");
        var ids = {},
          slugs = {},
          items = [];
        data.forEach(function (it, idx) {
          var err = validate(it, key);
          if (!err && (ids[it.id] || slugs[it.slug])) err = "duplicate id/slug";
          if (err) {
            console.warn(
              "[Zoon Labss] " +
                c.file +
                " record #" +
                (idx + 1) +
                " skipped: " +
                err,
            );
            return;
          }
          ids[it.id] = slugs[it.slug] = true;
          it._key = key;
          items.push(it);
        });
        items.sort(function (a, b) {
          return a.publishedAt < b.publishedAt
            ? 1
            : a.publishedAt > b.publishedAt
              ? -1
              : 0;
        });
        return items;
      });
  }

  /* ---- Rendering ---- */
  function formatDate(s) {
    var p = s.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" },
    );
  }
  function card(item, eager) {
    var c = CATS[item._key];
    var art = el("article", "card");
    if (isStr(item.image)) {
      var img = document.createElement("img");
      img.className = "thumb";
      img.src = ROOT + item.image;
      img.alt = isStr(item.imageAlt) ? item.imageAlt : item.title;
      img.width = 1200;
      img.height = 675;
      img.loading = eager ? "eager" : "lazy";
      img.decoding = "async";
      img.addEventListener("error", function () {
        var ph = el("div", "thumb");
        ph.setAttribute("role", "img");
        ph.setAttribute("aria-label", "Image unavailable");
        img.replaceWith(ph);
      });
      art.appendChild(img);
    } else {
      art.appendChild(el("div", "thumb"));
    }
    var body = el("div", "card-body");
    var meta = el("div", "meta");
    meta.appendChild(el("span", "badge cat", c.label));
    if (item.sponsored === true)
      meta.appendChild(el("span", "badge", "Sponsored"));
    var t = el("time", null, formatDate(item.publishedAt));
    t.dateTime = item.publishedAt;
    meta.appendChild(t);
    body.appendChild(meta);
    var h = el("h3");
    var a = el("a", null, item.title);
    a.href = ROOT + item.article;
    h.appendChild(a);
    body.appendChild(h);
    body.appendChild(el("p", null, item.description));
    if (item.tags && item.tags.length) {
      var tg = el("div", "tags");
      item.tags.slice(0, 4).forEach(function (x) {
        tg.appendChild(el("span", "tag", x));
      });
      body.appendChild(tg);
    }
    art.appendChild(body);
    return art;
  }
  function state(container, type, msg) {
    container.textContent = "";
    var s = el("div", "state", msg);
    s.dataset.type = type;
    if (type === "error") s.setAttribute("role", "alert");
    container.appendChild(s);
  }
  function renderList(container, items, emptyMsg, eagerCount) {
    container.textContent = "";
    if (!items.length) return state(container, "empty", emptyMsg);
    items.forEach(function (it, i) {
      container.appendChild(card(it, i < (eagerCount || 0)));
    });
  }
  function matches(it, q) {
    q = q.trim().toLowerCase();
    if (!q) return true;
    return (
      (it.title + " " + it.description + " " + (it.tags || []).join(" "))
        .toLowerCase()
        .indexOf(q) !== -1
    );
  }

  /* ---- Header / footer ---- */
  /* Safety net: pages whose static header/footer predate the Blog category (for example older
     article files) get a Blog link inserted right after "Games". Does nothing when it is already there. */
  function addBlogLinks() {
    ["#site-nav", ".site-footer"].forEach(function (sel) {
      var root = document.querySelector(sel);
      if (!root || root.querySelector('a[href$="blog.html"]')) return;
      var g = root.querySelector('a[href$="games.html"]');
      if (!g || !g.parentNode || g.parentNode.tagName !== "LI") return;
      var li = el("li"),
        a = el("a", null, "Blog");
      a.href = g.getAttribute("href").replace(/games\.html$/, "blog.html");
      li.appendChild(a);
      g.parentNode.parentNode.insertBefore(li, g.parentNode.nextSibling);
    });
  }

  function initChrome() {
    var btn = document.getElementById("menu-btn"),
      nav = document.getElementById("site-nav");
    if (btn && nav) {
      var set = function (open) {
        nav.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      };
      btn.addEventListener("click", function () {
        set(!nav.classList.contains("open"));
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("open")) {
          set(false);
          btn.focus();
        }
      });
    }
    addBlogLinks();
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ---- Homepage ---- */
  function initHome() {
    var root = document.getElementById("home-data");
    if (!root) return;
    var feat = document.getElementById("featured-grid"),
      latest = document.getElementById("latest-grid");
    var keys = Object.keys(CATS),
      all = [],
      byKey = {};
    [feat, latest].forEach(function (g) {
      state(g, "loading", "Loading articles…");
    });
    keys.forEach(function (k) {
      var g = document.getElementById("grid-" + k);
      if (g) state(g, "loading", "Loading articles…");
    });
    Promise.all(
      keys.map(function (k) {
        return loadCategory(k)
          .then(function (items) {
            byKey[k] = items;
            all = all.concat(items);
          })
          .catch(function (e) {
            console.error(e);
            byKey[k] = null;
            var g = document.getElementById("grid-" + k);
            if (g)
              state(
                g,
                "error",
                "This section could not be loaded right now. Please try again later.",
              );
          });
      }),
    ).then(function () {
      all.sort(function (a, b) {
        return a.publishedAt < b.publishedAt ? 1 : -1;
      });
      var featured = all
        .filter(function (i) {
          return i.featured === true;
        })
        .slice(0, 3);
      renderList(feat, featured, "", 0);
      if (!featured.length)
        document.getElementById("featured-section").hidden = true;
      renderList(
        latest,
        all.slice(0, 6),
        "No articles published yet. Please check back soon.",
        0,
      );
      keys.forEach(function (k) {
        var g = document.getElementById("grid-" + k);
        if (g && byKey[k])
          renderList(g, byKey[k].slice(0, 3), "No articles published yet.", 0);
      });
      var form = document.getElementById("home-search"),
        input = document.getElementById("q"),
        box = document.getElementById("search-results"),
        grid = document.getElementById("search-grid"),
        status = document.getElementById("search-status");
      var run = function () {
        var q = input.value;
        if (!q.trim()) {
          box.hidden = true;
          return;
        }
        var r = all.filter(function (i) {
          return matches(i, q);
        });
        box.hidden = false;
        status.textContent =
          r.length + (r.length === 1 ? " result" : " results");
        renderList(
          grid,
          r,
          "No articles match your search. Try a different word.",
          0,
        );
      };
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        run();
        if (!box.hidden) box.scrollIntoView({ block: "start" });
      });
      input.addEventListener("input", run);
    });
  }

  /* ---- Category pages (called by product_gadget.js etc.) ---- */
  function initCategory(key) {
    var grid = document.getElementById("article-grid");
    if (!grid) return;
    var input = document.getElementById("filter"),
      more = document.getElementById("load-more"),
      wrap = document.getElementById("more-wrap"),
      status = document.getElementById("result-status"),
      PAGE = 9,
      shown = PAGE,
      items = [];
    state(grid, "loading", "Loading articles…");
    function draw() {
      var list = items.filter(function (i) {
        return matches(i, input.value);
      });
      renderList(
        grid,
        list.slice(0, shown),
        items.length
          ? "No articles match your search."
          : "No articles published yet. Please check back soon.",
        3,
      );
      wrap.hidden = list.length <= shown;
      status.textContent =
        list.length + (list.length === 1 ? " article" : " articles");
    }
    loadCategory(key)
      .then(function (r) {
        items = r;
        draw();
      })
      .catch(function (e) {
        console.error(e);
        state(
          grid,
          "error",
          "Articles could not be loaded right now. Please try again later.",
        );
      });
    input.addEventListener("input", function () {
      shown = PAGE;
      draw();
    });
    more.addEventListener("click", function () {
      shown += PAGE;
      draw();
    });
  }

  window.ZL = {
    ROOT: ROOT,
    CATS: CATS,
    loadCategory: loadCategory,
    card: card,
    renderList: renderList,
    state: state,
    initCategory: initCategory,
    el: el,
  };
  initChrome();
  initHome();
})();