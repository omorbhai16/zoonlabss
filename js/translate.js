/* Zoon Labss — "Translate Language" floating control (bottom-left).
   Real page translation by Google's free Website Translator (translate.google.com element.js):
   no API key, no account, no backend. Google's own widget is kept hidden; this file gives it a
   Zoon Labss-styled language picker and drives it.
   - Google's script is preloaded right after the page finishes loading, so a language switch is immediate.
   - The choice persists across pages (Google's "googtrans" cookie + localStorage "zl_lang").
   - Choosing a language reloads the page, and Google applies it immediately on load.
   - "English (Original)" removes the translation and reloads the original page.
   - The list shows English (Original) as no. 1, then every other language A-Z by English name, numbered.
   - Languages that Google's website widget does not offer (the newer Google Translate languages) are
     translated through Google's web version of Website Translation (https://<site>.translate.goog/...),
     so the picker can offer the full Google Translate language list.
   Built with safe DOM methods (no innerHTML). */
(function () {
  "use strict";
  var KEY = "zl_lang";
  var BASE = [
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

  /* Newer Google Translate languages that the old Website Translator widget does not list.
     They are translated through translate.goog (see startProxy). [code, native name, English name] */
  var EXTRA = [
    ["ab", "Аҧсуа", "Abkhaz"], ["ace", "Bahsa Acèh", "Acehnese"], ["ach", "Acholi", "Acholi"],
    ["aa", "Afaraf", "Afar"], ["alz", "Alur", "Alur"], ["awa", "अवधी", "Awadhi"],
    ["ban", "Basa Bali", "Balinese"], ["bgn", "بلوچی", "Baluchi"], ["bci", "Baoulé", "Baoulé"],
    ["ba", "Башҡортса", "Bashkir"], ["btx", "Batak Karo", "Batak Karo"],
    ["bts", "Batak Simalungun", "Batak Simalungun"], ["bbc", "Batak Toba", "Batak Toba"],
    ["bew", "Betawi", "Betawi"], ["bik", "Bikol", "Bikol"], ["br", "Brezhoneg", "Breton"],
    ["bua", "Буряад", "Buryat"], ["yue", "粵語", "Cantonese"], ["ch", "Chamoru", "Chamorro"],
    ["ce", "Нохчийн", "Chechen"], ["chk", "Chuukese", "Chuukese"], ["cv", "Чӑвашла", "Chuvash"],
    ["crh", "Qırımtatarca", "Crimean Tatar"], ["fa-AF", "دری", "Dari"], ["din", "Thuɔŋjäŋ", "Dinka"],
    ["dov", "Dombe", "Dombe"], ["dyu", "Julakan", "Dyula"], ["dz", "རྫོང་ཁ", "Dzongkha"],
    ["fo", "Føroyskt", "Faroese"], ["fj", "Vosa Vakaviti", "Fijian"], ["fon", "Fon", "Fon"],
    ["fur", "Furlan", "Friulian"], ["ff", "Fulfulde", "Fulani"], ["gaa", "Ga", "Ga"],
    ["cnh", "Hakha Chin", "Hakha Chin"], ["hil", "Ilonggo", "Hiligaynon"], ["hrx", "Hunsrik", "Hunsrik"],
    ["iba", "Iban", "Iban"], ["iu-Latn", "Inuktitut", "Inuktut (Latin)"], ["iu", "ᐃᓄᒃᑎᑐᑦ", "Inuktut (Syllabics)"],
    ["jam", "Patwa", "Jamaican Patois"], ["kac", "Jingpho", "Jingpo"], ["kl", "Kalaallisut", "Kalaallisut"],
    ["kr", "Kanuri", "Kanuri"], ["cgg", "Rukiga", "Kiga"], ["kg", "Kikongo", "Kikongo"],
    ["ktu", "Kituba", "Kituba"], ["trp", "Kokborok", "Kokborok"], ["ltg", "Latgalīšu", "Latgalian"],
    ["lij", "Ligure", "Ligurian"], ["li", "Limburgs", "Limburgish"], ["lmo", "Lombard", "Lombard"],
    ["luo", "Dholuo", "Luo"], ["mad", "Madhura", "Madurese"], ["mak", "Makassar", "Makassar"],
    ["ms-Arab", "بهاس ملايو", "Malay (Jawi)"], ["mh", "Kajin M̧ajeļ", "Marshallese"],
    ["mwr", "मारवाड़ी", "Marwadi"], ["mfe", "Morisien", "Mauritian Creole"], ["chm", "Марий", "Meadow Mari"],
    ["min", "Minangkabau", "Minang"], ["nhe", "Nahuatl", "Nahuatl (Eastern Huasteca)"],
    ["ndc-ZW", "Ndau", "Ndau"], ["new", "नेपाल भाषा", "Nepalbhasa (Newari)"], ["bm-Nkoo", "ߒߞߏ", "NKo"],
    ["nus", "Thok Naath", "Nuer"], ["oc", "Occitan", "Occitan"], ["pag", "Pangasinan", "Pangasinan"],
    ["pam", "Kapampangan", "Pampanga"], ["pap", "Papiamentu", "Papiamento"],
    ["pa-Arab", "پنجابی (شاہ مکھی)", "Punjabi (Shahmukhi)"], ["kek", "Q'eqchi'", "Q'eqchi'"],
    ["rom", "Romani", "Romani"], ["rn", "Ikirundi", "Rundi"], ["sat-Latn", "Santali (Latin)", "Santali (Latin)"],
    ["sat", "ᱥᱟᱱᱛᱟᱲᱤ", "Santali (Ol Chiki)"], ["sg", "Sängö", "Sango"],
    ["crs", "Kreol Seselwa", "Seychellois Creole"], ["shn", "ၵႂၢမ်းတႆး", "Shan"], ["scn", "Sicilianu", "Sicilian"],
    ["szl", "Ślōnski", "Silesian"], ["se", "Davvisámegiella", "Sami (North)"], ["sus", "Susu", "Susu"],
    ["ss", "SiSwati", "Swati"], ["ty", "Reo Tahiti", "Tahitian"], ["ber-Latn", "Tamazight", "Tamazight"],
    ["ber", "ⵜⴰⵎⴰⵣⵉⵖⵜ", "Tamazight (Tifinagh)"], ["tet", "Tetun", "Tetum"], ["bo", "བོད་སྐད།", "Tibetan"],
    ["tiv", "Tiv", "Tiv"], ["tpi", "Tok Pisin", "Tok Pisin"], ["to", "Lea Faka-Tonga", "Tongan"],
    ["lua", "Tshiluba", "Tshiluba"], ["tn", "Setswana", "Tswana"], ["tum", "Chitumbuka", "Tumbuka"],
    ["tyv", "Тыва дыл", "Tuvan"], ["udm", "Удмурт", "Udmurt"], ["ve", "Tshivenḓa", "Venda"],
    ["vec", "Vèneto", "Venetian"], ["war", "Winaray", "Waray"], ["wo", "Wolof", "Wolof"],
    ["yua", "Maaya T'aan", "Yucatec Maya"], ["zap", "Zapotec", "Zapotec"], ["os", "Ирон", "Ossetian"],
  ];
  var LANGS = BASE.concat(EXTRA);
  var WIDGET = {}; // codes the Google website widget itself offers (filled from BASE, then from the live widget)
  BASE.forEach(function (l) {
    WIDGET[l[0]] = true;
  });
  var NUM = {}; // code -> list number. English (Original) is no. 1, the others start at 2.
  /* Sort every language A-Z by its English name and number it. */
  function sortLangs() {
    LANGS.sort(function (a, b) {
      return a[2].localeCompare(b[2], "en", { sensitivity: "base" }) || (a[0] < b[0] ? -1 : 1);
    });
    NUM = {};
    LANGS.forEach(function (l, i) {
      NUM[l[0]] = i + 2;
    });
  }
  sortLangs();
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
  /* Every place a "googtrans" cookie could live. Google's own script writes this cookie on the
     site's domain (".example.com") as well as on the host, while we used to write it on the host only.
     Two cookies with the same name then exist, and Google may read the OLD one (for example an earlier
     "Arabic" choice) no matter which language was picked later. So before every change we delete the
     cookie everywhere, and only then write one fresh copy. */
  function cookieDomains() {
    var h = location.hostname,
      out = [""];
    if (h && h.indexOf(".") !== -1 && !/^[\d.]+$/.test(h) && h.indexOf(":") === -1) {
      var parts = h.split(".");
      for (var i = 0; i < parts.length - 1; i++) {
        var d = parts.slice(i).join(".");
        out.push(d, "." + d);
      }
    }
    return out;
  }
  function cookiePaths() {
    var out = ["/"],
      segs = location.pathname.split("/"),
      acc = "";
    for (var i = 1; i < segs.length; i++) {
      acc += "/" + segs[i];
      if (acc !== "/") out.push(acc);
    }
    return out;
  }
  function clearCookies() {
    var past = "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
    var domains = cookieDomains(),
      paths = cookiePaths();
    paths.forEach(function (p) {
      domains.forEach(function (d) {
        document.cookie = "googtrans" + past + "; path=" + p + (d ? "; domain=" + d : "");
      });
    });
  }
  function setCookie(code) {
    clearCookies();
    document.cookie = "googtrans=/en/" + code + "; path=/; SameSite=Lax";
  }
  function langName(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === code) return LANGS[i];
    return null;
  }


  /* ---------- translate.goog (Google Translate's website mode) ---------- */
  var PROXY_SUFFIX = ".translate.goog";
  var onProxy = location.hostname.slice(-PROXY_SUFFIX.length) === PROXY_SUFFIX;
  // example.com -> example-com.translate.goog ; a "-" in the name becomes "--"
  function proxyHost(h) {
    return h.replace(/-/g, "--").replace(/\./g, "-") + PROXY_SUFFIX;
  }
  function originUrl() {
    var cfg = window.ZL_CONFIG && window.ZL_CONFIG.siteOrigin;
    if (cfg) {
      try {
        var u = new URL(cfg);
        if (proxyHost(u.hostname) === location.hostname) return u.origin;
      } catch (e) {}
    }
    var h = location.hostname
      .slice(0, -PROXY_SUFFIX.length)
      .replace(/--/g, "\u0001")
      .replace(/-/g, ".")
      .replace(/\u0001/g, "-");
    return "https://" + h;
  }
  function cleanSearch() {
    var parts = location.search
      .replace(/^\?/, "")
      .split("&")
      .filter(function (x) {
        return x && x.indexOf("_x_tr_") !== 0;
      });
    return parts.length ? "?" + parts.join("&") : "";
  }
  function proxyLang() {
    var m = location.search.match(/[?&]_x_tr_tl=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function canProxy() {
    var h = location.hostname;
    return /^https?:$/.test(location.protocol) && h.indexOf(".") !== -1 && !/^[\d.]+$/.test(h);
  }
  function goProxy(code) {
    var base = onProxy ? new URL(originUrl()).hostname : location.hostname;
    var path = location.pathname + cleanSearch();
    var q = "_x_tr_sl=en&_x_tr_tl=" + encodeURIComponent(code) + "&_x_tr_hl=en&_x_tr_pto=wapp";
    location.href = "https://" + proxyHost(base) + path + (path.indexOf("?") === -1 ? "?" : "&") + q + location.hash;
  }
  function startProxy(code) {
    if (!onProxy && !canProxy()) {
      return setStatus("This language works only on the live website, not on a local copy of it.", "error");
    }
    var l = langName(code);
    setStatus("Translating to " + (l ? l[2] : code) + "…", "loading");
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    if (!onProxy) clearCookies();
    goProxy(code);
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
    var added = false;
    Array.prototype.forEach.call(sel.options, function (o) {
      if (!o.value) return;
      WIDGET[o.value] = true;
      if (!known[o.value]) {
        LANGS.push([o.value, o.text, o.text]);
        added = true;
      }
    });
    if (added) sortLangs();
    // Re-draw the list only if something new was added, and keep the visitor's scroll position
    // (a surprise redraw while choosing could make the click land on a different language).
    if (added && !panel.hidden) {
      var top = list.scrollTop;
      renderList();
      list.scrollTop = top;
    }
  }
  /* Safety net: once Google's widget is ready, make sure it really is on the language the visitor
     picked. If it picked up a stale language by itself (e.g. Arabic from an old cookie), switch it. */
  var enforced = false;
  function enforceActive() {
    if (enforced || !active) return;
    enforced = true;
    setTimeout(function () {
      var sel = findCombo();
      if (!sel) return;
      var want = null;
      Array.prototype.forEach.call(sel.options, function (o) {
        if (o.value === active || (ALIAS[active] && o.value === ALIAS[active])) want = o.value;
      });
      if (want && sel.value !== want) {
        sel.value = want;
        sel.dispatchEvent(new Event("change"));
      }
    }, 700);
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
            enforceActive();
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

  var active = onProxy ? proxyLang() : getSaved();
  if (active === "en") active = null;
  if (active && !onProxy && !WIDGET[active]) active = null; // a proxy-only language is never remembered

  function setStatus(msg, type) {
    status.textContent = msg || "";
    status.dataset.type = type || "";
  }
  function renderList() {
    var q = search.value.trim().toLowerCase();
    list.textContent = "";
    function item(code, label, sub, num) {
      var li = el("li");
      var b = el("button", "zl-tr-item");
      b.type = "button";
      b.dataset.code = code;
      var n = el("span", null, "(" + num + ") " + label);
      b.appendChild(n);
      if (sub) b.appendChild(el("small", null, sub));
      if ((code === "en" && !active) || code === active) b.setAttribute("aria-current", "true");
      li.appendChild(b);
      list.appendChild(li);
    }
    if (!q || "english original".indexOf(q) !== -1 || q === "1") item("en", "English (Original)", "", 1);
    LANGS.forEach(function (l) {
      var num = NUM[l[0]];
      if (!q || (l[1] + " " + l[2]).toLowerCase().indexOf(q) !== -1 || String(num) === q) {
        item(l[0], l[2], l[1] !== l[2] ? l[1] : "", num);
      }
    });
    if (!list.children.length) setStatus("No language matches your search.", "info");
    else if (status.dataset.type === "info") setStatus("");
  }

  function restore() {
    setStatus("Restoring the original language…", "loading");
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    if (onProxy) {
      location.href = originUrl() + location.pathname + cleanSearch() + location.hash;
      return;
    }
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
    if (onProxy) return startProxy(code); // already on the translate.goog version: it handles every language
    // Languages the widget offers are translated in place; all others go through translate.goog.
    var inWidget = !!WIDGET[code];
    var sel = findCombo();
    if (sel && sel.options.length > 1) {
      var has = function (v) {
        return Array.prototype.some.call(sel.options, function (o) {
          return o.value === v;
        });
      };
      inWidget = has(code) || !!(ALIAS[code] && has(ALIAS[code]));
    }
    if (!inWidget) return startProxy(code);
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
    if (onProxy) return; // Google's own translate.goog page already did the translation
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
