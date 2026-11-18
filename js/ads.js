/* Zoon Labss advertising slot. Shows an image or video banner from ads/ads.json (campaigns you control).
   Self-hosted media only, no third-party ad scripts, no tracking. All text is inserted with textContent.
   Nothing is shown (and the slot stays hidden) when no campaign is active today. */
(function () {
  "use strict";
  var me = document.currentScript;
  var slot = document.querySelector("[data-ad-slot]");
  if (!me || !slot) return;
  var base = new URL("../", me.src).href;
  var MEDIA = /^ads\/media\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:webp|png|jpe?g|gif|avif|mp4|webm)$/i;
  var DATE = /^\d{4}-\d{2}-\d{2}$/;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function url(path) { return MEDIA.test(path || "") ? base + path : null; }
  function safeLink(href) {
    try { var u = new URL(href); return u.protocol === "https:" ? u.href : null; } catch (e) { return null; }
  }
  function active(c, today) {
    return c && c.slot === slot.getAttribute("data-ad-slot") && DATE.test(c.start || "") && DATE.test(c.end || "") &&
      c.start <= today && today <= c.end && safeLink(c.link) && (c.label === "Sponsored" || c.label === "Advertisement");
  }
  function size(n, w, h) {
    if (w > 0 && h > 0) { n.setAttribute("width", String(w)); n.setAttribute("height", String(h)); }
  }
  function render(c) {
    var wrap = el("div", "ad-box");
    wrap.appendChild(el("span", "ad-label", c.label + " \u00b7 " + String(c.advertiser || "")));
    var href = safeLink(c.link);
    if (c.image && url(c.image.desktop)) {
      var a = el("a");
      a.href = href; a.target = "_blank"; a.rel = "sponsored noopener noreferrer";
      var pic = el("picture");
      if (c.image.mobile && url(c.image.mobile)) {
        var src = el("source");
        src.media = "(max-width: 640px)"; src.srcset = url(c.image.mobile);
        pic.appendChild(src);
      }
      var img = el("img");
      img.src = url(c.image.desktop); img.alt = String(c.image.alt || ""); img.loading = "lazy"; img.decoding = "async";
      size(img, c.image.width, c.image.height);
      pic.appendChild(img); a.appendChild(pic); wrap.appendChild(a);
    } else if (c.video && url(c.video.src)) {
      var v = el("video");
      v.controls = true; v.muted = true; v.playsInline = true; v.preload = "none";
      v.setAttribute("aria-label", String(c.video.label || c.advertiser || "Advertisement video"));
      if (url(c.video.poster)) v.poster = url(c.video.poster);
      size(v, c.video.width, c.video.height);
      var s = el("source"); s.src = url(c.video.src);
      s.type = /\.webm$/i.test(c.video.src) ? "video/webm" : "video/mp4";
      v.appendChild(s); wrap.appendChild(v);
      var go = el("a", "btn ad-visit", "Visit " + String(c.advertiser || "advertiser"));
      go.href = href; go.target = "_blank"; go.rel = "sponsored noopener noreferrer";
      wrap.appendChild(go);
    } else { return false; }
    slot.appendChild(wrap);
    return true;
  }

  fetch(base + "ads/ads.json", { credentials: "same-origin" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var today = new Date().toISOString().slice(0, 10);
      var list = ((data && data.campaigns) || []).filter(function (c) { return active(c, today); });
      if (!list.length) return;
      var pick = list[Math.floor(Math.random() * list.length)];
      if (render(pick)) slot.hidden = false;
    })
    .catch(function () { /* no ad is shown if anything fails */ });
})();
