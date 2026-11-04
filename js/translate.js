/* Zoon Labss — "Translate Language" floating control (bottom-left).
   Real page translation by Google's free Website Translator (translate.google.com element.js):
   no API key, no account, no backend. Google's own widget is kept hidden; this file gives it a
   Zoon Labss-styled language picker and drives it.
   - Google's script is preloaded right after the page finishes loading, so a language switch is immediate.
   - The choice persists across pages (Google's "googtrans" cookie + localStorage "zl_lang").
   - Choosing a language reloads the page, and Google applies it immediately on load.
   - "English (Original)" removes the translation and reloads the original page.
   Built with safe DOM methods (no innerHTML). */
(function () {
  "use strict";
  var KEY = "zl_lang";
  var LANGS = [
    ["bn", "বাংলা", "Bengali"], ["ar", "العربية", "Arabic"], ["fr", "Français", "French"],
    ["es", "Español", "Spanish"], ["de", "Deutsch", "German"], ["hi", "हिन्दी", "Hindi"],
    ["zh-CN", "中文 (简体)", "Chinese (Simplified)"], ["zh-TW", "中文 (繁體)", "Chinese (Traditional)"],
    ["ja", "日本語", "Japanese"], ["ko", "한국어", "Korean"], ["pt", "Português", "Portuguese"],
    ["ru", "Русский", "Russian"], ["it", "Italiano", "Italian"], ["tr", "Türkçe", "Turkish"],
    ["id", "Bahasa Indonesia", "Indonesian"], ["ms", "Bahasa Melayu", "Malay"], ["ur", "اردو", "Urdu"],
    ["fa", "فارسی", "Persian"], ["vi", "Tiếng Việt", "Vietnamese"], ["th", "ไทย", "Thai"],
    ["nl", "Nederlands", "Dutch"], ["pl", "Polski", "Polish"], ["uk", "Українська", "Ukrainian"],
    ["sv", "Svenska", "Swedish"], ["no", "Norsk", "Norwegian"], ["da", "Dansk", "Danish"],
    ["fi", "Suomi", "Finnish"], ["el", "Ελληνικά", "Greek"], ["iw", "עברית", "Hebrew"],
    ["cs", "Čeština", "Czech"], ["ro", "Română", "Romanian"], ["hu", "Magyar", "Hungarian"],
    ["bg", "Български", "Bulgarian"], ["sr", "Српски", "Serbian"], ["hr", "Hrvatski", "Croatian"],
    ["sk", "Slovenčina", "Slovak"], ["sl", "Slovenščina", "Slovenian"], ["ta", "தமிழ்", "Tamil"],
    ["te", "తెలుగు", "Telugu"], ["mr", "मराठी", "Marathi"], ["gu", "ગુજરાતી", "Gujarati"],
    ["kn", "ಕನ್ನಡ", "Kannada"], ["ml", "മലയാളം", "Malayalam"], ["pa", "ਪੰਜਾਬੀ", "Punjabi"],
    ["ne", "नेपाली", "Nepali"], ["si", "සිංහල", "Sinhala"], ["my", "မြန်မာ", "Burmese"],
    ["km", "ខ្មែរ", "Khmer"], ["lo", "ລາວ", "Lao"], ["tl", "Filipino", "Filipino"],
    ["sw", "Kiswahili", "Swahili"], ["af", "Afrikaans", "Afrikaans"], ["am", "አማርኛ", "Amharic"],
    ["ha", "Hausa", "Hausa"], ["yo", "Yorùbá", "Yoruba"], ["zu", "isiZulu", "Zulu"],
    ["ps", "پښتو", "Pashto"], ["ku", "Kurdî", "Kurdish (Kurmanji)"], ["ckb", "کوردی", "Kurdish (Sorani)"],
    ["uz", "Oʻzbekcha", "Uzbek"], ["kk", "Қазақша", "Kazakh"], ["mn", "Монгол", "Mongolian"],
    ["az", "Azərbaycanca", "Azerbaijani"], ["ka", "ქართული", "Georgian"], ["hy", "Հայերեն", "Armenian"],
    ["sq", "Shqip", "Albanian"], ["as", "অসমীয়া", "Assamese"], ["ay", "Aymara", "Aymara"],
    ["bm", "Bamanankan", "Bambara"], ["eu", "Euskara", "Basque"], ["be", "Беларуская", "Belarusian"],
    ["bho", "भोजपुरी", "Bhojpuri"], ["bs", "Bosanski", "Bosnian"], ["ca", "Català", "Catalan"],
    ["ceb", "Cebuano", "Cebuano"], ["ny", "Chichewa", "Chichewa"], ["co", "Corsu", "Corsican"],
    ["dv", "ދިވެހި", "Dhivehi"], ["doi", "डोगरी", "Dogri"], ["eo", "Esperanto", "Esperanto"],
    ["et", "Eesti", "Estonian"], ["ee", "Eʋegbe", "Ewe"], ["fy", "Frysk", "Frisian"],
    ["gl", "Galego", "Galician"], ["gn", "Avañe'ẽ", "Guarani"], ["ht", "Kreyòl ayisyen", "Haitian Creole"],
    ["haw", "ʻŌlelo Hawaiʻi", "Hawaiian"], ["hmn", "Hmoob", "Hmong"], ["is", "Íslenska", "Icelandic"],
    ["ig", "Igbo", "Igbo"], ["ilo", "Ilokano", "Ilocano"], ["ga", "Gaeilge", "Irish"],
    ["jw", "Basa Jawa", "Javanese"], ["rw", "Kinyarwanda", "Kinyarwanda"], ["gom", "कोंकणी", "Konkani"],
    ["kri", "Krio", "Krio"], ["ky", "Кыргызча", "Kyrgyz"], ["la", "Latina", "Latin"],
    ["lv", "Latviešu", "Latvian"], ["ln", "Lingála", "Lingala"], ["lt", "Lietuvių", "Lithuanian"],
    ["lg", "Luganda", "Luganda"], ["lb", "Lëtzebuergesch", "Luxembourgish"], ["mk", "Македонски", "Macedonian"],
    ["mai", "मैथिली", "Maithili"], ["mg", "Malagasy", "Malagasy"], ["mt", "Malti", "Maltese"],
    ["mi", "Māori", "Maori"], ["mni-Mtei", "ꯃꯦꯇꯦꯏꯂꯣꯟ", "Meiteilon (Manipuri)"], ["lus", "Mizo", "Mizo"],
    ["or", "ଓଡ଼ିଆ", "Odia (Oriya)"], ["om", "Afaan Oromoo", "Oromo"], ["qu", "Runasimi", "Quechua"],
    ["sm", "Gagana Samoa", "Samoan"], ["sa", "संस्कृतम्", "Sanskrit"], ["gd", "Gàidhlig", "Scots Gaelic"],
    ["nso", "Sepedi", "Sepedi"], ["st", "Sesotho", "Sesotho"], ["sn", "chiShona", "Shona"],
    ["sd", "سنڌي", "Sindhi"], ["so", "Soomaali", "Somali"], ["su", "Basa Sunda", "Sundanese"],
    ["tg", "Тоҷикӣ", "Tajik"], ["tt", "Татарча", "Tatar"], ["ti", "ትግርኛ", "Tigrinya"],
    ["ts", "Xitsonga", "Tsonga"], ["tk", "Türkmençe", "Turkmen"], ["ak", "Twi", "Twi (Akan)"],
    ["ug", "ئۇيغۇرچە", "Uyghur"], ["cy", "Cymraeg", "Welsh"], ["xh", "isiXhosa", "Xhosa"],
    ["yi", "ייִדיש", "Yiddish"],
  ];
  var ALIAS = { iw: "he", he: "iw", no: "nb", tl: "fil", jw: "jv" };
  var LOAD_TIMEOUT = 15000;

  /* ---------- helpers ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function getSaved() {
    try {
      var v = localStorage.getItem(KEY);
      if (v) return v;
    } catch (e) {}
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/;]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(code) {
    document.cookie = "googtrans=/en/" + code + "; path=/; SameSite=Lax";
  }
  function clearCookies() {
    var past = "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "googtrans=" + past;
    var h = location.hostname;
    if (h && h.indexOf(".") !== -1) {
      document.cookie = "googtrans=" + past + "; domain=" + h;
      document.cookie = "googtrans=" + past + "; domain=." + h;
    }
  }
  function langName(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === code) return LANGS[i];
    return null;
  }

  /* Never translate code samples, scripts or styles. */
  Array.prototype.forEach.call(
    document.querySelectorAll("pre, code, kbd, samp, script, style"),
    function (n) {
      n.setAttribute("translate", "no");
      n.classList.add("notranslate");
    },
  );

  /* ---------- Google widget loading ---------- */
  var widget = { promise: null, failed: null };
  var host = el("div", "zl-gt-hidden notranslate");
  host.id = "google_translate_element";
  host.setAttribute("translate", "no");
  host.setAttribute("aria-hidden", "true");

  function findCombo() {
    return host.querySelector("select.goog-te-combo") || document.querySelector("select.goog-te-combo");
  }
  /* Add any language Google offers that is missing from LANGS (keeps the list complete). */
  function mergeExtras(sel) {
    var known = {};
    LANGS.forEach(function (l) {
      known[l[0]] = true;
      if (ALIAS[l[0]]) known[ALIAS[l[0]]] = true;
    });
    Array.prototype.forEach.call(sel.options, function (o) {
      if (o.value && !known[o.value]) LANGS.push([o.value, o.text, o.text]);
    });
    if (!panel.hidden) renderList();
  }
  function loadWidget() {
    if (widget.promise) return widget.promise;
    widget.promise = new Promise(function (resolve, reject) {
      if (!host.parentNode) document.body.appendChild(host);
      var done = false;
      function fail(msg) {
        if (done) return;
        done = true;
        widget.promise = null; // allow a retry
        widget.failed = msg;
        reject(new Error(msg));
      }
      var timer = setTimeout(function () {
        fail("timeout");
      }, LOAD_TIMEOUT);
      window.googleTranslateElementInit = function () {
        try {
          new window.google.translate.TranslateElement(
            { pageLanguage: "en", autoDisplay: false, layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
            "google_translate_element",
          );
        } catch (e) {
          clearTimeout(timer);
          return fail("init");
        }
        (function wait() {
          if (done) return;
          var combo = findCombo();
          if (combo && combo.options.length > 1) {
            done = true;
            clearTimeout(timer);
            widget.failed = null;
            mergeExtras(combo);
            return resolve();
          }
          setTimeout(wait, 40);
        })();
      };
      var s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      s.onerror = function () {
        clearTimeout(timer);
        fail("network");
      };
      document.head.appendChild(s);
    });
    return widget.promise;
  }

  /* ---------- UI ---------- */
  var btn = el("button", "zl-tr-btn notranslate");
  btn.type = "button";
  btn.id = "zl-tr-btn";
  btn.setAttribute("translate", "no");
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "zl-tr-panel");
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  var path = document.createElementNS(NS, "path");
  path.setAttribute("d", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.9 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.84 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.1 16zm2.95-8H5.1a7.99 7.99 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.05 8zM12 19.96A14.7 14.7 0 0 1 10.09 16h3.82A14.7 14.7 0 0 1 12 19.96zM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38z");
  svg.appendChild(path);
  btn.appendChild(svg);
  btn.appendChild(el("span", null, "Translate Language"));

  var panel = el("div", "zl-tr-panel notranslate");
  panel.id = "zl-tr-panel";
  panel.setAttribute("translate", "no");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Translate Language");
  panel.hidden = true;
  var head = el("div", "zl-tr-head");
  head.appendChild(el("strong", null, "Translate Language"));
  var close = el("button", "zl-tr-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Close language list");
  head.appendChild(close);
  var search = el("input", "zl-tr-search");
  search.type = "search";
  search.placeholder = "Search language";
  search.setAttribute("aria-label", "Search language");
  search.autocomplete = "off";
  var status = el("p", "zl-tr-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  var list = el("ul", "zl-tr-list");
  var credit = el("p", "zl-tr-credit", "Automatic translation by Google Translate");
  panel.appendChild(head);
  panel.appendChild(search);
  panel.appendChild(status);
  panel.appendChild(list);
  panel.appendChild(credit);

  var active = getSaved();
  if (active === "en") active = null;

  function setStatus(msg, type) {
    status.textContent = msg || "";
    status.dataset.type = type || "";
  }
  function renderList() {
    var q = search.value.trim().toLowerCase();
    list.textContent = "";
    function item(code, label, sub) {
      var li = el("li");
      var b = el("button", "zl-tr-item");
      b.type = "button";
      b.dataset.code = code;
      var n = el("span", null, label);
      b.appendChild(n);
      if (sub) b.appendChild(el("small", null, sub));
      if ((code === "en" && !active) || code === active) b.setAttribute("aria-current", "true");
      li.appendChild(b);
      list.appendChild(li);
    }
    if (!q || "english original".indexOf(q) !== -1) item("en", "English (Original)", "");
    LANGS.forEach(function (l) {
      if (!q || (l[1] + " " + l[2]).toLowerCase().indexOf(q) !== -1) item(l[0], l[1], l[2]);
    });
    if (!list.children.length) setStatus("No language matches your search.", "info");
    else if (status.dataset.type === "info") setStatus("");
  }

  function restore() {
    setStatus("Restoring the original language…", "loading");
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    clearCookies();
    location.reload();
  }
  function waitTranslated(code) {
    var t0 = Date.now();
    (function poll() {
      var cls = document.documentElement.className;
      if (/translated-(ltr|rtl)/.test(cls)) {
        var l = langName(code);
        setStatus("Translated to " + (l ? l[2] : code) + ".", "ok");
        return;
      }
      if (Date.now() - t0 > 10000) {
        setStatus("The page could not be translated right now. Please try again.", "error");
        return;
      }
      setTimeout(poll, 250);
    })();
  }
  /* Choosing a language saves it and reloads the page. On load Google applies the saved
     language straight away (much faster than switching live), so the visitor sees the
     translation immediately after the refresh. */
  function choose(code) {
    if (code === "en") return restore();
    var l = langName(code);
    // If the widget is already loaded we can warn about unsupported languages before reloading.
    var sel = findCombo();
    if (sel && sel.options.length > 1) {
      var has = function (v) {
        return Array.prototype.some.call(sel.options, function (o) {
          return o.value === v;
        });
      };
      if (!has(code) && !(ALIAS[code] && has(ALIAS[code]))) {
        return setStatus("Sorry, this language is not supported by the translation service.", "error");
      }
    }
    if (widget.failed) {
      // Google's script could not be loaded earlier: retry once and tell the visitor if it still fails.
      setStatus("Loading translation…", "loading");
      return loadWidget().then(
        function () {
          choose(code);
        },
        function (err) {
          renderList();
          setStatus(
            err && err.message === "timeout"
              ? "Translation took too long to load. Check your connection and try again."
              : "Translation could not be loaded. Google Translate may be blocked on your network or browser.",
            "error",
          );
        },
      );
    }
    setStatus("Translating to " + (l ? l[2] : code) + "…", "loading");
    try {
      localStorage.setItem(KEY, code);
    } catch (e) {}
    setCookie(code);
    location.reload();
  }

  function openPanel() {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    renderList();
    search.focus({ preventScroll: true });
    if (!widget.promise && !findCombo()) loadWidget().catch(function () {}); // warm up
  }
  function closePanel(returnFocus) {
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (returnFocus) btn.focus();
  }
  btn.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else closePanel(true);
  });
  close.addEventListener("click", function () {
    closePanel(true);
  });
  search.addEventListener("input", renderList);
  list.addEventListener("click", function (e) {
    var b = e.target.closest(".zl-tr-item");
    if (b) choose(b.dataset.code);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closePanel(true);
  });
  document.addEventListener("click", function (e) {
    // composedPath: the clicked list item may already be re-rendered (detached) by now.
    var path = e.composedPath ? e.composedPath() : [];
    if (!panel.hidden && path.indexOf(panel) === -1 && path.indexOf(btn) === -1) closePanel(false);
  });

  function mount() {
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    if (active) {
      setCookie(active); // Google applies the saved language as soon as its widget starts
      loadWidget().catch(function () {}); // start immediately, not after the load event
      return;
    }
    // Preload Google's widget right after the page loads, so choosing a language needs no loading wait.
    function warm() {
      loadWidget().catch(function () {});
    }
    if (document.readyState === "complete") setTimeout(warm, 200);
    else window.addEventListener("load", function () { setTimeout(warm, 200); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
